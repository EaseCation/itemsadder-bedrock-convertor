# itemsadder-bedrock-convertor

Convert addons between Items Adder and Bedrock

## 1. 安装依赖

npm install

若你需要在本地进行 TypeScript 编译，请确保安装：

npm install -g typescript

或使用 npx tsc 来执行编译。

## 2. 编译脚本

在项目根目录执行：

```bash
npm run build
```

或手动使用 TypeScript 命令：

```bash
tsc
```

编译成功后，会在 dist/（或你的 outDir 设置）下产生对应的可执行 JavaScript 文件。

## 3. 运行示例

下面是一个最常见的示例命令（假设你在 dist 里有编译好的 index.js）：

```bash
node dist/index.js \
    --input-path "/absolute/path/to/ItemsAdder/contents" \
    --namespace "easecation" \
    --behavior-name "EaseCation Behavior Pack" \
    --behavior-description "Auto-generated Behavior Pack" \
    --behavior-version "1.0.5" \
    --behavior-uuid "0674ae3c-92aa-417b-aa26-e40aea3a736f" \
    --resource-name "EaseCation Resource Pack" \
    --resource-description "Auto-generated Resource Pack" \
    --resource-version "1.0.5" \
    --resource-uuid "aafaecfa-cec8-4b0a-957d-6a067932285e" \
    --output-resource "./my_resource" \
    --output-behavior "./my_behavior" \
    --zip-output-resource "./resource_pack.zip" \
    --zip-output-behavior "./behavior_pack.zip" \
    --furniture-force-entity=true \
    --furniture-production=true
```

参数说明：
- --input-path: 指向包含 ItemsAdder 物品、方块、模型、贴图等内容的目录。
- --namespace: 输出到基岩版时，所使用的命名空间（默认为 easecation）。
- --resource-name / --behavior-name: 分别指定 ResourcePack 与 BehaviorPack 的名字。
- --resource-description / --behavior-description: Manifest 的描述字段。
- --resource-uuid / --behavior-uuid: 自定义 UUID，如果不填则随机生成。
- --resource-version / --behavior-version: 指定包版本号，默认 [1, 0, 0]。
- --output-resource / --output-behavior: 指定编译后生成的资源包和行为包存放路径。
- --zip-output: 指定最终打包后的 ZIP 文件存放路径。
- --furniture-force-entity: 是否启用 furniture_force_entity 逻辑（默认为 true）。
- --furniture-production: 是否启用 furniture_production 逻辑（默认为 true）。

## 4. 查看帮助

执行下方命令可查看所有参数及默认值：

```
node dist/index.js --help
```

# 常见问题
1. 如何更改 min_engine_version？
   - 可以在 createManifest 的参数中改写，目前默认为 [1, 16, 0]；
   - 如果需要命令行可配，可继续在 yargs 中添加一个 --min-engine-version 选项，并在 createManifest 里进行解析使用。
2. 如何只想输出单个 ResourcePack？
   - 你可以自行决定只解析某些特定文件夹，或者在最后只打包 ResourcePack。
   - 也可以添加一个布尔参数，比如 --no-behavior，来跳过 BehaviorPack 的生成。
3. UUID 冲突怎么办？
   - 脚本默认使用 uuidv4() 生成随机 UUID，不太会冲突；
   - 如果你想手动控制 UUID，可通过 --resource-uuid 和 --behavior-uuid 指定。
4. ItemsAdder 版本兼容性
   - 请确保 ParserItemsAdderFullPack 与 RootConverter 正常支持当前 ItemsAdder 的版本结构；
   - 如果出现解析错误，需更新或自定义 ParserItemsAdderFullPack。
5. PNG 压缩失败？
   - 确保你在系统中安装了合适的图像处理工具或者对应的 npm 库依赖（例如 sharp 等）；
   - 如果想跳过压缩，可以移除或注释掉 compressPngImages 部分。

---

# Geyser 路线（IA → Geyser 自定义方块/物品，本仓库新增）

把 **ItemsAdder 的美术/配置作为唯一真相源**，自动生成 **Geyser `custom_mappings` + 基岩资源包**，并部署到 Geyser。与上面的"网易真方块包"路线相互独立，互不影响。

## 工作原理

```
IA contents + output/generated.zip(权威真相源)
  → ParserItemsAdderGenerated（容错 unzip 读 blockstates / item overrides）
  → blockstateResolver（Java 方块状态键按属性名字母序规范化）
  → GeyserConverter（几何走 mc-model-geo 库 + 从 IA 源读贴图/配置 + 选项富化）
  → EncoderGeyser（custom_mappings/<ns>.json + 基岩 RP zip）
  → 部署到 Geyser 的 custom_mappings/ 与 packs/ResourcePacks/
```

- 方块映射键 = `host[字母序属性串]`，经 Geyser 源码 `MappingsReader_v1` 精确匹配验证。
- 物品映射 = base material + `custom_model_data`。
- 选项富化：`hardness→destructible_by_mining`、`light_level→light_emission`、`REAL_TRANSPARENT→render_method:blend + light_dampening:0`；多块同 host 自动归并 `state_overrides`。

## 依赖：mc-model-geo

几何转换（Java 模型 → 基岩 geometry，含骨骼层级）由独立库 **`mc-model-geo`** 完成（解耦、零运行期依赖、移植自 Blockbench、单测 + Blockbench 官方导出 ground-truth 验证），仓库：https://github.com/EaseCation/mc-model-geo

本仓库以 **git submodule** 形式包含它于 `./mc-model-geo`（依赖声明 `file:./mc-model-geo`）。克隆时：

```bash
git clone --recurse-submodules <repo>
# 或克隆后：
git submodule update --init --recursive
# 先构建子模块，再装本项目：
(cd mc-model-geo && npm install && npm run build)
```

## 用法

```bash
npm install            # 需先准备好 ../mc-model-geo
npm run build

# 主脚本（通用、参数化）
node dist/cli-geyser.js \
  --ia-contents <ItemsAdder/contents 目录> \
  [--namespace <ns[,ns2] | all>]        # 默认 all：自动检测所有内容命名空间
  [--generated <generated.zip>]         # 默认 <ia-contents>/../output/generated.zip
  [--out <输出目录>]                    # 默认 ./out
  [--deploy-geyser <Geyser 数据目录>]   # 给定则部署到其 custom_mappings/ 与 packs/ResourcePacks/
  [--pack-version x.y.z] [--min-engine-version x.y.z]
```

部署专用的本地包装脚本（写死服务器路径）不在本仓库内，由各服务器自行维护（例如放在服务器的 `scripts/` 下）调用上述 CLI。

## 完整工作流

1. 游戏内 `/iazip`（刷新 `output/generated.zip` 这一真相源）。
2. 运行 CLI（或服务器的同步脚本），转换 + `--deploy-geyser` 部署到 Geyser。
3. 重启 Geyser/代理，基岩端重连即可看到自定义方块/物品。

## 测试

`npm test`（`tsc && vitest`）。几何库 `mc-model-geo` 另有独立测试。
