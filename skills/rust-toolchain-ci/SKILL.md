---
name: rust-toolchain-ci
description: Configures Rust toolchains, rust-toolchain.toml, cargo aliases, rustfmt, clippy lint policy, GitHub Actions, caching, cross-platform CI, MSRV checks, and release validation. Use for Rust project automation and CI setup.
license: MIT
compatibility: Rust stable with cargo. CI examples target GitHub Actions but can be adapted.
---

# Rust Toolchain CI

Use this skill when setting up Rust automation, linting policy, formatting, MSRV checks, and CI workflows.

## Workflow

1. Inspect the project's supported Rust version, edition, targets, and workspace shape.
2. Decide whether to pin Rust with `rust-toolchain.toml`.
3. Add consistent local commands via docs or Cargo aliases.
4. Add CI that matches local validation.
5. Keep CI fast enough that developers will trust it.

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
    runs-on: ubuntu-latest
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

## MSRV

If the crate declares `rust-version`, add a separate MSRV job. Keep MSRV checks focused; do not require clippy on old compilers unless necessary.

## Output expectations

Explain local commands, CI jobs, caching choices, MSRV policy, and any follow-up release automation.
