# Scenario: Staged validation ladder

- Given: an expensive production-scale run with incomplete preflight evidence
- When: the Skill prepares the validation handoff
- Then: it orders small-to-large gates and gives an owner, expected evidence, and stop condition for each stage

## Test Steps

- Case 1: Verify all required stages appear in order.
- Case 2: Verify procedures are not invented and every stage includes review fields.

## Status

- [x] Write scenario document
- [x] Write solid test according to document
- [x] Run test and watch it failing
- [x] Implement to make test pass
- [x] Run test and confirm it passed
- [x] Refactor implementation without breaking test
- [x] Run test and confirm still passing after refactor
