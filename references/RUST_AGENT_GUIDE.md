# Rust Agent Guide

This package is designed to make Pi Coding Agent better at Rust work without forcing every Rust instruction into the base prompt. Pi loads skill descriptions at startup and the full skill content only when a task matches or when the user invokes `/skill:name`.

## Recommended agent flow

1. Inspect the repository shape.
2. If a Cargo project is present, call `rust_project_context`.
3. Read the most relevant skill:
   - New project: `/skill:rust-project-bootstrap`
   - Review: `/skill:rust-code-review`
   - Build failure: `/skill:rust-debugging`
   - Tests: `/skill:rust-testing`
   - Async: `/skill:rust-async-tokio`
   - CLI: `/skill:rust-cli`
   - Web APIs: `/skill:rust-web-api`
   - Database work: `/skill:rust-database`
   - WASM: `/skill:rust-wasm`
   - FFI: `/skill:rust-ffi`
   - Embedded/no_std: `/skill:rust-embedded-no-std`
   - Proc macros: `/skill:rust-proc-macro`
   - Build scripts/cross-compilation: `/skill:rust-build-cross`
   - Performance: `/skill:rust-performance`
   - Security: `/skill:rust-security-audit`
   - Publishing crates: `/skill:rust-crate-publishing`
   - Refactors: `/skill:rust-refactor-migration`
   - CI/toolchain: `/skill:rust-toolchain-ci`
4. Make small, testable changes.
5. Run `cargo fmt`, `cargo clippy`, and `cargo test` when practical.
6. Report what changed and what validation passed.

## Default validation commands

Use the narrowest command that proves the change, then broaden if the change is cross-cutting.

```bash
cargo fmt
cargo check --all-targets --all-features
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-features
```

For workspaces:

```bash
cargo check --workspace --all-targets --all-features
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace --all-features
```

## Dependency policy

Do not add dependencies by default. Add a dependency only when it meaningfully reduces risk, complexity, or maintenance burden. Prefer well-maintained crates with clear licensing, active releases, and a small feature surface.

## Safety policy for generated Rust

- No `unsafe` unless the task requires it.
- No `unwrap` or `expect` in production code unless the invariant is documented and truly unrecoverable.
- No network calls, file deletes, or shell execution in tests unless explicitly required and sandboxed.
- Prefer deterministic tests.

## Reporting format

For substantial tasks, end with:

```markdown
## What changed

## Validation

## Notes and follow-ups
```
