# MoE Run Readiness

[中文说明](README.zh-CN.md)

MoE Run Readiness is a reusable agent Skill for reviewing proposed mixture-of-experts training runs before scarce accelerator capacity is committed. It turns a run packet into an evidence-classified readiness decision, topology ledger, systems risk matrix, and staged validation ladder.

## Problem and target users

Large MoE runs can fail for reasons that a single utilization number or smoke test does not expose: rank ownership can be incomplete, expert traffic can be skewed, memory headroom can disappear at a new sequence shape, multi-node all-to-all can dominate step time, and a written checkpoint may not restore. This Skill helps model systems engineers, research infrastructure teams, technical program owners, and compute approvers review those risks from supplied evidence.

## Use cases

- Review a proposed GPU allocation before reserving a full cluster.
- Reconcile data, expert, pipeline, and tensor parallel dimensions.
- Identify missing routing, communication, memory, and checkpoint evidence.
- Compare precision experiments only when their inputs and environments match.
- Convert an agent-generated “ready” recommendation into a bounded, human-reviewable handoff.
- Define the smallest safe stage that can run next and its stop conditions.

## Implemented features

- Three readiness verdicts: `ready-for-staged-run`, `conditional`, and `blocked`.
- Four evidence classes: `observed`, `derived`, `claim`, and `unknown`.
- Explicit world-size and rank-ownership review.
- Systems matrix covering routing, memory, precision, communication, recovery, data shape, and observability.
- Seven ordered validation stages from configuration review through allocation approval.
- Per-stage procedure, expected evidence, owner, and stop condition.
- Fixed boundary requiring human approval before production-scale compute is allocated.

## Workflow

1. Collect the run ID, revision, resolved configuration, hardware inventory, model/router shape, parallelism dimensions, data and batch shape, precision modes, benchmarks, checkpoint results, owners, and budget constraints.
2. Provide the packet as Markdown or attached text.
3. Ask the agent to use **MoE Run Readiness** and to avoid executing commands.
4. Review the readiness verdict and the next permitted stage.
5. Confirm the topology ledger maps every rank and expert placement.
6. Assign owners to missing artifacts and validation stages.
7. Execute later stages only under the responsible team’s controls and stop when a gate fails.
8. Request allocation approval only after staged evidence and checkpoint recovery have human review.

## Requirements

- [iPolloWork](https://github.com/Devin-AXIS/iPolloWork) 0.50.12 or later for the declared installer compatibility floor.
- A local project using the OpenCode engine for the desktop flow tested by this project.
- A run packet supplied as text or files.
- No external account, API key, cluster connection, or training framework installation is required for the review itself.

The Skill does not launch jobs, run commands, reserve hardware, change scheduler state, or validate model quality.

## Inputs and outputs

### Inputs

- run identity, revision, framework and resolved configuration;
- nodes, accelerators, memory, and interconnect details;
- model size, expert count, top-k routing, and capacity behavior;
- DP, EP, PP, TP, and rank mapping;
- sequence length, token batch, microbatch, accumulation, and dataset identity;
- precision modes and numerical evidence;
- throughput, step-time, memory, routing, communication, and rank-skew metrics;
- checkpoint write and restore evidence;
- planner recommendations, owners, budget, and scheduling constraints.

### Output

A Markdown handoff with a readiness decision, provenance table, topology ledger, systems evidence matrix, evidence ledger, seven-stage validation ladder, status-change gates, and unresolved inputs.

## End-to-end example

[`examples/run-packet.md`](examples/run-packet.md) proposes a 64-GPU, 64-expert run after one 8-GPU smoke test. It includes high reported utilization and a favorable router auxiliary loss, but omits tokens-per-expert distribution, a multi-node communication trial, a matching-input MXFP8 comparison, an exact launch command, and checkpoint restore evidence.

Invoke:

```text
Use MoE Run Readiness to review examples/run-packet.md. Do not browse or execute commands. Preserve every supplied value, classify evidence, and save the complete Markdown handoff.
```

Expected result: `blocked`. The topology arithmetic is plausible, but missing resolved configuration, operational memory reserve, precision comparison, and recovery evidence prevent any execution stage. The recommendation to reserve all GPUs stays a `claim`; the next permitted action is configuration review. See [`examples/expected-readiness.md`](examples/expected-readiness.md).

## Use in iPolloWork

1. Download `moe-run-readiness-1.0.0.ipollowork-plugin` from the GitHub Release.
2. In iPolloWork, open **Extensions → Plugins → Add → File**.
3. Select the package and verify publisher `lemonlavender`, version `1.0.0`, and one Skill resource.
4. Install it and enable both the plugin and **MoE Run Readiness** Skill toggles.
5. Open a local OpenCode project and add the run packet.
6. Ask the agent explicitly to use **MoE Run Readiness**. Confirm it loads `SKILL.md`, `readiness-rules.md`, and `report-format.md`.
7. Review and export the generated Markdown handoff.

For standalone import, unzip `moe-run-readiness-1.0.0-skill.zip` and choose the contained `moe-run-readiness` folder from the local Skill import screen. A GitHub URL is not a universal installation method.

## Build and package

Node.js 22 and the standard `zip`, `unzip`, and `shasum` commands are sufficient:

```bash
npm run package
npm test
cd dist
shasum -a 256 -c SHA256SUMS.txt
```

The build creates a direct iPolloWork installer, a standalone Skill ZIP, a separate source ZIP, and a checksum manifest. The installer root contains one schemaVersion 2 manifest plus the complete Skill directory.

## FAQ

### Does the Skill run a training job?

No. It reviews supplied evidence and writes a plan. Engineers execute any later command in their approved environment.

### Does matching parallelism arithmetic prove the run will scale?

No. It establishes only one consistency check. Multi-node communication, rank skew, routing distribution, memory, numerics, and recovery still need staged evidence.

### Is high GPU utilization enough?

No. It can hide hot experts, all-to-all stalls, stragglers, retries, or an unsuitable measurement window. The Skill asks for attributable time series and routing evidence.

### Can an agent’s “production ready” label approve the allocation?

No. It remains a claim until the required evidence gates and human review are complete.

### What if the launch command is missing?

The handoff requests and records the procedure. It does not invent a command.

## Validation

Version 1.0.0 is an untrusted declarative package with no permissions, service, executable hook, authorization method, or MCP resource. Automated tests cover the report contract, systems domains, bilingual documentation, manifest, archive boundaries, and checksums. [`docs/desktop-acceptance.md`](docs/desktop-acceptance.md) records the actual desktop import and invocation result.

Validated behavior is limited to package discovery, reference loading, and evidence-based Markdown generation from one supplied packet. It does not prove cluster compatibility, model convergence, throughput, numerical stability, checkpoint correctness, or production readiness.

## License

MIT
