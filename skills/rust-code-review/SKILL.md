---
name: rust-code-review
description: Reviews Rust code for correctness, ownership and lifetime issues, error handling, API design, unsafe usage, concurrency risks, performance traps, cargo features, tests, and idiomatic style. Use when asked to audit or improve Rust code.
license: MIT
compatibility: Works best in a Cargo project with rustfmt, clippy, and tests available.
---

# Rust Code Review

Use this skill for Rust pull request review, local code audit, bug-risk review, and idiomatic refactoring suggestions.

## Workflow

1. Gather context. Read `Cargo.toml`, workspace shape, feature flags, target crates, changed files, public APIs, tests, and any failure logs. Use `rust_project_context` when available.
2. Run or request validation commands where practical:
   ```bash
   cargo fmt --check
   cargo check --workspace --all-targets --all-features
   cargo clippy --all-targets --all-features -- -D warnings
   cargo test --all-features
   ```
3. Review in this priority order:
   - Soundness and safety.
   - Correctness and edge cases.
   - Error handling and observability.
   - API design and maintainability.
   - Performance and allocation behavior.
   - Tests and documentation.
4. Prefer actionable patches over broad commentary.
5. Do not suggest adding dependencies unless they simplify real complexity or reduce risk.

## Severity guide

- High: soundness, security, data loss, panics on normal input, or broken public contracts.
- Medium: incorrect edge cases, cancellation/resource leaks, portability bugs, or missing tests for risky behavior.
- Low: maintainability, clarity, docs, or style issues that do not change behavior.

## Rust-specific checklist

### Ownership and lifetimes

- Avoid unnecessary cloning. Prefer borrowing when lifetimes stay simple.
- Do not overuse explicit lifetimes; let elision work unless public API clarity improves.
- Watch for returning references tied to temporary values.
- Prefer owned return types when borrowing would make the API brittle.

### Errors

- Library code should usually return typed errors or `thiserror`-style enums.
- Application boundaries can use `anyhow`-style context.
- Preserve source errors and add context at I/O, network, parsing, and external process boundaries.
- Avoid `unwrap`, `expect`, and `panic` outside tests, examples, initialization invariants, or clearly documented impossible states.

### Unsafe code

- Flag every `unsafe` block for justification.
- Require a nearby safety comment explaining invariants.
- Check aliasing, initialization, lifetime extension, FFI contracts, and thread-safety assumptions.
- Prefer safe abstractions around unsafe internals.

### Async and concurrency

- Avoid holding locks across `.await`.
- Check that blocking work is not run on async executor workers.
- Prefer bounded channels when backpressure matters.
- Confirm cancellation behavior and task shutdown.

### API design

- Public APIs should use clear types, minimal generics, and docs with examples.
- Prefer `AsRef<Path>` for path-like inputs and `impl Into<String>` sparingly.
- Avoid exposing concrete dependency types unless they are part of the intended contract.
- Check MSRV, edition, feature flags, and semver compatibility before recommending public API changes.
- Treat public type names, trait bounds, error variants, feature defaults, and re-exports as compatibility surface.

### Feature and workspace coverage

- Review feature-gated code with `--all-features` and the default feature set when both matter.
- For workspaces, identify the affected package and run `cargo check -p crate_name --all-targets --all-features` when the full suite is too broad.
- Check generated code, proc macro expansion, and build scripts when the diff touches them.

## Review output format

Lead with findings. Use this structure:

```markdown
## Summary

## High-risk findings

## Correctness issues

## Maintainability improvements

## Suggested patch

## Validation
```

For each finding include: file, line or symbol, problem, why it matters, and a concrete fix.

## Avoid

- Do not bury high-risk findings below summaries.
- Do not recommend broad rewrites when a local fix resolves the issue.
- Do not weaken lints or tests without a clear compatibility reason.
