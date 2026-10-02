# MoE Run Readiness Handoff: `moe-rc-07`

## 1. Readiness decision

**Verdict: `blocked`**

The target allocation is 64 NVIDIA H100 80 GB GPUs, and the proposed simple-product arithmetic is `DP 8 × EP 8 × PP 1 × TP 1 = 64`, which equals the proposed world size. That arithmetic is derived from supplied dimensions; it does not establish a valid topology because the framework's rank-ownership rule, process-group layout, rank map, expert placement, launch command, and full resolved configuration were not supplied.

The observed single-node BF16 smoke run completed 220 steps, retained finite loss, reported 17,600 tokens/s/GPU over its final 100 steps, and reached 77.8 GiB peak active memory per GPU. The proposed production path changes the expert feed-forward path to MXFP8 and expands to eight nodes. No matching-input MXFP8-versus-BF16 comparison, two-node communication evidence, usable-memory figure or operational reserve, or restore-and-continue result was supplied. The 77.8 GiB measurement is also expressed in different units from the nominal 80 GB device capacity, so exact headroom cannot be derived. These gaps leave an unsafe memory condition, an unreconciled precision change, and an absent demonstrated recovery path.

The next permitted stage is **1. Configuration review** only. Broader progression is blocked until the resolved configuration, exact validation procedures, topology ownership and expert placement, matching smoke-run inputs, memory reserve, precision comparison plan, and checkpoint restore path are recorded and reviewed. No execution stage and no full-cluster reservation is authorized by this handoff.

## 2. Run identity and provenance

| Field | Supplied value | Evidence class | Sufficiency | Missing item |
|---|---|---|---|---|
| Run ID | `moe-rc-07` | observed | Sufficient to identify this packet | Timestamped run record linking this ID to the resolved configuration and artifacts |
| Objective | Continue pretraining a 64-expert, top-4 routed decoder for 12,000 steps | observed | Sufficient as a stated objective; not evidence of readiness | Success criteria and bounded validation objective |
| Revision | Internal branch `moe-ddp-refresh`, revision `f41c9de` | observed | Revision is identified but artifact provenance is incomplete | Immutable source/build identity and confirmation that all evidence used this exact revision |
| Framework/config identity | Internal branch and revision only; launch command and full resolved configuration not included | observed for branch/revision; unknown for framework and resolved config | Insufficient | Framework/version, configuration artifact, launch command, dependency/software revisions, and artifact checksum or immutable reference |
| Hardware | Target: 8 nodes × 8 NVIDIA H100 80 GB GPUs = 64 GPUs; smoke: one node, 8 GPUs | observed | Inventory count and target accelerator type are supplied; node/interconnect and usable-memory details are incomplete | Node model, interconnect topology, fabric configuration, per-device usable memory, host resources, and inventory assignment |
| Model/router shape | 64 experts, top-4 routed decoder | observed | Partial | Parameter count, layers, hidden dimensions, expert sizes, shared experts, capacity factor or dropless policy, router objective/configuration, expert placement, and rank ownership |
| Dataset | Not supplied | unknown | Insufficient | Dataset and shard identity, sampling/version record, and data provenance |
| Tokenizer/config identity | Not supplied | unknown | Insufficient | Tokenizer identity/version and associated preprocessing/configuration |
| Sequence shape | Sequence length 8,192 | observed | Target value supplied; smoke-run match is unknown | Confirmation that smoke and later comparisons use the same sequence length, packing, and input shapes |
| Batch shape | Global token batch 4,194,304 tokens | observed | Global target supplied; arithmetic cannot be reconciled to DP ownership | Microbatch, sequences or tokens per rank, gradient accumulation, packing, sampling behavior, and exact batch formula |
| Parallelism | DP 8, EP 8, PP 1, TP 1 | observed | Arithmetic fits 64 ranks under a simple product, but ownership semantics are absent | Framework-specific ownership/replication rule, process groups, rank map, and expert placement |
| Precision | MXFP8 expert feed-forward path; BF16 elsewhere | observed for proposal | Insufficient and unreconciled with the BF16 smoke evidence | Precision by subsystem, conversion points, scaling/format policy, optimizer/gradient precision, numeric monitors, and matching-input BF16 baseline |
| Checkpoint policy | Interval: every 500 steps; one checkpoint written at step 200 | observed | Write occurrence is partial evidence; recovery readiness is insufficient | Format, storage destination, write duration, integrity check, retention policy, restore procedure, and restore-and-continue result |
| Evidence timestamps | Not supplied | unknown | Insufficient | Timestamps for configuration, smoke run, dashboard screenshot, checkpoint, and measurements |
| Run owner | Model Systems | observed | Team ownership supplied; accountable individual is absent | Named accountable engineer and contact for each gate |
| Budget reviewer | Budget owner requires a written go/no-go decision and stop conditions | observed | Reviewer role exists; identity and sign-off record are absent | Named budget owner/human approver and approval record |
| Reservation constraint | Cluster reservation lead time is 6 hours | observed | Sufficient as a planning constraint; it does not relax evidence gates | Reservation deadline and cancellation/release procedure, if relevant |

## 3. Topology ledger

| Topology item | Supplied or derived value | Evidence class | Status / unresolved issue |
|---|---|---|---|
| Nodes | 8 target nodes; 1 smoke node | observed | Target inventory count supplied; node model and host/fabric details unknown |
| Devices per node | 8 NVIDIA H100 80 GB GPUs | observed | Count and accelerator label supplied; exact SKU/usable memory and device-to-fabric map unknown |
| Total world size | 64 target GPUs/ranks, inferred from 8 × 8 allocation | derived | Derivation: 8 nodes × 8 GPUs/node = 64 GPUs. The packet does not explicitly state processes per GPU or framework world-size setting. |
| Data parallel (DP) | 8 | observed | Group membership and batch ownership unknown |
| Expert parallel (EP) | 8 | observed | Group membership, replication relationship to DP, and expert placement unknown |
| Pipeline parallel (PP) | 1 | observed | No pipeline partitioning proposed |
| Tensor parallel (TP) | 1 | observed | No tensor partitioning proposed |
| Supplied rank-ownership rule | Not supplied | unknown | Required before the simple-product relationship can be accepted |
| Candidate world-size calculation | `8 × 8 × 1 × 1 = 64` | derived | Numerically equals the 64-GPU target under an orthogonal simple-product model; framework semantics remain unverified |
| Expert placement | Not supplied | unknown | If experts are evenly sharded once across EP=8, 64 ÷ 8 = 8 experts per EP rank, but that is only a conditional derivation and not an observed placement rule |
| Rank/process map | Not supplied | unknown | Every rank's DP/EP/PP/TP membership, node locality, and expert assignment remain unresolved |
| Topology conflicts | No numerical conflict in the candidate product; ownership and replication cannot be reconciled without the missing rule | derived | Missing semantics prevent a consistency finding |

**Topology status: `incomplete`.** The supplied dimensions have compatible arithmetic, but the rank-ownership rule, process groups, DP/EP replication semantics, and expert placement are not available. Configuration consistency has therefore not passed.

## 4. Systems evidence matrix

| Domain | Observed evidence | Derived conclusion | Missing evidence | Risk | Next gate |
|---|---|---|---|---|---|
| Model/routing | Target is a 64-expert, top-4 routed decoder. Router auxiliary loss moved from 0.041 to 0.019 in the supplied smoke evidence. Dashboard screenshot reports 99.1% GPU utilization. | Auxiliary loss improved numerically by 0.022, about 53.7% relative to 0.041. Neither this change nor aggregate utilization proves balanced routing or balanced work. | Capacity factor or dropless behavior, router objective/config, shared experts, tokens-per-expert time series, dropped-token rate where applicable, hot-expert concentration, expert load variance, and straggler spread | Hot experts, drops, or rank imbalance could remain hidden while auxiliary loss falls and aggregate utilization stays high | Configuration review must record routing semantics and instrumentation; single-node smoke must produce attributable routing distributions and straggler evidence |
| Memory headroom | Single-node 8-GPU BF16 run reported 77.8 GiB peak active memory per GPU; target devices are labelled H100 80 GB | The smoke run is close to nominal device capacity, but exact headroom cannot be computed because the supplied capacity and measurement use GB and GiB respectively and usable device memory/operational reserve are absent. The result cannot establish fit for MXFP8, the target batch/sequence shape, or multi-node buffers. | Measurement method and window, exact usable memory, workload-shape match, model/optimizer/activation/communication-buffer/checkpoint breakdown, allocator reserve, fragmentation, and target operational margin | Out-of-memory failure or inadequate reserve during collectives, checkpointing, longer windows, or target precision/topology | Configuration review must define required reserve and matching shape; smoke stages must measure peak and component memory and stop before the reserve is breached |
| Precision/numerics | Smoke run was BF16; proposed expert feed-forward path is MXFP8 and BF16 elsewhere. Loss remained finite, with no detailed curve or variance attached. No matching-input comparison exists. | BF16 finite loss over 220 steps does not validate the proposed MXFP8 path. The precision change is unreconciled. | Matching values, shapes, hardware, software revision and window; precision/conversion map; scale policy; loss curves/variance; overflow/underflow counters; gradient statistics; and comparable BF16 baseline | Instability, silent degradation, or a performance attribution that is confounded by nonmatching inputs | Record precision procedure at configuration review, then run a bounded matching-input comparison with numeric stop conditions |
| Communication/overlap | No two-node network benchmark supplied; only single-node throughput and aggregate utilization are present | Single-node evidence does not establish multi-node all-to-all behavior or expert-routing scale efficiency | Interconnect topology, fabric settings, bandwidth test, all-to-all timing, communication share, overlap settings, end-to-end comparison, per-rank timing/skew, and retries | Communication bottlenecks, stragglers, or overlap regressions may erase single-node throughput at scale | Two-node communication trial after earlier gates pass; require rank-level evidence before a short scale trial |
| Checkpoint/recovery | Checkpoint interval is 500 steps. A checkpoint was written at step 200. No restore-and-continue result supplied. | A successful write alone is incomplete recovery evidence and does not establish resumability | Checkpoint format, destination, write duration, integrity evidence, restore command/procedure, restored state checks, and continued-step result | A failure may lose work or make the 12,000-step run unrecoverable | Record the recovery procedure before execution; checkpoint-resume rehearsal must pass before allocation approval |
| Data/sequence shape | Target sequence length is 8,192 and global token batch is 4,194,304 tokens | The target global token batch divided by DP=8 is 524,288 tokens per DP replica, conditional on DP owning batch partitioning in the usual way. Per-rank execution shape remains unknown. | Dataset/shards, tokenizer, microbatch, accumulation, packing, sampling, padding, per-rank tokens/sequences, smoke-run shape, and framework batch-ownership rule | Performance, memory, numerics, and quality evidence may not match the proposed run; incorrect batch arithmetic may change effective optimization | Configuration review must reconcile the full data shape and batch equation; later stages must record the resolved values |
| Observability | Final-100-step mean throughput 17,600 tokens/s/GPU; peak active memory 77.8 GiB/GPU; finite-loss statement; auxiliary-loss endpoints; screenshot label of 99.1% GPU utilization | The evidence consists mainly of aggregates/endpoints. It lacks sufficient attributable time series and rank-level views for progression beyond a local smoke stage. | Units and collection definitions where absent, timestamps, per-step throughput/step time/loss, memory time series, routing distribution, dropped tokens, communication time, rank skew, retries/restarts, checkpoint timing, and measurement windows | Failures, transients, imbalance, and measurement scope could be hidden by averages or screenshot labels | Define telemetry at configuration review; require attributable time series at every executed stage |

## 5. Evidence ledger

### `observed`

- Run ID is `moe-rc-07`.
- The stated objective is to continue pretraining a 64-expert, top-4 routed decoder for 12,000 steps.
- The code is identified as internal branch `moe-ddp-refresh`, revision `f41c9de`.
- The target allocation is 8 nodes × 8 NVIDIA H100 80 GB GPUs, described as 64 GPUs.
- Proposed parallelism is DP 8, EP 8, PP 1, TP 1.
- Proposed precision is MXFP8 for the expert feed-forward path and BF16 elsewhere.
- Proposed sequence length is 8,192 and global token batch is 4,194,304 tokens.
- Proposed checkpoint interval is 500 steps.
- The supplied owner is Model Systems.
- A single-node, 8-GPU BF16 smoke run completed 220 steps.
- Mean throughput over the final 100 smoke steps was reported as 17,600 tokens/s/GPU.
- Peak active memory in that run was reported as 77.8 GiB per GPU.
- Training loss was reported to remain finite; no detailed curve or variance was attached.
- Router auxiliary loss moved from 0.041 to 0.019.
- A dashboard screenshot reports 99.1% GPU utilization and omits tokens-per-expert, dropped-token rate, all-to-all time, and straggler spread.
- No two-node network benchmark was supplied.
- No matching-input MXFP8-versus-BF16 comparison was supplied.
- A checkpoint was written at step 200; no restore-and-continue result was supplied.
- The launch command and full resolved configuration were not included.
- Cluster reservation lead time is 6 hours.
- The budget owner requires a written go/no-go decision and stop conditions.
- No engineer may execute commands during this review.

### `derived`

- Target inventory arithmetic is 8 nodes × 8 GPUs/node = 64 GPUs.
- Under a simple orthogonal product, proposed parallelism gives `8 × 8 × 1 × 1 = 64`, equal to the target GPU count; this remains conditional on the absent framework ownership rule and process mapping.
- Under an unverified assumption of one even EP shard, 64 experts ÷ EP 8 = 8 experts per EP rank; actual placement is unknown.
- Router auxiliary loss decreased by 0.022, approximately 53.7% relative to 0.041; this does not establish balanced routing.
- Under the unverified assumption that DP partitions the global token batch conventionally, 4,194,304 ÷ DP 8 = 524,288 tokens per DP replica; microbatch and accumulation arithmetic remain unknown.
- Exact memory headroom cannot be derived from 77.8 GiB measured peak and a nominal 80 GB label because units, usable capacity, reserve, and workload comparability are not supplied.
- The smoke evidence applies to a single-node BF16 run only and does not validate the proposed eight-node MXFP8 execution path.
- A checkpoint write without integrity and restore-and-continue evidence does not demonstrate recovery readiness.
- Configuration consistency has not passed because the resolved configuration and topology ownership are absent.

### `claim`

- The automated planning agent labelled the run “production ready.”
- The automated planning agent recommended reserving all 64 GPUs immediately.
- The dashboard screenshot's 99.1% GPU utilization label is preserved as a dashboard claim whose raw time series, attribution, collection definition, and window were not supplied.

These claims do not change the verdict and are not treated as observed readiness facts.

### `unknown`

- Framework/version, full resolved configuration, exact launch command, build/environment identity, and artifact hashes.
- Evidence timestamps and confirmation that every artifact used revision `f41c9de`.
- Framework-specific DP/EP/PP/TP ownership and replication rule, process groups, complete rank map, and expert placement.
- Exact accelerator SKU/usable memory, node model, device topology, host resources, interconnect/fabric layout, and inventory assignment.
- Model parameter count and dimensions, expert sizes, shared experts, capacity/dropless behavior, and router objective/configuration.
- Dataset/shard and tokenizer/config identity, microbatch, gradient accumulation, packing, sampling, padding, per-rank shape, and smoke-run input match.
- Precision conversion points, scaling policy, optimizer/gradient precision, overflow/underflow indicators, gradient statistics, detailed loss curves, and matching BF16 baseline.
- Memory measurement method/window, operational reserve, fragmentation, and model/optimizer/activation/communication/checkpoint breakdown.
- Tokens-per-expert, dropped-token rate, hot-expert concentration, routing variance, and straggler spread.
- Interconnect bandwidth, collectives/all-to-all time, communication share, overlap configuration, end-to-end overlap effect, and per-rank skew.
- Checkpoint format, storage destination, write duration, integrity result, restore procedure, restored-state validation, and continued training result.
- Attributable time series for throughput, step time, loss, memory, routing, drops, communication, rank skew, retries/restarts, and checkpoint timing.
- Exact validation procedures and commands for every ladder stage.
- Named accountable engineer, network owner, checkpoint owner, human technical reviewer, and named budget owner.

## 6. Validation ladder

| Stage | Command or procedure | Expected evidence | Owner | Stop condition |
|---|---|---|---|---|
| 1. Configuration review | Not supplied; the team must request and record the configuration-review procedure. No command may be executed during this review. | Immutable revision/build identity; full resolved configuration; exact intended launch command recorded but not executed; hardware inventory; explicit world-size ownership rule; process-group and rank map; expert placement; reconciled batch equation; dataset/tokenizer identity; precision/conversion map; memory reserve; telemetry plan; checkpoint/restore procedure; named owners and human reviewer | Model Systems; named accountable engineer and human technical reviewer are unknown | Stop and remain `blocked` if any rank is unassigned or multiply assigned contrary to the supplied rule, world-size/batch arithmetic conflicts, target precision remains unspecified at a conversion point, operational memory reserve is absent, recovery procedure is absent, or required owners/procedures are unnamed |
| 2. Single-process smoke | Not supplied; the team must request and record the exact bounded single-process smoke procedure and command before execution. | Intended revision and recorded resolved configuration; bounded step count; exact input/data identity; per-step loss and finite-value checks; overflow/underflow and gradient indicators; peak/component memory; router token distribution and drops; checkpoint instrumentation as applicable | Model Systems; named executing engineer is unknown | Stop on non-finite loss/gradients, overflow/underflow beyond the reviewed threshold, dropped-token or routing imbalance beyond reviewed limits, configuration drift, errors, or breach of the reviewed memory reserve |
| 3. Single-node smoke | Not supplied; the team must request and record the exact bounded 8-GPU procedure and command before execution. | Intended revision and resolved configuration; target sequence/batch mapping; matching BF16 and MXFP8 inputs; throughput and step-time series; numeric comparison; per-rank memory; tokens-per-expert, drops, hot-expert concentration, straggler spread; checkpoint write timing/integrity | Model Systems; named executing engineer is unknown | Stop on any single-process gate regression, BF16/MXFP8 mismatch beyond reviewed tolerances, non-finite values, unacceptable expert/rank skew, checkpoint integrity failure, or memory reserve breach |
| 4. Two-node communication trial | Not supplied; the team must request and record the exact bounded two-node procedure and command before execution. | Recorded node/fabric topology; bandwidth test; collective and all-to-all timing; communication share; overlap setting and end-to-end result; per-rank step time/skew; routing distribution; retries/errors; bounded duration | Model Systems; network/fabric owner and named executing engineer are unknown | Stop on fabric or collective errors, retries beyond reviewed limit, per-rank skew or communication share beyond reviewed thresholds, throughput regression beyond the reviewed threshold, routing imbalance, or memory reserve breach |
| 5. Short scale trial | Not supplied; the team must request and record the exact bounded scale-trial procedure and command before execution. | Reviewed subset/target topology, explicit rank map, fixed short duration or step bound, end-to-end throughput/step-time and loss series, numeric indicators, per-rank memory/routing/communication/skew, retry events, checkpoint timing/integrity, and budget consumed | Model Systems; named executing engineer and cluster operator are unknown | Stop at the preset step/time/budget bound or earlier for non-finite values, reviewed quality/numeric deviation, OOM/reserve breach, routing or rank skew beyond threshold, communication regression, repeated retries, checkpoint failure, or configuration drift |
| 6. Checkpoint-resume rehearsal | Not supplied; the team must request and record the exact checkpoint, restore, and bounded continuation procedure and commands before execution. | Checkpoint metadata, format, destination, write duration, integrity result, restored step/model/optimizer/router/RNG/data state, and a bounded restore-and-continue result with continuity checks | Model Systems; checkpoint/storage owner and named executing engineer are unknown | Stop on integrity failure, missing state, step/data duplication or skip, loss discontinuity beyond reviewed tolerance, restore error, or inability to continue under the resolved configuration |
| 7. Allocation approval | Not supplied; the team must request and record the human approval procedure. This is a review action, not a training command. | Reviewed evidence ledger; all previous stages passed; stable resolved configuration; tested restore; named owners; written go/no-go record; explicit production stop conditions; budget and cluster sign-off | Budget owner and human technical reviewer; names are unknown | Stop and do not reserve production-scale compute unless both named human reviewers sign, all evidence is attributable to the intended revision/configuration/topology, recovery passed, and no material unknown remains open |

Stages must run in this order. A failed or incomplete gate cannot be skipped. `ready-for-staged-run`, if later granted, applies only to the next bounded stage and never to the complete 12,000-step allocation.

## 7. Status-change gates

- **`blocked → conditional`:** Model Systems must supply the full resolved configuration and recorded procedures; reconcile world size, rank ownership, process groups, expert placement, and batch arithmetic; define a safe operational memory reserve; map MXFP8/BF16 conversion points and matching comparison inputs; document the checkpoint restore path; identify the dataset/tokenizer and observability plan; and name accountable owners. The required human reviewer is the named Model Systems technical reviewer, currently unknown. The reviewer must record that configuration consistency passes and that no unsafe memory, precision, topology, or recovery blocker remains.
- **`conditional → ready-for-staged-run`:** The smallest pending bounded stage must have a recorded exact procedure, intended revision and resolved configuration, owner, expected evidence, numeric or explicit stop conditions, and sufficient prior evidence for safe execution. For the present packet, this transition cannot authorize anything beyond the next unpassed stage. The required human reviewer is the named Model Systems technical reviewer, currently unknown, with budget-owner review where resource reservation is involved.
- **`stage passed → next stage permitted`:** The stage owner must attach attributable evidence from the intended revision, inputs, hardware, precision, and topology; reconcile it against every expected-evidence item and stop condition; update the ledger; and show that no stop condition fired. The required human reviewer is the named Model Systems technical reviewer, currently unknown. Two-node and scale progression also require review by the named network/fabric owner, currently unknown.
- **`staged evidence complete → allocation approval requested`:** All six execution-preparation and validation stages must be reviewed as passed; checkpoint restore-and-continue must be demonstrated; the final resolved configuration and evidence ledger must be frozen; material unknowns must be closed; production stop conditions and ownership must be recorded; and the 12,000-step budget/allocation request must be documented. Approval must be requested from both the named Model Systems human technical reviewer and the named budget owner; both names are currently unknown. The request does not itself grant approval.

No transition is automatic.

## 8. Unresolved inputs

| Missing artifact or input | Why it matters | Collector / owner | Stage blocked |
|---|---|---|---|
| Full resolved framework configuration and framework/version | Establishes the actual model, optimizer, router, data, precision, topology, checkpoint, and telemetry settings under review | Model Systems; named engineer unknown | Configuration review and all later stages |
| Exact launch and validation procedures/commands | Makes each bounded test reproducible and reviewable; commands must be recorded before execution and are not to be invented here | Model Systems; named engineer unknown | Every validation stage |
| Immutable build/environment identity and evidence-to-revision attribution | Confirms evidence belongs to `f41c9de` and the intended runtime | Model Systems | Configuration review and all later stages |
| Evidence timestamps and measurement provenance | Defines when and under what revision/configuration each result was captured | Model Systems | Configuration review and evidence acceptance |
| Framework rank-ownership/replication rule, process groups, and full rank map | Verifies that DP 8 × EP 8 × PP 1 × TP 1 assigns all 64 ranks correctly under actual framework semantics | Model Systems distributed-training owner; individual unknown | Configuration review and every execution stage |
| Expert placement and shared-expert policy | Determines routing ownership, memory, communication, and expert load per rank | Model Systems router/distributed owner; individual unknown | Configuration review, smoke stages, and multi-node stages |
| Node, device, host, and interconnect inventory/map | Establishes actual usable memory, locality, fabric, and communication path | Cluster/network owner; name unknown | Configuration review, two-node trial, and scale trial |
| Model dimensions and router capacity/dropless/objective configuration | Determines compute, memory, token drops, and correct routing evidence | Model Systems | Configuration review and smoke stages |
| Dataset/shard and tokenizer/config identity | Required for repeatable matching-input evidence and continuation correctness | Model Systems data owner; individual unknown | Configuration review and all execution stages |
| Microbatch, accumulation, packing, sampling, padding, and per-rank batch equation | Reconciles the 4,194,304-token global batch with DP ownership and device memory | Model Systems | Configuration review and smoke stages |
| Confirmation of smoke-run sequence, batch, data, revision, and configuration | Determines whether existing BF16 measurements are comparable to the proposal | Model Systems | Acceptance of current smoke evidence and precision comparison |
| MXFP8/BF16 subsystem map, conversion/scaling policy, and matching-input comparison procedure | Reconciles the proposed precision change and makes numeric/performance comparison meaningful | Model Systems numerics owner; individual unknown | Configuration review, single-process smoke, and single-node smoke |
| Detailed loss series/variance, finite-value monitors, overflow/underflow counters, and gradient statistics | Detects numeric instability hidden by a finite-loss summary | Model Systems | Smoke stages and later scale stages |
| Usable device memory, measurement method/window, component breakdown, and required reserve | Determines whether 77.8 GiB peak leaves safe operational headroom under target conditions | Model Systems with cluster owner | Configuration review and all execution stages |
| Tokens-per-expert, dropped-token rate, hot-expert concentration, routing variance, and straggler spread | Tests actual load balance; auxiliary loss and aggregate utilization are insufficient | Model Systems | Smoke stages and all scale stages |
| Two-node bandwidth, collective/all-to-all timing, communication share, overlap result, and per-rank skew | Tests expert-routing communication before wider scale | Network/fabric owner with Model Systems; names unknown | Two-node communication trial and short scale trial |
| Checkpoint format, destination, duration, integrity evidence, restore procedure, and restore-and-continue result | Establishes a viable recovery path | Checkpoint/storage owner with Model Systems; names unknown | Configuration review, checkpoint-resume rehearsal, and allocation approval |
| Attributable telemetry definitions and time series | Exposes transient failures, imbalance, retries, and measurement scope across ranks | Model Systems observability owner; individual unknown | Configuration review and every execution stage |
| Named accountable engineer, stage owners, technical reviewer, network/storage owners, and budget owner | Makes evidence collection, stop decisions, and human approvals accountable | Model Systems and budget owner organization | Configuration review, status transitions, and allocation approval |
| Written approval workflow, reservation/release procedure, and production stop conditions | Makes the go/no-go decision enforceable under the 6-hour lead-time constraint | Named budget owner with Model Systems; names unknown | Allocation approval |

This readiness review does not authorize a full-scale training run; execute the staged validation plan and require human approval before allocating production-scale compute.
