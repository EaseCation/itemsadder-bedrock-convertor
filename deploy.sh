#!/usr/bin/env bash
# IA → Geyser 一键转换+部署（本地便捷包装）
#
# 完整工作流：
#   1) 游戏内执行 /iazip（刷新 ItemsAdder 的 output/generated.zip 这一真相源）
#   2) 跑本脚本：从 IA 内容自动生成 Geyser custom_mappings + 基岩资源包，并部署到 Geyser
#   3) 重启 Geyser/代理，基岩端重连即可看到自定义方块/物品
#
# 参数用环境变量覆盖，例如：
#   GEYSER_DIR=/path/to/Geyser NAMESPACE=ecsb PACK_VERSION=1.0.3 ./deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

# ===== 本地参数（按需修改，或用环境变量覆盖）=====
IA_CONTENTS="${IA_CONTENTS:-/home/ec/workspace/Skyblock_1218/plugins/ItemsAdder/contents}"
GEYSER_DIR="${GEYSER_DIR:-/home/ec/workspace/Skyblock_1218/velocity/plugins/Geyser-Velocity}"
NAMESPACE="${NAMESPACE:-all}"          # all=自动检测所有内容命名空间；或 "ecsb,other"
OUT="${OUT:-./out}"
PACK_VERSION="${PACK_VERSION:-1.0.0}"   # 升版本可强制基岩客户端重新下载资源包
MIN_ENGINE="${MIN_ENGINE:-1.16.0}"
GENERATED="${GENERATED:-}"              # 留空=自动取 <IA_CONTENTS>/../output/generated.zip
# =================================================

echo "[deploy.sh] 构建主脚本..."
npm run --silent build 2>/dev/null || npx tsc

ARGS=(--ia-contents "$IA_CONTENTS" --namespace "$NAMESPACE" --out "$OUT"
      --pack-version "$PACK_VERSION" --min-engine-version "$MIN_ENGINE"
      --deploy-geyser "$GEYSER_DIR")
[ -n "$GENERATED" ] && ARGS+=(--generated "$GENERATED")

echo "[deploy.sh] 转换并部署..."
node dist/cli-geyser.js "${ARGS[@]}"

echo "[deploy.sh] 完成。提示：若内容有更新，请确保已先在游戏内 /iazip；随后重启 Geyser/代理并让基岩端重连。"
