# Scenario: Safe installable delivery

- Given: a developer downloading the GitHub Release
- When: they verify and import the package
- Then: the installer has one untrusted declarative Skill resource and the release includes reproducible archives with checksums

## Test Steps

- Case 1: Verify the schemaVersion 2 manifest and ordinary-import safety boundary.
- Case 2: Verify installer, Skill ZIP, source ZIP, and SHA-256 manifest contents.

## Status

- [x] Write scenario document
- [x] Write solid test according to document
- [x] Run test and watch it failing
- [x] Implement to make test pass
- [x] Run test and confirm it passed
- [x] Refactor implementation without breaking test
- [x] Run test and confirm still passing after refactor
