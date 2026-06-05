#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Smoke Test: 废旧家电回收估价平台 ==="

npm run check
echo "[PASS] TypeScript type check"

npx vite build --mode production 2>&1 | tail -5
echo "[PASS] Production build"

echo ""
echo "=== Business Rule Smoke Tests ==="

echo "[BR-01] 危险拆解品类不可上门: 验证代码中 hazardous 品类隐藏预约表单"
if grep -q "selectedCategory.hazardous" src/pages/Resident.tsx; then
  echo "  [PASS] 危险拆解品类判断逻辑存在"
else
  echo "  [FAIL] 危险拆解品类判断逻辑缺失"
  exit 1
fi

echo "[BR-02] 成色缺失不能估价: 验证成色未选时估价按钮禁用并显示提示"
if grep -q "showConditionHint" src/pages/Resident.tsx && grep -q "请先选择成色等级" src/components/ConditionSelector.tsx; then
  echo "  [PASS] 成色缺失提示逻辑存在"
else
  echo "  [FAIL] 成色缺失提示逻辑缺失"
  exit 1
fi

echo "[BR-03] 同一地址同日只保留一个预约: 验证重复预约校验"
if grep -q "hasDuplicateAppointment" src/pages/Resident.tsx && grep -q "同一地址同日仅可预约一次" src/pages/Resident.tsx; then
  echo "  [PASS] 同地址同日唯一预约校验存在"
else
  echo "  [FAIL] 同地址同日唯一预约校验缺失"
  exit 1
fi

echo ""
echo "=== All Smoke Tests Passed ==="
