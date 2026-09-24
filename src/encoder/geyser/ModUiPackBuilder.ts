import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { extractModUiAssets } from "../../parser/itemsadder/ParserItemsAdderGenerated.js";
import { buildTitleGlyphs } from "./TitleGlyphBuilder.js";

const EC_UI_HEADER_UUID = "02606e92-08d8-4bd9-827e-a37b66e77b8d";
const EC_UI_MODULE_UUID = "3995c4ca-c5f0-4d7e-8641-d40ed4f25b89";
const FIXED_TIME = new Date("1980-01-01T00:00:00Z");

type PackVersion = [number, number, number];

interface PackManifest {
    format_version: number;
    header: {
        uuid: string;
        version: number[];
        [key: string]: unknown;
    };
    modules: Array<{
        uuid: string;
        version: number[];
        type: string;
        [key: string]: unknown;
    }>;
    [key: string]: unknown;
}

interface LoadedPack {
    files: Map<string, Buffer>;
    manifest: PackManifest;
    headerVersion: PackVersion;
    moduleVersion: PackVersion;
    moduleIndex: number;
}

export interface BuildModUiPackOptions {
    basePack: string;
    generatedZip: string;
    currentPack?: string;
    outDir: string;
}

export interface BuildModUiPackResult {
    changed: boolean;
    version: PackVersion;
    overlayFileCount: number;
    totalFileCount: number;
    contentHash: string;
    outputPack?: string;
}

export interface DeployModUiPackResult {
    targetPack: string;
    backupPack?: string;
    sha256: string;
    size: number;
}

export function validateModUiEntryPath(entryName: string, label: string): string {
    const normalized = entryName.replace(/\\/g, "/");
    const parts = normalized.split("/");
    if (
        entryName !== normalized ||
        normalized.startsWith("/") ||
        /^[A-Za-z]:/.test(normalized) ||
        parts.some(part => part === "" || part === "." || part === "..") ||
        path.posix.normalize(normalized) !== normalized
    ) {
        throw new Error(`${label} contains unsafe ZIP path: ${entryName}`);
    }
    return normalized;
}

function parseVersion(value: unknown, label: string): PackVersion {
    if (
        !Array.isArray(value) || value.length !== 3 ||
        value.some(part => !Number.isInteger(part) || part < 0)
    ) {
        throw new Error(`${label} must be a three-part non-negative integer version`);
    }
    return [value[0], value[1], value[2]];
}

function compareVersion(a: PackVersion, b: PackVersion): number {
    for (let i = 0; i < 3; i++) {
        if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
}

function incrementHighest(versions: PackVersion[]): PackVersion {
    const highest = versions.reduce((best, value) => compareVersion(value, best) > 0 ? value : best);
    if (highest[2] >= Number.MAX_SAFE_INTEGER) throw new Error("ec_ui patch version cannot be incremented safely");
    return [highest[0], highest[1], highest[2] + 1];
}

function loadPack(zipPath: string, label: string): LoadedPack {
    try {
        if (!fs.statSync(zipPath).isFile()) throw new Error();
    } catch {
        throw new Error(`${label} does not exist: ${zipPath}`);
    }

    const files = new Map<string, Buffer>();
    let zip: AdmZip;
    try {
        zip = new AdmZip(zipPath);
        for (const entry of zip.getEntries()) {
            if (entry.isDirectory) continue;
            const name = validateModUiEntryPath(entry.entryName, label);
            if (files.has(name)) throw new Error(`${label} contains duplicate ZIP entry: ${name}`);
            files.set(name, entry.getData());
        }
    } catch (error) {
        if (error instanceof Error && error.message.startsWith(label)) throw error;
        throw new Error(`${label} is not a readable ZIP: ${zipPath}`);
    }

    const manifestBytes = files.get("manifest.json");
    if (!manifestBytes) throw new Error(`${label} has no root manifest.json`);

    let manifest: PackManifest;
    try {
        manifest = JSON.parse(manifestBytes.toString("utf-8")) as PackManifest;
    } catch {
        throw new Error(`${label} manifest.json is invalid JSON`);
    }
    if (manifest.format_version !== 2 || !manifest.header || !Array.isArray(manifest.modules)) {
        throw new Error(`${label} manifest is not a format_version 2 resource pack`);
    }
    if (manifest.header.uuid !== EC_UI_HEADER_UUID) {
        throw new Error(`${label} header UUID is not the expected EaseCation UI UUID`);
    }
    const moduleIndex = manifest.modules.findIndex(module =>
        module.uuid === EC_UI_MODULE_UUID && module.type === "resources"
    );
    if (moduleIndex < 0) throw new Error(`${label} has no expected EaseCation UI resources module`);

    return {
        files,
        manifest,
        headerVersion: parseVersion(manifest.header.version, `${label} header`),
        moduleVersion: parseVersion(manifest.modules[moduleIndex].version, `${label} module`),
        moduleIndex,
    };
}

function fingerprint(files: Map<string, Buffer>): string {
    const hash = createHash("sha256");
    for (const name of [...files.keys()].filter(name => name !== "manifest.json").sort()) {
        const content = files.get(name)!;
        hash.update(name, "utf-8");
        hash.update("\0");
        hash.update(String(content.length), "utf-8");
        hash.update("\0");
        hash.update(new Uint8Array(content));
    }
    return hash.digest("hex");
}

function writeDeterministicZip(files: Map<string, Buffer>, outputPack: string): void {
    fs.mkdirSync(path.dirname(outputPack), { recursive: true });
    const zip = new AdmZip();
    for (const name of [...files.keys()].sort()) {
        const safeName = validateModUiEntryPath(name, "generated ec_ui pack");
        const entry = zip.addFile(safeName, files.get(name)!, "", 0o644);
        entry.header.time = FIXED_TIME;
    }
    zip.writeZip(outputPack);
}

export async function buildModUiPack(options: BuildModUiPackOptions): Promise<BuildModUiPackResult> {
    const base = loadPack(options.basePack, "ec_ui base pack");
    const current = options.currentPack && fs.existsSync(options.currentPack)
        ? loadPack(options.currentPack, "deployed ec_ui pack")
        : undefined;
    const overlay = extractModUiAssets(options.generatedZip);
    if (overlay.length === 0) {
        throw new Error(`generated.zip contains no assets/minecraft/textures/ui files: ${options.generatedZip}`);
    }

    const candidateFiles = new Map(base.files);
    const overlayPaths = new Set<string>();
    for (const file of overlay) {
        const name = validateModUiEntryPath(file.relPath, "generated ModUI assets");
        if (!name.startsWith("textures/ui/")) {
            throw new Error(`generated ModUI asset escaped textures/ui: ${name}`);
        }
        if (overlayPaths.has(name)) throw new Error(`generated ModUI assets contain duplicate path: ${name}`);
        overlayPaths.add(name);
        candidateFiles.set(name, file.content);
    }

    const titleFonts = await buildTitleGlyphs(options.generatedZip, base.files);
    for (const [name, bytes] of titleFonts) candidateFiles.set(name, bytes);

    const contentHash = fingerprint(candidateFiles);
    const outputPack = path.join(options.outDir, "ec_ui.zip");
    fs.rmSync(outputPack, { force: true });
    const currentManifestAligned = current && compareVersion(current.headerVersion, current.moduleVersion) === 0;
    if (current && currentManifestAligned && fingerprint(current.files) === contentHash) {
        return {
            changed: false,
            version: current.headerVersion,
            overlayFileCount: overlay.length,
            totalFileCount: candidateFiles.size,
            contentHash,
        };
    }

    const versions = [base.headerVersion, base.moduleVersion];
    if (current) versions.push(current.headerVersion, current.moduleVersion);
    const nextVersion = incrementHighest(versions);
    const manifest = JSON.parse(JSON.stringify(base.manifest)) as PackManifest;
    manifest.header.version = [...nextVersion];
    manifest.modules[base.moduleIndex].version = [...nextVersion];
    candidateFiles.set("manifest.json", Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`, "utf-8"));

    writeDeterministicZip(candidateFiles, outputPack);

    const built = loadPack(outputPack, "built ec_ui pack");
    if (compareVersion(built.headerVersion, nextVersion) !== 0 || compareVersion(built.moduleVersion, nextVersion) !== 0) {
        throw new Error("built ec_ui pack did not preserve the selected manifest version");
    }
    if (fingerprint(built.files) !== contentHash) {
        throw new Error("built ec_ui pack content does not match the staged base and ModUI overlay");
    }

    return {
        changed: true,
        version: nextVersion,
        overlayFileCount: overlay.length,
        totalFileCount: candidateFiles.size,
        contentHash,
        outputPack,
    };
}

function timestamp(): string {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function fileSha256(file: string): string {
    return createHash("sha256").update(new Uint8Array(fs.readFileSync(file))).digest("hex");
}

export function deployModUiPack(sourcePack: string, targetPack: string, backupDir: string): DeployModUiPackResult {
    loadPack(sourcePack, "new ec_ui pack");
    if (fs.existsSync(targetPack)) loadPack(targetPack, "deployed ec_ui pack");

    fs.mkdirSync(path.dirname(targetPack), { recursive: true });
    fs.mkdirSync(backupDir, { recursive: true });
    const temporary = path.join(path.dirname(targetPack), `.ec_ui.zip.${process.pid}.${Date.now()}.tmp`);
    let backupPack: string | undefined;
    try {
        if (fs.existsSync(targetPack)) {
            backupPack = path.join(backupDir, `ec_ui.zip.bak-${timestamp()}`);
            if (fs.existsSync(backupPack)) backupPack += `-${process.pid}`;
            fs.copyFileSync(targetPack, backupPack, fs.constants.COPYFILE_EXCL);
        }
        fs.copyFileSync(sourcePack, temporary);
        loadPack(temporary, "staged ec_ui deployment");
        if (fileSha256(temporary) !== fileSha256(sourcePack)) {
            throw new Error("staged ec_ui deployment checksum differs from build output");
        }
        fs.renameSync(temporary, targetPack);
    } finally {
        fs.rmSync(temporary, { force: true });
    }

    return {
        targetPack,
        backupPack,
        sha256: fileSha256(targetPack),
        size: fs.statSync(targetPack).size,
    };
}
