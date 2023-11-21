if (!fs.existsSync('node_modules/ia-vscode')) {
    console.log('Module ia-vscode not found! Please run "yarn" first.');
}
if (!fs.existsSync('node_modules/minecraft-bedrock-schemas')) {
    console.log('Module minecraft-bedrock-json-schemas not found! Please run "yarn" first.');
}

import { compile } from 'json-schema-to-typescript'
import { schemas } from "./schemas.js";
import { JSONSchema4 } from "json-schema";
import path from "path";
import stripJsonComments from 'strip-json-comments';
import fs from 'fs-extra';

// 处理schemas，将change_me替换为additionalProperties
const processProperties = (schema: JSONSchema4) => {
    if (schema['markdownDescription']) {
        schema.description = schema['markdownDescription'];
    }
    if (schema.properties) {
        // 如果properties中包含change_me，则将其赋值给additionalProperties
        if (schema.properties['change_me']) {
            schema.additionalProperties = schema.properties['change_me'];
        }
        if (schema.properties['custom_item']) {
            schema.additionalProperties = schema.properties['custom_item'];
        }
        // 遍历properties，如果开头包含change_me，则将其移除
        for (const key of Object.keys(schema.properties)) {
            if (key.startsWith('change_me')) {
                delete schema.properties[key];
            } else if (key.startsWith("custom_item")) {
                delete schema.properties[key];
            }
            // 递归处理子元素
            if (schema.properties[key]?.properties) {
                processProperties(schema.properties[key]);
            }
        }
    }
    if (schema['$defs']) {
        for (const key of Object.keys(schema['$defs'])) {
            if (key.startsWith('change_me')) {
                delete schema['$defs'][key];
            }
            // 递归处理子元素
            if (schema['$defs'][key]?.properties) {
                processProperties(schema['$defs'][key]);
            }
        }

    }
}

const process = async () => {
    // === Items Adder ===

    console.log('Processing Items Adder...');

    // @ts-ignore
    processProperties(schemas);

    // @ts-ignore
    const ts = await compile(schemas, 'schemas.ts');

    // 写入到文件：schemas.d.ts
    fs.writeFileSync('src/typings/itemsadder/schemas.d.ts', ts);
    console.log('schemas.d.ts generated!');

    // === Bedrock ===

    console.log('Processing Minecraft-bedrock-json-schemas...');

    // 将文件夹的所有文件复制到/tmp
    const tmpDir = 'tmp';
    if (fs.existsSync(tmpDir)) {
        await fs.rm(tmpDir, { recursive: true });
    }
    fs.mkdirSync(tmpDir);

    await fs.copy('node_modules/minecraft-bedrock-schemas/source', tmpDir);

    //递归读取文件夹Minecraft-bedrock-json-schemas/source下的所有json文件
    const readJsonFiles = (dir: string, ignores: string[]) => {
        let jsonFiles: string[] = [];
        fs.readdirSync(dir).forEach(file => {
            if (ignores.includes(file)) {
                return;
            }
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                // 如果是目录，则递归读取
                jsonFiles = jsonFiles.concat(readJsonFiles(fullPath, ignores));
            } else if (path.extname(fullPath) === '.json') {
                // 如果是json文件，则添加到列表中
                jsonFiles.push(fullPath);
            }
        });
        return jsonFiles;
    }

    const jsonFiles = readJsonFiles(tmpDir, ['compress_specification.json']);
    for (let jsonFile of jsonFiles) {
        // 去除注释并保存
        const jsonWithComments = fs.readFileSync(jsonFile, 'utf8');
        const json = stripJsonComments(jsonWithComments);
        fs.writeFileSync(jsonFile, json);
    }
    for (const file of jsonFiles) {
        console.log(`Processing ${file}...`)
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        processProperties(data);
        try {
            const ts = await compile(data, path.basename(file), {
                // 获得文件所在的目录
                cwd: path.resolve(file, '..'),
            });
            // 写入到文件（自动创建对应的目录）
            // 去除前2级
            const dirname = path.dirname(file).split(path.sep).slice(2).join(path.sep);
            fs.mkdirSync(`src/typings/bedrock/schemas/${dirname}`, { recursive: true });
            const fileName = path.basename(file, '.json');
            fs.writeFileSync(`src/typings/bedrock/schemas/${dirname}/${fileName}.d.ts`, ts);
            console.log(`${fileName}.d.ts generated!`);
        } catch (e) {
            console.log(`Error: ${e}`);
        }
    }

    // 删除临时文件夹
    await fs.rm(tmpDir, { recursive: true });
}

process().then(() => console.log("Done."));