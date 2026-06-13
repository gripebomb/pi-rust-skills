---
name: rust-build-cross
description: Configures and reviews Rust build scripts, native dependencies, cc/pkg-config/cmake integration, target triples, linker settings, cross-compilation, platform-specific cfgs, and release packaging. Use for Rust builds that depend on native tooling or multiple platforms.
license: MIT
compatibility: Rust stable. Cross builds may require target toolchains, linkers, native SDKs, pkg-config, cc, cmake, bindgen, or cross.
---

# Rust Build Cross

Use this skill when Rust builds involve `build.rs`, native libraries, generated bindings, cross-compilation, custom linkers, or platform packaging.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, `.cargo/config.toml`, build scripts, and `rust_project_context` output when available.
2. Identify target triples, host tools, native dependencies, generated files, and linker requirements.
3. Make build scripts deterministic and explicit about rerun conditions.
4. Validate native and cross targets separately.
5. Document setup requirements for contributors and CI.

## Build script rules

- Emit `cargo:rerun-if-changed` and `cargo:rerun-if-env-changed` precisely.
- Prefer `pkg-config`, `cc`, `cmake`, or `bindgen` according to the dependency's build model.
- Keep generated files in `OUT_DIR` unless the project intentionally checks them in.
- Avoid network access and non-deterministic downloads in `build.rs`.
- Preserve useful error messages for missing SDKs, linkers, headers, or libraries.

## Cross-compilation

- Confirm host triple, target triple, linker, C compiler, and required system libraries.
- Use target-specific dependencies and `cfg` gates for platform code.
- Add `.cargo/config.toml` only when the project needs stable target configuration.
- Validate at least one native build before diagnosing cross-only failures.

## Commands

```bash
cargo check --workspace --all-targets --all-features
cargo build --target target-triple
cargo test --workspace --all-features
cargo clippy --workspace --all-targets --all-features -- -D warnings
```

Use `cross build`, `zig cc`, or platform SDK commands only when the project already uses them or the target requires them.

## Avoid

- Do not hide native dependency failures by disabling features silently.
- Do not write generated files into source directories unless release policy requires it.
- Do not assume Linux linker settings work on macOS or Windows.

## Output expectations

Report host and target assumptions, native dependency requirements, build script changes, validation commands, and packaging implications.
