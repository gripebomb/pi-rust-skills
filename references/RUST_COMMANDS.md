# Rust Command Reference

## Toolchain

```bash
rustc --version
cargo --version
rustup show active-toolchain
rustup component add rustfmt clippy
rustup target list --installed
```

## Inspect project

```bash
cargo metadata --no-deps --format-version 1
cargo tree
cargo tree -e features
cargo tree -d
cargo locate-project
```

## Build and test

```bash
cargo check
cargo check --all-targets --all-features
cargo build
cargo build --release
cargo test
cargo test --all-features
cargo test test_name -- --nocapture
cargo test --doc
```

## Formatting and linting

```bash
cargo fmt
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
```

## Documentation

```bash
cargo doc --no-deps --open
RUSTDOCFLAGS="-D warnings" cargo doc --no-deps --all-features
```

## Publishing

```bash
cargo package --list
cargo package
cargo publish --dry-run
cargo publish
```

## Optional tools

```bash
cargo install cargo-audit cargo-deny cargo-nextest cargo-bloat cargo-expand
cargo audit
cargo deny check
cargo nextest run
cargo bloat --release --crates
cargo expand
```
