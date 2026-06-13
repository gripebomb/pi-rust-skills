---
name: rust-cli
description: Builds Rust command-line applications with clap, config files, environment variables, structured errors, logging, shell completions, tests, packaging, and cross-platform behavior. Use when creating or improving Rust CLI tools.
license: MIT
compatibility: Rust stable toolchain. clap, tracing, serde, and assert_cmd are optional project dependencies.
---

# Rust CLI

Use this skill for Rust command-line tools, developer utilities, admin tools, and terminal workflows.

## Workflow

1. Define the CLI contract first: commands, flags, input/output, exit codes, and config precedence.
2. Keep `main.rs` thin. Put real logic in library modules that tests can call directly.
3. Use structured errors internally and user-friendly messages at the CLI boundary.
4. Add integration tests that execute the binary for critical commands.
5. Validate behavior on paths with spaces and platform-specific path separators.

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

## Validation

```bash
cargo fmt
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-features
cargo run -- --help
```

## Output expectations

Document the CLI contract, files changed, example invocations, and any future packaging steps such as shell completions, manpages, Homebrew, Scoop, or cargo-binstall.
