# MoE training run packet

Review this packet before the team reserves the full cluster. Produce a Markdown readiness handoff without running code or browsing. Preserve supplied values, separate evidence from claims, and do not invent commands.

## Proposed run

- Run ID: `moe-rc-07`
- Objective: continue pretraining a 64-expert, top-4 routed decoder for 12,000 steps
- Code: internal branch `moe-ddp-refresh`, revision `f41c9de`
- Target allocation: 8 nodes × 8 NVIDIA H100 80 GB GPUs = 64 GPUs
- Proposed parallelism: data parallel 8, expert parallel 8, pipeline parallel 1, tensor parallel 1
- Precision: MXFP8 expert feed-forward path, BF16 elsewhere
- Sequence length: 8,192
- Global token batch: 4,194,304 tokens
- Checkpoint interval: 500 steps
- Owner: Model Systems

## Supplied evidence

- A single-node, 8-GPU BF16 smoke run completed 220 steps.
- Mean throughput during the final 100 smoke steps: 17,600 tokens/s/GPU.
- Peak active memory in that run: 77.8 GiB per GPU.
- Training loss remained finite; no detailed curve or variance was attached.
- Router auxiliary loss moved from 0.041 to 0.019.
- The dashboard screenshot reports 99.1% GPU utilization but does not include tokens-per-expert, dropped-token rate, all-to-all time, or straggler spread.
- The team has not supplied a two-node network benchmark.
- The MXFP8 configuration has not been compared with BF16 on matching inputs.
- A checkpoint was written at step 200, but no restore-and-continue result was supplied.
- The launch command and full resolved configuration were not included.
- An automated planning agent labelled the run “production ready” and recommended reserving all 64 GPUs immediately.

## Constraints

- Cluster reservation lead time is 6 hours.
- The budget owner requires a written go/no-go decision and stop conditions.
- No engineer may execute commands during this review.
