# MoE readiness handoff format

## 1. Readiness decision

**Verdict:** `blocked`

**Controlling evidence (observed):**
- No restore-and-continue result was supplied for the checkpoint written at step 200 (checkpoint/recovery evidence absent). 
- Memory headroom cannot be determined exactly because capacity unit basis is ambiguous relative to the measured peak (GB vs GiB not interchangeable without explicit conversion). 
- No two-node network benchmark supplied; no MXFP8 vs BF16 comparison on matching inputs; launch command and full resolved configuration not included.

**Next permitted stage:** Configuration review (stage 1) only; no progression to execution stages until recovery evidence and unit-conversion basis are provided.

**Gaps preventing broader progression:**
- Missing tested restore-and-continue result (recovery path incomplete). 
- Exact memory headroom classified as `unknown` due to unit ambiguity; supplied values preserved separately. 
- Missing two-node communication evidence, matching-input precision comparison, launch command, and full resolved configuration.

## 2. Run identity and provenance

| field | supplied value | evidence class | sufficiency | missing item |
|---|---|---|---|---|
| Run ID | `moe-rc-07` | observed | sufficient | — |
| Revision | `f41c9de` (branch `moe-ddp-refresh`) | observed | sufficient | — |
| Framework/config identity | internal branch; full resolved configuration not supplied | observed/unknown | insufficient | full resolved configuration, launch command |
| Hardware | 8 nodes × 8 NVIDIA H100 80 GB GPUs = 64 GPUs | observed | sufficient | — |
| Model/router shape | 64 experts, top-4 routed decoder | observed | sufficient | — |
| Dataset | not specified | unknown | insufficient | dataset/shard identity |
| Sequence and batch shape | seq_len 8192, global token batch 4,194,304 | observed | sufficient | — |
| Precision | MXFP8 expert FF, BF16 elsewhere | observed | sufficient | MXFP8 vs BF16 comparison on matching inputs |
| Checkpoint policy | interval 500 steps; checkpoint written at step 200 | observed | insufficient | restore-and-continue result |
| Timestamps | not specified | unknown | insufficient | measurement window timestamps |
| Owners | Model Systems | observed | sufficient | — |

## 3. Topology ledger

- Nodes: 8
- Devices per node: 8 (NVIDIA H100 80 GB)
- Total world size: 64
- DP: 8, EP: 8, PP: 1, TP: 1
- Supplied rank-ownership rule: not specified (implicit product assumed by numbers)
- World-size calculation: `world size = DP × EP × PP × TP = 8×8×1×1 = 64` (supplied)
- Expert placement: not specified
- Unresolved conflicts: rank mapping/group layout not specified; no evidence that EP×DP assignment matches framework ownership model
- Topology status: `incomplete`

## 4. Systems evidence matrix

| domain | observed evidence | derived conclusion | missing evidence | risk | next gate |
|---|---|---|---|---|---|
| Model/routing | Router auxiliary loss 0.041→0.019; 64 experts top-4 | Claim only (aux loss improved) | tokens-per-expert distribution, dropped-token rate, hot-expert concentration, straggler spread | High (imbalance/stragglers not ruled out) | Configuration review; require routing distribution evidence |
| Memory headroom | Peak active memory 77.8 GiB/GPU (single-node BF16, 220 steps); GPU capacity 80 GB (per spec) | Exact headroom `unknown` (GB vs GiB not interchangeable without explicit conversion basis). Values preserved separately: 80 GB capacity, 77.8 GiB peak. | Explicit unit conversion basis and confirmation of whether capacity is decimal/base-10 GB or binary GiB; multi-node/precision-adjusted peak | High (near limit; scaling/precision change untested) | Configuration review; require unit basis and projected peak under target topology/precision |
| Precision/numerics | MXFP8 expert FF, BF16 elsewhere | Not validated | MXFP8 vs BF16 comparison on matching inputs, shapes, hardware, revision, window; finite-loss details/variance; overflow/underflow indicators | High (numerics change unverified) | Configuration review; require matching-input comparison |
| Communication/overlap | None supplied (no two-node benchmark) | Unknown | Two-node network benchmark, all-to-all time, bandwidth test, communication share, overlap config, per-rank skew | High (multi-node expert routing performance unestablished) | Configuration review; require two-node communication evidence |
| Checkpoint/recovery | Checkpoint written at step 200 (500-step interval) | Incomplete recovery evidence | Restore-and-continue result; restore procedure, write duration, integrity evidence, storage destination | Critical (recovery path absent) | Configuration review; require restore-and-continue result |
| Data/sequence shape | seq 8192, global batch 4,194,304 | Arithmetic plausible but ownership not verified | Dataset/shard identity, tokenizer/config identity, microbatch/accumulation/packing, DP ownership reconciliation | Medium | Configuration review; require resolved data config |
| Observability | Single-node mean throughput 17.6k tokens/s/GPU (final 100 of 220 steps); loss finite (no curve/variance); dashboard reports 99.1% GPU util (no routing/comm details) | Limited, single-node scope | Time series (throughput, step time, loss variance, memory, router dist, dropped tokens, comm time, rank skew, retries/restarts, checkpoint timing); measurement window | High (insufficient for multi-node) | Configuration review; require rank-level observability |

## 5. Evidence ledger

**observed**
- Run ID `moe-rc-07`, revision `f41c9de`, branch `moe-ddp-refresh`
- Hardware: 8×8 H100 80 GB = 64 GPUs
- Parallelism: DP8 EP8 PP1 TP1
- Precision: MXFP8 expert FF, BF16 elsewhere
- Sequence 8192, global batch 4,194,304
- Single-node BF16 smoke 220 steps; final 100 steps mean throughput 17,600 tokens/s/GPU
- Peak active memory 77.8 GiB/GPU (single-node)
- Loss finite (no curve/variance attached)
- Router auxiliary loss 0.041→0.019
- Dashboard screenshot reports 99.1% GPU utilization (no routing/comm details)
- Checkpoint written at step 200 (interval 500)
- Owner Model Systems
- Budget/lead time constraints noted

**derived**
- `world size = DP×EP×PP×TP = 64` (from supplied dimensions). Derivation: 8×8×1×1=64.

**claim**
- Automated planning agent labelled run “production ready” and recommended reserving all 64 GPUs immediately (preserved as unevaluated claim; not promoted to fact).

**unknown**
- Full resolved configuration and launch command
- Dataset/shard identity, tokenizer/config identity
- Microbatch/accumulation/packing and DP ownership reconciliation
- Expert placement and rank/group layout (framework ownership model)
- Exact memory headroom (unit basis ambiguous: 80 GB capacity vs 77.8 GiB peak; GB/GiB not interchangeable without explicit conversion)
- MXFP8 vs BF16 comparison on matching inputs (shapes/hardware/revision/window)
- Two-node network benchmark, all-to-all time, bandwidth, communication share, overlap config, per-rank skew
- Restore-and-continue result, restore procedure, write duration, integrity evidence, storage destination
- Time series observability (throughput variance, step time, loss curve/variance, memory over time, router distribution, dropped tokens, comm time, rank skew, retries/restarts, checkpoint timing)
- Measurement window timestamps

## 6. Validation ladder

| Stage | Command or procedure | Expected evidence | Owner | Stop condition |
|---|---|---|---|---|
| 1. Configuration review | Absent (must be requested and recorded) | Full resolved config, launch command, topology ownership rule, dataset/tokenizer identities, batch arithmetic reconciliation, unit basis for memory (GB/GiB), precision comparison plan | Model Systems | Cannot proceed if any required config item remains unknown or conflicting |
| 2. Single-process smoke | Absent (must be requested and recorded) | Finite loss, memory profile, step time, revision match, recorded resolved config | Model Systems | Stop if loss non-finite, OOM, or config/revision mismatch |
| 3. Single-node smoke | Absent (must be requested and recorded) | Throughput/step time, peak memory with unit stated, router distribution, dropped tokens, variance over >=N steps, matching precision baseline | Model Systems | Stop if peak approaches limit without unit basis, imbalance/stragglers detected, or variance unexplained |
| 4. Two-node communication trial | Absent (must be requested and recorded) | All-to-all/collective timing, bandwidth, comm share, overlap behavior, per-rank skew, rank-level observability | Model Systems | Stop if comm dominates, skew exceeds threshold, or overlap regresses vs baseline |
| 5. Short scale trial | Absent (must be requested and recorded) | Bounded-duration run (e.g. fixed steps), step time stability, memory, routing balance, dropped tokens, stragglers, checkpoint write timing | Model Systems | Stop at pre-defined step/time limit if any gate metric fails |
| 6. Checkpoint-resume rehearsal | Absent (must be requested and recorded) | Restore-and-continue result demonstrating resume from written checkpoint with loss/step continuity and timing; integrity evidence | Model Systems | Stop if restore fails, continuity breaks, or timing degrades beyond threshold |
| 7. Allocation approval | Absent (must be requested and recorded) | Complete evidence ledger, reviewed gates, named human approver, stop conditions, rollback plan | Model Systems + Budget Owner | No approval without all prior stages passing and human sign-off |

## 7. Status-change gates

| Transition | Required evidence | Reviewer |
|---|---|---|
| `blocked → conditional` | Recovery path evidence (restore-and-continue result) plus explicit memory unit conversion basis; topology ownership clarified; precision comparison plan and two-node comm plan recorded | Model Systems Lead + Budget Owner |
| `conditional → ready-for-staged-run` | All configuration review items satisfied; single-process/single-node baselines with stated units; comm/precision baselines defined; checkpoint-resume procedure validated | Model Systems Lead + Budget Owner |
| `stage passed → next stage permitted` | Stage-specific expected evidence complete, stop conditions met, no new conflicts; ledger updated | Model Systems Lead |
| `staged evidence complete → allocation approval requested` | All 7 stages passed with evidence, complete ledger, named approver, stop conditions, rollback plan | Model Systems Lead + Budget Owner |

No transition is automatic.

## 8. Unresolved inputs

| Missing artifact | Why it matters | Who should collect it | Which stage it blocks |
|---|---|---|---|
| Full resolved configuration and launch command | Required to reproduce topology/precision/batch; prevents config drift | Model Systems | Stage 1 (Configuration review) |
| Dataset/shard identity, tokenizer/config identity | Ensures data shape/batch ownership correct | Model Systems | Stage 1 |
| Microbatch/accumulation/packing + DP ownership reconciliation | Prevents batch arithmetic/topology mismatch | Model Systems | Stage 1 |
| Expert placement and rank/group layout (framework ownership) | Validates EP/DP mapping vs world size rule | Model Systems | Stage 1 |
| Memory unit conversion basis (80 GB vs 77.8 GiB) | GB/GiB not interchangeable; required for exact headroom | Model Systems | Stage 1 |
| MXFP8 vs BF16 comparison on matching inputs | Validates precision change numerically | Model Systems | Stage 1-3 |
| Two-node network benchmark + comm/overlap details | Establishes multi-node feasibility | Model Systems | Stage 4 |
| Restore-and-continue result + restore procedure, write duration, integrity, storage | Recovery path required (checkpoint write alone insufficient) | Model Systems | Stage 6 |
| Time series observability (throughput variance, step time, loss curve/variance, memory over time, router dist, dropped tokens, comm time, rank skew, retries/restarts, checkpoint timing) | Detects imbalance/stragglers/skew before scale | Model Systems | Stages 2-5 |
| Measurement window timestamps | Ensures evidence attribution | Model Systems | All stages |

This readiness review does not authorize a full-scale training run; execute the staged validation plan and require human approval before allocating production-scale compute.