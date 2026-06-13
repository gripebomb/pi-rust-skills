---
name: rust-cli
description: Builds Rust command-line applications with clap, config files, environment variables, structured errors, logging, shell completions, tests, packaging, and cross-platform behavior. Use when creating or improving Rust CLI tools.
license: MIT
compatibility: Rust stable toolchain. clap, tracing, serde, and assert_cmd are optional project dependencies.
---

# Rust CLI

Use this skill for Rust command-line tools, developer utilities, admin tools, and terminal workflows.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, and `rust_project_context` output when available.
2. Define the CLI contract first: commands, flags, input/output, exit codes, and config precedence.
3. Keep `main.rs` thin. Put real logic in library modules that tests can call directly.
4. Use structured errors internally and user-friendly messages at the CLI boundary.
5. Add integration tests that execute the binary for critical commands.
6. Validate behavior on paths with spaces and platform-specific path separators.

## Recommended layout

```text
src/
├── main.rs
├── cli.rs
├── config.rs
├── error.rs
└── commands/
    ├── mod.rs
    └── scan.rs
tests/
└── cli.rs
```

## clap pattern

```rust
use clap::{Parser, Subcommand};

#[derive(Debug, Parser)]
#[command(name = "tool-name", version, about)]
pub struct Cli {
    #[arg(short, long, global = true)]
    pub verbose: bool,

    #[command(subcommand)]
    pub command: Command,
}

#[derive(Debug, Subcommand)]
pub enum Command {
    Scan { path: std::path::PathBuf },
}
```

## Error handling

- `main` should convert errors into stable exit codes and messages.
- Use `eprintln!` only at the boundary.
- Use `tracing` or `log` for diagnostics, not normal output.
- Keep stdout machine-readable when the command is designed for scripting.

## CLI contract

- Document config precedence, usually flags, environment, config file, then defaults.
- Reserve stdout for primary output and stderr for diagnostics, progress, and errors.
- Define stable exit codes for success, usage/config errors, input errors, and internal failures.
- Respect TTY behavior: color, progress bars, prompts, and paging should be disabled or configurable in non-interactive mode.
- Generate shell completions and manpages when the tool is meant for broad distribution.

## Testing commands

Useful dev dependencies:

```toml
[dev-dependencies]
assert_cmd = "2"
predicates = "3"
tempfile = "3"
```

Example:

```rust
#[test]
fn prints_help() {
    let mut cmd = assert_cmd::Command::cargo_bin("tool-name").unwrap();
    cmd.arg("--help").assert().success();
}
```

Add golden output tests for stable help, JSON, or text output. Keep golden files small and review intentional changes.

## Validation

```bash
cargo fmt
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace --all-features
cargo test -p crate_name --test cli
cargo run -- --help
```

## Output expectations

Document the CLI contract, files changed, example invocations, and any future packaging steps such as shell completions, manpages, Homebrew, Scoop, or cargo-binstall.

## Avoid

- Do not mix diagnostics into machine-readable stdout.
- Do not make config precedence implicit.
- Do not add hidden panics for invalid user input.
