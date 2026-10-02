---
name: moe-run-readiness
description: Use when reviewing a proposed mixture-of-experts training run, accelerator allocation, distributed-training configuration, scale-up decision, or incomplete MoE benchmark packet before expensive compute is reserved.
---

# MoE Run Readiness

## Purpose

Turn supplied MoE run plans and benchmark evidence into a reviewable preflight handoff. Preserve every supplied value, expose unresolved systems risks, and require staged evidence before production-scale allocation.

## Inputs

Request the run identity, revision, hardware inventory, model and router shape, parallelism dimensions, precision modes, batch and sequence shape, benchmark results, memory measurements, communication metrics, checkpoint behavior, owners, and budget constraints. Mark missing items as unknown; do not invent them.

## Workflow

1. Read only the supplied packet and attached artifacts. Do not run training, execute commands, reserve hardware, or browse unless the user separately authorizes it.
2. Load `references/readiness-rules.md` and apply its evidence classes, verdict gates, topology checks, and systems domains.
3. Build an evidence ledger. Use only `observed`, `derived`, `claim`, or `unknown`. Do not promote an automated planner claim, dashboard label, or isolated metric into an observed fact.
4. Reconcile accelerator inventory with data, expert, pipeline, and tensor parallel dimensions. Preserve unresolved mapping or replication questions.
5. Review routing, memory headroom, precision, communication, checkpoint recovery, data shape, and observability. A favorable auxiliary loss or utilization value is insufficient by itself.
6. Select exactly one verdict: `ready-for-staged-run`, `conditional`, or `blocked`.
7. Use `references/report-format.md` verbatim for section order and the validation ladder. If a command or procedure is absent, request it; do not invent a command.
8. Give each stage expected evidence, an owner, and a stop condition. End with the exact advisory sentence from the report format.

## Failure handling

- If hardware, world size, or parallel ownership conflicts, use `blocked` until reconciled.
- If the recovery path is absent or no restore-and-continue result is supplied, use `blocked` until recovery evidence is provided.
- If the plan is internally consistent but material evidence is missing, use `conditional` and name the smallest next gate.
- Use `ready-for-staged-run` only for the next bounded validation stage, never as approval for the full training allocation.
- Preserve uncertainty when metrics are not measured on matching inputs, hardware, precision, or topology.

## Output

Return one Markdown readiness handoff. The handoff does not authorize a full-scale training run; human approval remains required after the staged evidence gates pass.
