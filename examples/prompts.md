# Example Prompts

Use these prompts in Pi after installing the package.

```text
/skill:rust-project-bootstrap Create a new Rust CLI called log-sifter that reads stdin and filters lines with clap flags.
```

```text
/skill:rust-code-review Review this Rust workspace for ownership problems, API compatibility risks, unwraps in production code, and missing tests.
```

```text
/skill:rust-debugging Fix the current borrow checker error without adding unnecessary clones, then rerun the original failing command.
```

```text
/skill:rust-testing Add tests around the parser module and create a failing regression test for the bug in issue #12.
```

```text
/skill:rust-async-tokio Review this Tokio worker pool for cancellation, backpressure, and lock-across-await risks.
```

```text
/skill:rust-cli Add a `scan` subcommand with stable JSON output, documented exit codes, and integration tests.
```

```text
/skill:rust-web-api Add an Axum endpoint for creating projects with validation errors, tracing, and HTTP integration tests.
```

```text
/skill:rust-database Add SQLx migrations and repository tests for storing job runs with transaction rollback on failure.
```

```text
/skill:rust-wasm Build this crate for the browser with wasm-bindgen, TypeScript declarations, and wasm-pack tests.
```

```text
/skill:rust-ffi Review this C ABI boundary for ownership transfer, null pointer handling, panic safety, and generated headers.
```

```text
/skill:rust-embedded-no-std Make this driver crate no_std-compatible and add target build checks plus host-side tests.
```

```text
/skill:rust-proc-macro Add a derive macro with trybuild compile-fail tests and inspect the expanded output.
```

```text
/skill:rust-build-cross Fix this build.rs script so it handles pkg-config, rerun directives, and Linux/macOS/Windows targets.
```

```text
/skill:rust-performance Profile this parser, add a Criterion benchmark, and only optimize changes that improve the baseline.
```

```text
/skill:rust-security-audit Audit this crate for path traversal, command injection, unsafe code, and dependency issues.
```

```text
/skill:rust-crate-publishing Prepare this crate for crates.io. Do not publish; only perform dry-run checks.
```

```text
/skill:rust-refactor-migration Split the large `client` module into smaller modules while preserving the public API and adding compatibility re-exports.
```

```text
/skill:rust-toolchain-ci Add GitHub Actions for fmt, clippy, tests, docs, MSRV, and npm package validation for this Pi package.
```
