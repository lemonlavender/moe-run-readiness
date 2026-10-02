# Desktop acceptance / 桌面验收

## English

The package was accepted in iPolloWork 0.50.20 on macOS Apple silicon with the OpenCode engine.

- Package: `moe-run-readiness-1.0.0.ipollowork-plugin`
- Preview: publisher `lemonlavender`, version `1.0.0`, one Skill, zero agents, zero commands, and zero MCP servers
- Declarative safety check: passed
- Installed resource: `moe-run-readiness`
- Acceptance session: `ses_f057ac40fffe2TRthG6eg7xnen`
- Input: `moe-run-readiness-packet.md`
- Output: `moe-run-readiness-acceptance.md`, 131 lines

The desktop run loaded `SKILL.md`, `references/readiness-rules.md`, and `references/report-format.md`. It produced all eight ordered report sections, the seven-stage validation ladder, all four evidence classes, the `blocked` verdict, and the exact required final advisory. The output preserved `80 GB` capacity and `77.8 GiB` peak separately and classified exact headroom as `unknown`.

The first acceptance pass exposed two edge cases: it treated an absent restore test as `conditional`, and it subtracted a GiB measurement from a GB capacity. The final Skill adds explicit regression rules for both cases. Reinstalling changed bytes under the same semantic version is intentionally refused by iPolloWork, so the corrected installed Skill was refreshed in place for the second invocation; the release package contains the identical corrected files. Future changes must increment the version before import.

## 中文

该安装包已在 macOS Apple silicon 上使用 iPolloWork 0.50.20 和 OpenCode 引擎完成验收。

- 安装包：`moe-run-readiness-1.0.0.ipollowork-plugin`
- 导入预览：发布者 `lemonlavender`，版本 `1.0.0`，1 个 Skill，0 个 Agent，0 个命令，0 个 MCP 服务
- 声明式安全检查：通过
- 已安装资源：`moe-run-readiness`
- 验收会话：`ses_f057ac40fffe2TRthG6eg7xnen`
- 输入：`moe-run-readiness-packet.md`
- 输出：`moe-run-readiness-acceptance.md`，共 131 行

桌面任务实际加载了 `SKILL.md`、`references/readiness-rules.md` 和 `references/report-format.md`。输出包含按顺序排列的 8 个章节、7 级验证阶梯、4 类证据、`blocked` 结论以及要求的精确结尾提示。报告分别保留了 `80 GB` 容量与 `77.8 GiB` 峰值，并将精确显存余量标为 `unknown`。

首轮验收发现两个边界问题：缺少恢复测试时错误使用了 `conditional`，并且直接用 GiB 测量值减去 GB 容量。最终 Skill 已为这两个问题加入明确的回归规则。iPolloWork 会拒绝在同一语义版本下覆盖内容不同的文件，因此第二次调用通过就地刷新已安装 Skill 完成；发布包中包含完全相同的修正版文件。后续修改必须先升级版本再导入。
