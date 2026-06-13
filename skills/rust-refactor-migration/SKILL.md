---
name: rust-refactor-migration
description: Refactors Rust code safely across modules, crates, editions, dependency upgrades, async conversions, error type migrations, API cleanup, and workspace restructuring. Use for planned Rust codebase modernization.
license: MIT
compatibility: Rust stable with cargo recommended.
---

# Rust Refactor Migration

Use this skill for non-trivial Rust refactors where behavior must stay stable while structure changes.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, and `rust_project_context` output when available.
2. Establish baseline validation before changes:
   ```bash
   cargo fmt --check
   cargo clippy --workspace --all-targets --all-features -- -D warnings
   cargo test --workspace --all-features
   ```
3. Identify public API and compatibility constraints.
4. Make refactors in small mechanical steps.
5. Keep tests passing between steps when possible.
6. Separate behavior changes from structure changes.
7. Document migration notes for users or future agents.

## Common refactors

### Split a large module

- Move types first, then functions.
- Re-export public API from the old module if compatibility matters.
- Keep visibility narrow: prefer `pub(crate)` over `pub`.
- Add deprecation notes before removing old public paths unless a breaking change is intended.

### Convert binary logic into library logic

- Move business logic from `main.rs` into `lib.rs` or modules.
- Keep CLI parsing and process exit behavior in `main.rs`.
- Add integration tests against library functions and CLI smoke tests.

### Error migration

- Replace string errors with typed errors in libraries.
- Add context at boundaries.
- Avoid exposing `anyhow::Error` in reusable library APIs unless intentionally application-facing.

### Edition migration

Use Cargo's migration support:

```bash
cargo fix --edition
cargo fmt
cargo test --all-features
```

Then manually review changed code for readability.

### Dependency upgrade

```bash
cargo update -p crate_name
cargo tree -d
cargo test --all-features
```

Review changelog for breaking behavior, not just compiler errors.

## API compatibility

- Use `cargo semver-checks` when installed for public libraries.
- Compare docs, exported types, trait bounds, feature flags, and re-exports before and after the refactor.
- Keep compatibility re-exports until downstream users have a migration path.
- Stage large migrations as mechanical move, compatibility shim, behavior change, then cleanup.

## Refactor safety rules

- Do not rewrite working Rust into clever Rust.
- Prefer explicit intermediate variables when they clarify ownership.
- Avoid introducing generics unless reuse is proven.
- Keep public names stable unless a breaking change is requested.
- If tests are weak, add characterization tests before refactoring.
- Review dependency changelogs before changing major versions or feature defaults.

## Output expectations

Summarize baseline status, refactor steps completed, behavior changes if any, validation results, and follow-up cleanup tickets.

## Avoid

- Do not mix mechanical moves with behavior changes in the same step.
- Do not remove compatibility shims without calling out the breaking change.
- Do not accept a green narrow test when public API or workspace behavior changed.
