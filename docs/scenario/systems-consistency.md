# Scenario: Topology and systems consistency

- Given: a proposed accelerator allocation and partial MoE configuration
- When: the Skill audits the run plan
- Then: it checks topology arithmetic and records evidence gaps across routing, memory, precision, communication, recovery, data, and observability

## Test Steps

- Case 1: Verify the world-size equation and parallelism ownership contract.
- Case 2: Verify every required systems evidence domain is named and bounded.

## Status

- [x] Write scenario document
- [x] Write solid test according to document
- [x] Run test and watch it failing
- [x] Implement to make test pass
- [x] Run test and confirm it passed
- [x] Refactor implementation without breaking test
- [x] Run test and confirm still passing after refactor
