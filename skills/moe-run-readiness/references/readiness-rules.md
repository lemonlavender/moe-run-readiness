# MoE readiness rules

## Evidence classes

- `observed`: directly supplied configuration, log, measurement, artifact, or human record.
- `derived`: arithmetic or conclusion traceable to observed inputs. State the derivation.
- `claim`: an unevaluated statement from an agent, dashboard, plan, or person.
- `unknown`: required information that is absent, conflicting, or not attributable.

Do not promote or upgrade a claim into fact. A screenshot, label, or recommendation may be preserved as a claim while its underlying raw evidence remains unknown.

## Verdicts

- `ready-for-staged-run`: the packet supports only the next bounded stage and names its stop conditions. It never approves the full-scale allocation.
- `conditional`: the topology is plausibly consistent, but one or more material evidence gaps must be closed before the next expensive stage.
- `blocked`: a topology conflict, missing run identity, unsafe memory condition, unreconciled precision change, or absent recovery path prevents responsible progression.

Verdicts are about readiness for the next gate, not expected model quality or eventual training success.

## Topology ledger

Record nodes, accelerators per node, accelerator type and memory, and total world size. Record data parallel (DP), expert parallel (EP), pipeline parallel (PP), and tensor parallel (TP) dimensions with their source and owner.

Check an explicit world size relationship:

`world size = DP × EP × PP × TP`

If the framework uses a different ownership or replication model, state that supplied rule instead and show how every rank is assigned. Do not force the simple product when dimensions are nested or replicated differently. Missing group layout, expert placement, or rank mapping remains unknown.

## Systems evidence domains

### Model and routing

Record total experts, experts selected per token, capacity or dropless behavior, router objective, and any shared experts. Require tokens-per-expert distribution, dropped-token rate when applicable, hot-expert concentration, and straggler spread. Router auxiliary loss alone cannot prove balanced work; a score can improve while actual routing becomes less balanced.

### Memory headroom

Separate model, optimizer, activation, communication-buffer, and checkpoint memory where supplied. Compare measured peak with physical memory and operational reserve. A smoke run near the device limit is not evidence that a larger topology, longer sequence, or different precision path will fit.

GB and GiB are not interchangeable. Do not subtract a GiB measurement from a GB capacity or report a derived reserve unless the capacity unit is explicit and both values have first been converted to the same unit. When the unit basis is ambiguous, classify exact headroom as `unknown` and preserve the supplied values separately.

### Precision and numerics

Record precision by subsystem and conversion points. Precision performance or stability comparisons require matching input values, shapes, hardware, software revision, and measurement window. Require finite-loss checks, overflow/underflow indicators, gradient statistics when available, and a comparable baseline before attributing gains.

### Communication and overlap

Record interconnect topology, collective or all-to-all timing, bandwidth test, communication share, overlap configuration, and per-rank skew. More overlap is not automatically faster; use end-to-end evidence. A single-node result does not establish multi-node expert-routing performance.

### Checkpoint and recovery

Record checkpoint frequency, format, storage destination, write duration, integrity evidence, restore procedure, and restore-and-continue result. A successful write without a tested restore is incomplete recovery evidence.

### Data and sequence shape

Record dataset or shard identity, tokenizer/config identity, sequence length, global token batch, microbatch, accumulation, packing, and sampling changes. Reconcile batch arithmetic with DP ownership. Preserve missing resolved configuration and command lines as unknown.

### Observability

Require attributable time series rather than a single aggregate where practical: throughput, step time, loss, memory, router distribution, dropped tokens, communication time, rank skew, retry/restart events, and checkpoint timing. Name the measurement window and units.

## Gate rules

- Configuration consistency must pass before any execution stage.
- Single-process and single-node evidence must use the intended revision and a recorded resolved configuration.
- Multi-node progression requires communication evidence and rank-level observability.
- Precision changes require matching-input comparison against the chosen baseline.
- Scale trials require bounded duration and explicit stop conditions.
- Allocation approval requires a tested checkpoint restore, reviewed evidence ledger, named owners, and human sign-off.
- An absent recovery path keeps the verdict `blocked`; a checkpoint write without a supplied restore-and-continue result does not satisfy this gate.

Do not execute a command or training job during review. If the exact launch or validation procedure is absent, request the procedure and leave the stage pending.
