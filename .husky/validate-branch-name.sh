#!/bin/bash

# 分支名规范
BRANCH_PATTERN="^(feat|fix|hotfix|release|docs|style|refactor|test|chore|perf)\/[a-z0-9-]+$|^(develop|main|master|dev)$"

current_branch=$(git symbolic-ref --short HEAD)

# 获取远程跟踪分支
tracking_branch=$(git for-each-ref --format='%(upstream:short)' "$(git symbolic-ref -q HEAD)")

# 如果是已合并到主分支的分支，跳过检查
if [[ "$tracking_branch" == *"origin/main"* ]] || \
   [[ "$tracking_branch" == *"origin/master"* ]] || \
   [[ "$tracking_branch" == *"origin/develop"* ]]; then
    echo "⚠️  分支 '$current_branch' 已合并，跳过名称检查"
    exit 0
fi

# 检查分支名是否符合规范
if [[ ! $current_branch =~ $BRANCH_PATTERN ]]; then
    echo "错误：分支名 '$current_branch' 不符合规范!"
    echo ""
    echo "分支名规范："
    echo "✅ 功能分支: feature/描述性名称 (例: feature/user-auth)"
    echo "✅ 修复分支: fix/描述性名称 (例: fix/login-issue)"
    echo "✅ 其他类型: docs/, style/, refactor/, test/, chore/, perf/"
    echo "✅ 主分支: main, master, develop, dev"
    echo ""
    exit 1
fi

echo "✅ 分支名 '$current_branch' 符合规范"
exit 0