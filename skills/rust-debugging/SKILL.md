---
name: rust-debugging
description: Diagnoses Rust compiler errors, borrow checker issues, panics, failing tests, cargo build problems, feature resolution conflicts, runtime bugs, and platform-specific failures. Use when Rust code does not compile or behaves incorrectly.
license: MIT
compatibility: Rust stable toolchain with cargo recommended.
---

# Rust Debugging

Use this skill when Rust code fails to compile, tests fail, a panic occurs, or behavior differs from expectations.

## Workflow

1. Capture the exact failing command and full error output.
2. Identify the failure class:
   - Compiler error.
   - Borrow checker or lifetime issue.
   - Trait bound or type inference issue.
   - Cargo dependency, feature, or workspace issue.
   - Test assertion failure.
   - Runtime panic or logic bug.
3. Reduce the problem to the smallest relevant module, function, or test.
4. Apply the narrowest fix that preserves intent.
5. Re-run the original failing command and then the broader validation suite.

## Useful commands

```bash
cargo check --all-targets --all-features
cargo test --all-features -- --nocapture
RUST_BACKTRACE=1 cargo test failing_test_name -- --nocapture
cargo tree -e features
cargo metadata --format-version 1
cargo clean -p crate_name
```

For macro-heavy or generated code:

```bash
cargo expand package_or_module
```

Use `cargo expand` only if installed or worth installing.

## Borrow checker strategy

- First, shorten borrow scopes with blocks or temporary variables.
- Split immutable reads from mutable writes.
- Move computation before mutation when possible.
- Prefer `Option::take`, `mem::take`, or `std::mem::replace` when moving out of fields.
- Avoid reflexively adding `clone`; only clone when ownership is semantically required.
- If lifetimes become complex, reconsider the data model and ownership boundaries.

## Trait and generic errors

- Find the first real error; later errors are often fallout.
- Check whether a type parameter needs a bound like `Send`, `Sync`, `Clone`, `Debug`, `DeserializeOwned`, or a lifetime bound.
- Prefer simple concrete types until generic reuse is justified.
- For async trait issues, check whether the returned future must be `Send`.

## Panics

- Search for `unwrap`, `expect`, indexing, `panic!`, `todo!`, and `unreachable!`.
- Add context-rich errors rather than silently defaulting.
- For tests, assert the expected error rather than accepting any failure.

## Output expectations

Provide:

- Root cause.
- Minimal code change.
- Why the fix satisfies Rust's ownership/type rules.
- Commands used to verify the fix.
