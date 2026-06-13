---
name: rust-toolchain-ci
description: Configures Rust toolchains, rust-toolchain.toml, cargo aliases, rustfmt, clippy lint policy, GitHub Actions, caching, cross-platform CI, MSRV checks, and release validation. Use for Rust project automation and CI setup.
license: MIT
compatibility: Rust stable with cargo. CI examples target GitHub Actions but can be adapted.
---

# Rust Toolchain CI

Use this skill when setting up Rust automation, linting policy, formatting, MSRV checks, and CI workflows.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, and `rust_project_context` output when available.
2. Inspect the project's supported Rust version, edition, targets, and workspace shape.
3. Decide whether to pin Rust with `rust-toolchain.toml`.
4. Add consistent local commands via docs or Cargo aliases.
5. Add CI that matches local validation.
6. Keep CI fast enough that developers will trust it.

## rust-toolchain.toml

```toml
[toolchain]
channel = "stable"
components = ["rustfmt", "clippy"]
```

Use a specific version only when MSRV or reproducibility matters:

```toml
[toolchain]
channel = "1.85.0"
components = ["rustfmt", "clippy"]
```

## Cargo aliases

`.cargo/config.toml`:

```toml
[alias]
xtask = "run --package xtask --"
ci-check = "check --workspace --all-targets --all-features"
ci-test = "test --workspace --all-features"
```

## GitHub Actions baseline

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  rust:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: rustfmt, clippy
      - uses: Swatinem/rust-cache@v2
      - run: cargo fmt --check
      - run: cargo clippy --workspace --all-targets --all-features -- -D warnings
      - run: cargo test --workspace --all-features
```

For cross-platform projects, add a matrix for `ubuntu-latest`, `windows-latest`, and `macos-latest`.

For Pi packages or mixed Node/Rust repositories, include package validation such as `npm test`, `npm run list`, or `npm pack --dry-run` in a separate Node job.

## CI policy

- Set minimal permissions, usually `contents: read`.
- Cache Cargo dependencies with keys that include OS, toolchain, and lockfile.
- Add a docs job with `RUSTDOCFLAGS="-D warnings" cargo doc --no-deps --workspace --all-features` for libraries.
- Add optional audit jobs with `cargo audit` or `cargo deny check` when the project has the tool config.
- Keep MSRV checks focused on `cargo check` unless old clippy behavior is part of the policy.

## MSRV

If the crate declares `rust-version`, add a separate MSRV job. Keep MSRV checks focused; do not require clippy on old compilers unless necessary.

## Output expectations

Explain local commands, CI jobs, caching choices, MSRV policy, and any follow-up release automation.

## Avoid

- Do not make CI stricter than documented local commands without explaining the policy.
- Do not run privileged tokens or write permissions on pull request checks unless required.
- Do not hide flaky tests by allowing failures in the required validation path.
