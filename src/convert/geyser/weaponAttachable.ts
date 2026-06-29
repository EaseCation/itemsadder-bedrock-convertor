// 武器手持 attachable 烘焙：把 mc-model-geo 产的"裸几何" + Java item model 的 display
// 烘焙成 Geyser 自定义物品的基岩 3D 手持三件套（geometry 骨链 + attachable + animation）。
//
// 确定性移植自 Kas-tle "Java to Bedrock 3D Model Converter" 的手持配方，
// 与 skill 脚本 build_bedrock_attachable.py 逐字段等价（golden = 现有 weapons_geyser.zip）。
//
// 几何骨链（每节 pivot [0,8,0]）：
//   geysercmd      绑手: binding "c.item_slot == 'head' ? 'head' : q.item_slot_to_bone_name(c.item_slot)"
//     └─ geysercmd_x   烘焙 Java display rotation 的 X（取负）+ display translation/scale
//         └─ geysercmd_y   烘焙 Java display rotation 的 Y（取负）
//             └─ geysercmd_z   烘焙 Java display rotation 的 Z（原值）+ 放全部 cubes
//
// 手持位置/缩放靠 animation（基岩几何骨不能 position/scale，只能 pivot+rotation）：
//   thirdperson_main_hand: geysercmd rotation[90,0,0] position[0,13,-3] scale=<java tp scale>
//   firstperson_main_hand: geysercmd rotation[90,60,-40] position[4,10,4] scale=1.5*<java fp scale>
//   _x/_y/_z 各自烘焙 Java thirdperson/firstperson_righthand 的旋转分量（带符号翻转）
//   tp 的 _x position = [-tx, ty, tz]；fp 的 _x position = [-tx, ty, -tz]

type Vec3 = [number, number, number];

/** per-weapon 姿态微调覆盖（默认值 = Kas-tle 通用基准，已适配 Adventurer 系列） */
export interface WeaponPoseOverride {
    tpRot?: Vec3;             // 第三人称根骨 rotation，默认 [90,0,0]
    tpPos?: Vec3;             // 第三人称根骨 position，默认 [0,13,-3]
    fpRot?: Vec3;             // 第一人称根骨 rotation，默认 [90,60,-40]
    fpPos?: Vec3;             // 第一人称根骨 position，默认 [4,10,4]
    fpScale?: number;        // 第一人称根骨 scale（标量），默认 1.5
    scaleMul?: number;       // 叠加在 java display scale 上的整体微调，默认 1.0
    tpGrip?: Vec3;           // 第三人称握点微调（加到 geysercmd_x position），默认 [0,0,0]
    fpGrip?: Vec3;           // 第一人称握点微调（加到 geysercmd_x position），默认 [0,0,0]
    materialDefault?: string;    // 默认 "entity_alphatest"
    materialEnchanted?: string;  // 默认 "entity_alphatest_glint"
}

export interface WeaponBuildInput {
    name: string;            // gladiator_sword（attachable identifier 后缀 / 文件名）
    identifier: string;      // geometry.<ns>.<name>
    ns: string;              // 基岩物品命名空间前缀，固定 heypixel
    texture: string;         // attachable textures.default（几何贴图，RP 内相对路径、无 .png）
    rawGeometry: any;        // mc-model-geo convertModel(...).geometry（裸几何）
    javaModel: any;          // IA Java item model（读 display）
    pose?: WeaponPoseOverride;
}

export interface WeaponBuildResult {
    geometry: any;           // 4 骨链 .geo.json
    attachable: any;         // attachables/<name>.json
    animation: any;          // animations/<name>.animation.json
}

const PIVOT: Vec3 = [0, 8, 0];

const DEF = {
    tpRot: [90, 0, 0] as Vec3,
    tpPos: [0, 13, -3] as Vec3,
    fpRot: [90, 60, -40] as Vec3,
    fpPos: [4, 10, 4] as Vec3,
    fpScale: 1.5,
    scaleMul: 1.0,
    grip: [0, 0, 0] as Vec3,
    materialDefault: "entity_alphatest",
    materialEnchanted: "entity_alphatest_glint",
};

function dispRot(model: any, key: string): Vec3 {
    const d = (model?.display ?? {})[key] ?? {};
    const r = d.rotation ?? [0, 0, 0];
    return [Number(r[0]) || 0, Number(r[1]) || 0, Number(r[2]) || 0];
}
function dispTrans(model: any, key: string): Vec3 {
    const d = (model?.display ?? {})[key] ?? {};
    const t = d.translation ?? [0, 0, 0];
    return [Number(t[0]) || 0, Number(t[1]) || 0, Number(t[2]) || 0];
}
function dispScale(model: any, key: string, mul: number): Vec3 {
    const d = (model?.display ?? {})[key] ?? {};
    const s = d.scale;
    if (Array.isArray(s)) return [Number(s[0]) * mul, Number(s[1]) * mul, Number(s[2]) * mul];
    if (typeof s === "number") return [s * mul, s * mul, s * mul];
    return [mul, mul, mul];
}

/**
 * 确定性烘焙武器手持三件套。纯函数，不触碰文件系统。
 * 与 build_bedrock_attachable.py 逐字段等价。
 */
export function buildWeaponAttachable(input: WeaponBuildInput): WeaponBuildResult {
    const { name, identifier, ns, texture, rawGeometry, javaModel } = input;
    const pose = input.pose ?? {};
    const tpRot = pose.tpRot ?? DEF.tpRot;
    const tpPos = pose.tpPos ?? DEF.tpPos;
    const fpRot = pose.fpRot ?? DEF.fpRot;
    const fpPos = pose.fpPos ?? DEF.fpPos;
    const fpScale = pose.fpScale ?? DEF.fpScale;
    const scaleMul = pose.scaleMul ?? DEF.scaleMul;
    const tpGrip = pose.tpGrip ?? DEF.grip;
    const fpGrip = pose.fpGrip ?? DEF.grip;
    const materialDefault = pose.materialDefault ?? DEF.materialDefault;
    const materialEnchanted = pose.materialEnchanted ?? DEF.materialEnchanted;

    // ---- 几何：收集裸几何全部 cubes → geysercmd_z；description 原样保留、只改 identifier ----
    const g0 = rawGeometry["minecraft:geometry"][0];
    const desc = { ...g0.description, identifier };
    const cubes: any[] = [];
    for (const b of g0.bones ?? []) {
        if (Array.isArray(b.cubes)) cubes.push(...b.cubes);
    }
    const geometry = {
        format_version: rawGeometry.format_version ?? "1.16.0",
        "minecraft:geometry": [{
            description: desc,
            bones: [
                { name: "geysercmd", pivot: PIVOT, binding: "c.item_slot == 'head' ? 'head' : q.item_slot_to_bone_name(c.item_slot)" },
                { name: "geysercmd_x", parent: "geysercmd", pivot: PIVOT },
                { name: "geysercmd_y", parent: "geysercmd_x", pivot: PIVOT },
                { name: "geysercmd_z", parent: "geysercmd_y", pivot: PIVOT, cubes },
            ],
        }],
    };

    // ---- 动画：display rotation 拆到 _x/_y/_z（X/Y 取负、Z 原值）；translation/scale 放 _x ----
    const tpR = dispRot(javaModel, "thirdperson_righthand");
    const tpT = dispTrans(javaModel, "thirdperson_righthand");
    const tpS = dispScale(javaModel, "thirdperson_righthand", scaleMul);
    const fpR = dispRot(javaModel, "firstperson_righthand");
    const fpT = dispTrans(javaModel, "firstperson_righthand");
    const fpS = dispScale(javaModel, "firstperson_righthand", scaleMul);

    const tpXPos: Vec3 = [-tpT[0] + tpGrip[0], tpT[1] + tpGrip[1], tpT[2] + tpGrip[2]];
    const fpXPos: Vec3 = [-fpT[0] + fpGrip[0], fpT[1] + fpGrip[1], -fpT[2] + fpGrip[2]];

    const animTp = `animation.${ns}.${name}.thirdperson_main_hand`;
    const animFp = `animation.${ns}.${name}.firstperson_main_hand`;
    const animation = {
        format_version: "1.8.0",
        animations: {
            [animTp]: {
                loop: true,
                bones: {
                    geysercmd: { rotation: tpRot, position: tpPos },
                    geysercmd_x: { rotation: [-tpR[0], 0, 0], position: tpXPos, scale: tpS },
                    geysercmd_y: { rotation: [0, -tpR[1], 0] },
                    geysercmd_z: { rotation: [0, 0, tpR[2]] },
                },
            },
            [animFp]: {
                loop: true,
                bones: {
                    geysercmd: { rotation: fpRot, position: fpPos, scale: fpScale },
                    geysercmd_x: { rotation: [-fpR[0], 0, 0], position: fpXPos, scale: fpS },
                    geysercmd_y: { rotation: [0, -fpR[1], 0] },
                    geysercmd_z: { rotation: [0, 0, fpR[2]] },
                },
            },
        },
    };

    // ---- attachable：固定结构（按 main_hand/first_person 切动画） ----
    const attachable = {
        format_version: "1.10.0",
        "minecraft:attachable": {
            description: {
                identifier: `${ns}:${name}`,
                materials: { default: materialDefault, enchanted: materialEnchanted },
                textures: { default: texture, enchanted: "textures/misc/enchanted_item_glint" },
                geometry: { default: identifier },
                animations: { thirdperson_main_hand: animTp, firstperson_main_hand: animFp },
                scripts: {
                    pre_animation: ["v.main_hand = c.item_slot == 'main_hand';"],
                    animate: [
                        { thirdperson_main_hand: "v.main_hand && !c.is_first_person" },
                        { firstperson_main_hand: "v.main_hand && c.is_first_person" },
                    ],
                },
                render_controllers: ["controller.render.item_default"],
            },
        },
    };

    return { geometry, attachable, animation };
}
