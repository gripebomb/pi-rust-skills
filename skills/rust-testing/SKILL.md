---
name: rust-testing
description: Designs and implements Rust unit tests, integration tests, doc tests, property tests, snapshot tests, test fixtures, cargo-nextest workflows, and CI validation. Use when adding or improving Rust test coverage.
license: MIT
compatibility: Rust stable toolchain with cargo recommended. Optional tools include cargo-nextest, insta, proptest, and tarpaulin.
---

# Rust Testing

Use this skill when writing tests, improving test structure, reproducing bugs, or creating a validation plan for a Rust project.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, and `rust_project_context` output when available.
2. Identify the behavior contract before writing tests.
3. Choose the right test type:
   - Unit tests inside modules for small pure logic.
   - Integration tests under `tests/` for public behavior.
   - Doc tests for public APIs and examples.
   - Property tests for parser, serializer, state machine, or invariant-heavy code.
   - Snapshot tests for stable text or structured output.
   - Compile-fail tests for macros, trait errors, and public API guarantees.
   - Concurrency model tests for lock-free or synchronization-heavy code.
4. Write at least one failing test before fixing a bug when practical.
5. Keep test data small, explicit, and local to the test.
6. Validate with all relevant feature flags.

## Commands

```bash
cargo test
cargo test --all-features
cargo test --workspace --all-targets
cargo test -p crate_name --all-features
cargo test test_name -- --nocapture
cargo test --doc
```

If `cargo-nextest` is installed:

```bash
cargo nextest run --all-features
```

## Test design rules

- Tests should explain behavior, not implementation details.
- Prefer descriptive test names like `returns_error_when_config_file_is_missing`.
- Avoid sleeps in async tests; use controlled clocks, channels, or timeouts.
- Avoid tests that depend on the user's machine, network, current date, or global state.
- Use temporary directories for filesystem tests.
- Keep fixtures minimal and local. Store large reusable fixtures under `tests/fixtures/` with names that explain the scenario.
- Assert exact errors when the error is part of the contract; otherwise assert stable categories.
- For snapshots, review diffs before accepting updates and never bless unrelated churn.

## Specialized tools

- Use `trybuild` for proc macro and compile-fail API tests.
- Use `loom` for synchronization code where interleavings matter.
- Use `miri` for unsafe code, aliasing-sensitive logic, and UB checks when it is available.
- Use `insta` snapshots for stable structured output, not volatile logs.

## Async tests

For Tokio projects:

```rust
#[tokio::test]
async fn handles_timeout() {
    // test body
}
```

Use `#[tokio::test(flavor = "multi_thread")]` only when concurrency behavior needs it. Prefer `current_thread` for deterministic tests.

Use `tokio::time::pause` and explicit time advancement when timer behavior must be deterministic.

## Property tests

Use property tests when input space matters more than examples:

```rust
proptest! {
    #[test]
    fn round_trips(value in any::<u32>()) {
        let encoded = encode(value);
        prop_assert_eq!(decode(&encoded).unwrap(), value);
    }
}
```

## Output expectations

When finished, report:

- Test cases added.
- Bug or behavior each test protects.
- Commands run and pass/fail status.
- Coverage gaps that remain.

## Avoid

- Do not add sleeps, real network calls, or machine-dependent paths unless the behavior under test requires them.
- Do not broaden assertions until failures stop being useful.
- Do not update snapshots without explaining the intended behavior change.
