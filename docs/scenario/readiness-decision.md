# Scenario: Evidence-based readiness decision

- Given: a MoE training packet containing observed metrics, missing artifacts, and an automated readiness claim
- When: the packet is reviewed with the Skill
- Then: the output uses a bounded verdict, separates evidence classes, preserves unknowns, and does not authorize a full-scale run

## Test Steps

- Case 1: Verify exact verdict vocabulary and evidence classifications.
- Case 2: Verify the fixed human-approval advisory and prohibition on upgrading claims into facts.

## Status

- [x] Write scenario document
- [x] Write solid test according to document
- [x] Run test and watch it failing
- [x] Implement to make test pass
- [x] Run test and confirm it passed
- [x] Refactor implementation without breaking test
- [x] Run test and confirm still passing after refactor
