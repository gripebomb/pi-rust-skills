---
name: rust-proc-macro
description: Builds and reviews Rust procedural macros with syn, quote, derive macros, attribute macros, diagnostics, span hygiene, generated code review, trybuild compile-fail tests, and cargo expand. Use for proc macro implementation and debugging.
license: MIT
compatibility: Rust stable with proc-macro crates. Common tools include syn, quote, proc-macro2, trybuild, and cargo-expand.
---

# Rust Proc Macro

Use this skill when implementing, testing, debugging, or reviewing Rust procedural macros.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, and `rust_project_context` output when available.
2. Identify the macro kind: derive, attribute, or function-like macro.
3. Define accepted input syntax, generated API, diagnostics, and compatibility expectations.
4. Inspect expanded output for representative examples.
5. Add runtime tests for generated behavior and compile-fail tests for invalid input.

## Design rules

- Keep parsing strict enough to produce useful diagnostics and permissive enough for valid Rust syntax.
- Prefer `syn` parsing types over token-string manipulation.
- Use spans from user input for errors so diagnostics point to the right code.
- Keep generated code simple, hygienic, and independent of local imports.
- Reference external crates with absolute paths or documented crate-name configuration.
- Avoid generating hidden panics for user input errors; emit compile errors instead.

## Commands

```bash
cargo test --workspace --all-features
cargo test -p macro_crate
cargo expand -p example_crate
cargo clippy --workspace --all-targets --all-features -- -D warnings
```

Use `cargo expand` when installed or when generated code needs inspection.

## Testing

- Use `trybuild` for compile-pass and compile-fail diagnostics.
- Keep test fixtures small and named after the behavior they prove.
- Add tests for generics, lifetimes, visibility, attributes, where clauses, and path hygiene.
- Review stderr snapshots before accepting diagnostic changes.

## Avoid

- Do not parse Rust by splitting strings.
- Do not rely on caller imports unless that is part of the documented contract.
- Do not change generated public API without semver review.

## Output expectations

Report macro inputs, generated behavior, diagnostics changed, expansion checks, and tests run.
