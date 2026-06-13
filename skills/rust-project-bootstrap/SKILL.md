---
name: rust-project-bootstrap
description: Creates new Rust crates or workspaces, chooses binary/library layouts, configures Cargo.toml, rustfmt, clippy, CI, tests, examples, feature flags, and initial project structure. Use when starting or restructuring a Rust project.
license: MIT
compatibility: Rust stable toolchain with cargo, rustfmt, and clippy recommended.
---

# Rust Project Bootstrap

Use this skill when the task is to create a new Rust project, convert a single crate into a workspace, add a new crate, or make an existing project feel production-ready.

## Workflow

1. Inspect the target directory first. If it already has `Cargo.toml`, inspect workspace shape, feature flags, target crates, and `rust_project_context` output when available; preserve intent.
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

Derive edition, resolver, and MSRV from the user's policy or the existing project. For new modern projects, prefer:

```toml
[package]
edition = "2024"
rust-version = "1.85"
license = "MIT OR Apache-2.0"

[dependencies]
```

When compatibility matters, use edition 2021 unless the user asks for latest Rust patterns.

For applications, commit `Cargo.lock`. For libraries, follow the repository's existing policy; include it only when the workspace or project wants reproducible development checks.

Design feature flags before adding optional dependencies:

- Keep default features small and unsurprising.
- Name features after capabilities, not dependency crate names, unless exposing the dependency is the intent.
- Avoid mutually exclusive features unless the target platform requires them.

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

Use crate names that match responsibility, such as `core`, `cli`, `server`, or `bindings`. Avoid vague member names like `common` unless the shared boundary is clear.

## Baseline docs

- Add README content with purpose, install/run instructions, minimal example, validation commands, and license.
- Add license files or metadata matching the selected license expression.
- Add public API docs for library crates and `--help` coverage for CLI crates.

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
cargo check --workspace --all-targets --all-features
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace --all-features
```

If a command fails, fix the project rather than weakening linting. If a lint is intentionally noisy, document why before allowing it.

## Avoid

- Do not pin a Rust version, add CI, or introduce workspace complexity unless it matches the project goals.
- Do not add dependencies before the first real requirement needs them.
- Do not create public APIs before the crate boundary is clear.

## Output expectations

When done, summarize:

- Project shape chosen and why.
- Important files created or changed.
- Commands run and results.
- Next implementation tickets for the agent.
