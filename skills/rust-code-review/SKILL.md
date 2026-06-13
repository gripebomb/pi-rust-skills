---
name: rust-code-review
description: Reviews Rust code for correctness, ownership and lifetime issues, error handling, API design, unsafe usage, concurrency risks, performance traps, cargo features, tests, and idiomatic style. Use when asked to audit or improve Rust code.
license: MIT
compatibility: Works best in a Cargo project with rustfmt, clippy, and tests available.
---

# Rust Code Review

Use this skill for Rust pull request review, local code audit, bug-risk review, and idiomatic refactoring suggestions.

## Workflow

1. Gather context. Read `Cargo.toml`, changed files, public APIs, tests, and any failure logs.
2. Run or request validation commands where practical:
   ```bash
   cargo fmt --check
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

## Review output format

Use this structure:

```markdown
## Summary

## High-risk findings

## Correctness issues

## Maintainability improvements

## Suggested patch

## Validation
```

For each finding include: file, line or symbol, problem, why it matters, and a concrete fix.
