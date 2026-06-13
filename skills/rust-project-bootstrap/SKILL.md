---
name: rust-project-bootstrap
description: Creates new Rust crates or workspaces, chooses binary/library layouts, configures Cargo.toml, rustfmt, clippy, CI, tests, examples, feature flags, and initial project structure. Use when starting or restructuring a Rust project.
license: MIT
compatibility: Rust stable toolchain with cargo, rustfmt, and clippy recommended.
---

# Rust Project Bootstrap

Use this skill when the task is to create a new Rust project, convert a single crate into a workspace, add a new crate, or make an existing project feel production-ready.

## Workflow

1. Inspect the target directory first. If it already has `Cargo.toml`, treat it as an existing project and preserve intent.
2. Choose the smallest fitting project shape:
   - CLI app: `src/main.rs`, `src/cli.rs`, integration tests in `tests/`.
   - Library crate: `src/lib.rs`, examples in `examples/`, docs on public APIs.
   - Workspace: root `Cargo.toml` with `[workspace]`, one crate per responsibility under `crates/`.
3. Add a clean baseline:
   - `.gitignore` with `target/`.
   - `rust-toolchain.toml` if the user wants pinned Rust.
   - `rustfmt.toml` only for intentional formatting choices.
   - `.cargo/config.toml` only when needed for aliases, target config, or lint consistency.
   - GitHub Actions CI if the project has or should have a public repo.
4. Create a validation path before writing much code: `cargo fmt --check`, `cargo clippy --all-targets --all-features -- -D warnings`, and `cargo test --all-features`.
5. Prefer standard crates only until the project requirements justify dependencies.

## Cargo defaults

Use resolver v2 or v3 when appropriate. For modern projects prefer:

```toml
[package]
edition = "2024"
rust-version = "1.85"
license = "MIT OR Apache-2.0"

[dependencies]
```

When compatibility matters, use edition 2021 unless the user asks for latest Rust patterns.

## Workspace layout

Use this shape for multi-crate projects:

```text
project/
├── Cargo.toml
├── README.md
├── crates/
│   ├── app/
│   │   ├── Cargo.toml
│   │   └── src/main.rs
│   └── core/
│       ├── Cargo.toml
│       └── src/lib.rs
├── tests/
└── .github/workflows/ci.yml
```

Root manifest:

```toml
[workspace]
members = ["crates/*"]
resolver = "3"

[workspace.package]
edition = "2024"
license = "MIT OR Apache-2.0"
rust-version = "1.85"

[workspace.lints.rust]
unsafe_code = "forbid"

[workspace.lints.clippy]
pedantic = { level = "warn", priority = -1 }
```

Each member can opt in with:

```toml
[lints]
workspace = true
```

## Validation

After generating files, run:

```bash
cargo fmt
cargo check --all-targets --all-features
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-features
```

If a command fails, fix the project rather than weakening linting. If a lint is intentionally noisy, document why before allowing it.

## Output expectations

When done, summarize:

- Project shape chosen and why.
- Important files created or changed.
- Commands run and results.
- Next implementation tickets for the agent.
