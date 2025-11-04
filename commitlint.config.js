module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // 新功能
        "fix", // 修复 bug
        "docs", // 文档更新
        "style", // 代码格式调整
        "refactor", // 代码重构
        "test", // 测试相关
        "chore", // 构建过程或辅助工具变动
        "revert", // 回滚提交
        "perf", // 性能优化
        "ci", // CI 配置
        "build", // 构建相关
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
  },
};
