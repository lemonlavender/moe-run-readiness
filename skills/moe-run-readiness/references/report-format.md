# MoE readiness handoff format

Use these sections in order.

## 1. Readiness decision

State exactly one verdict: `ready-for-staged-run`, `conditional`, or `blocked`. Explain which observed evidence controls the decision, the next permitted stage, and which gaps prevent broader progression.

## 2. Run identity and provenance

Use a table with: field, supplied value, evidence class, sufficiency, and missing item. Include run ID, revision, framework/config identity, hardware, model/router shape, dataset, sequence and batch shape, precision, checkpoint policy, timestamps, and owners.

## 3. Topology ledger

Show nodes, devices per node, total world size, DP, EP, PP, TP, the supplied rank-ownership rule, the world-size calculation, expert placement, and unresolved conflicts. State whether the topology is `consistent`, `incomplete`, or `conflicting`.

## 4. Systems evidence matrix

Use rows for model/routing, memory headroom, precision/numerics, communication/overlap, checkpoint/recovery, data/sequence shape, and observability. Give observed evidence, derived conclusion, missing evidence, risk, and next gate.

## 5. Evidence ledger

Separate `observed`, `derived`, `claim`, and `unknown`. Preserve automated recommendations as claims. Do not convert a favorable metric into a conclusion beyond its measurement scope.

## 6. Validation ladder

Use these stages in order:

1. Configuration review
2. Single-process smoke
3. Single-node smoke
4. Two-node communication trial
5. Short scale trial
6. Checkpoint-resume rehearsal
7. Allocation approval

For every stage, provide a table row with: **Command or procedure**, **Expected evidence**, **Owner**, and **Stop condition**. Use an exact supplied command when available. If absent, write that the team must request and record the procedure; do not invent a command. Keep each stage bounded and do not skip earlier failed gates.

## 7. Status-change gates

List the evidence and reviewer required for:

- `blocked → conditional`
- `conditional → ready-for-staged-run`
- `stage passed → next stage permitted`
- `staged evidence complete → allocation approval requested`

No transition is automatic. Name the responsible human reviewer.

## 8. Unresolved inputs

List every missing artifact, why it matters, who should collect it, and which stage it blocks.

The final line must be exactly:

This readiness review does not authorize a full-scale training run; execute the staged validation plan and require human approval before allocating production-scale compute.
