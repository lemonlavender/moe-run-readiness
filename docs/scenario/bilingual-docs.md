# Scenario: Bilingual product documentation

- Given: an English-speaking or Chinese-speaking maintainer
- When: either README is opened
- Then: the same product workflow, example, iPolloWork instructions, build steps, FAQ, and validation limits are available

## Test Steps

- Case 1: Verify both READMEs contain all practical sections and the iPolloWork link.
- Case 2: Verify public documentation remains product-focused and contains no news-background sections.

## Status

- [x] Write scenario document
- [x] Write solid test according to document
- [x] Run test and watch it failing
- [x] Implement to make test pass
- [x] Run test and confirm it passed
- [x] Refactor implementation without breaking test
- [x] Run test and confirm still passing after refactor
