---
name: rust-embedded-no-std
description: Builds and reviews Rust embedded and no_std projects with target triples, HALs, panic handlers, alloc constraints, probe/debug workflows, cross-compilation, hardware abstraction, and host-side tests. Use for firmware, microcontrollers, and constrained Rust targets.
license: MIT
compatibility: Rust stable or nightly depending on target. Embedded work may require target toolchains, probe-rs, cargo-embed, and hardware access.
---

# Rust Embedded No Std

Use this skill when working on firmware, `no_std` crates, hardware abstraction layers, or constrained Rust targets.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, `.cargo/config.toml`, and `rust_project_context` output when available.
2. Identify the target triple, board, HAL, runtime, panic strategy, allocator policy, and hardware access requirements.
3. Separate platform-neutral logic from hardware-specific code so host-side tests can cover core behavior.
4. Validate host tests first, then target builds, then hardware or simulator checks when available.
5. Document any hardware-only validation that could not be run locally.

## Design rules

- Use `#![no_std]` only where required; keep shared crates `std`-optional when useful.
- Gate `alloc` usage explicitly and avoid hidden heap requirements.
- Keep interrupt handlers, DMA ownership, and peripheral access rules precise.
- Prefer HAL traits for portability when the abstraction does not hide critical hardware behavior.
- Choose panic handlers and logging/defmt strategy intentionally.
- Keep unsafe code small and document register, pointer, and concurrency invariants.

## Commands

```bash
cargo test --workspace --all-features
cargo build --target target-triple
cargo check -p crate_name --target target-triple --no-default-features
cargo clippy --workspace --all-targets --all-features -- -D warnings
```

Use `probe-rs`, `cargo embed`, `cargo flash`, or board-specific tools only when the project already uses them or hardware validation is requested.

## Testing

- Put pure logic in host-testable crates or modules.
- Use feature flags to separate host tests from firmware builds.
- For register-level or unsafe code, add compile checks and narrow unit tests around safe wrappers.
- Record board, probe, firmware profile, and target triple for hardware runs.

## Avoid

- Do not introduce `std`, heap allocation, or blocking behavior into constrained code accidentally.
- Do not assume hardware access is available in CI.
- Do not weaken target builds because host tests pass.

## Output expectations

Report target assumptions, feature gates, hardware validation status, commands run, and any safety invariants.
