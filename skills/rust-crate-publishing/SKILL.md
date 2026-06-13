---
name: rust-crate-publishing
description: Prepares Rust crates for publication to crates.io, including Cargo.toml metadata, README, license, docs, examples, semver, feature flags, cargo package checks, release tags, and post-publish validation. Use before publishing Rust crates.
license: MIT
compatibility: Rust stable with cargo. crates.io publishing requires a configured registry token.
---

# Rust Crate Publishing

Use this skill when preparing a Rust crate or workspace member for crates.io or an internal Cargo registry.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, and `rust_project_context` output when available.
2. Inspect README, license, public API, examples, tests, and release history.
3. Confirm crate name availability outside the code task; do not assume an unpublished name is available.
4. Ensure metadata is complete:
   - `description`
   - `license` or `license-file`
   - `repository`
   - `homepage` if useful
   - `documentation` if custom
   - `readme`
   - `keywords` and `categories`
   - `rust-version`
5. Confirm public API docs build without warnings.
6. Run package dry-run before publishing.

## Commands

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-features
RUSTDOCFLAGS="-D warnings" cargo doc --no-deps --all-features
cargo semver-checks
cargo package --allow-dirty --list
cargo package
cargo publish --dry-run
```

Use `--allow-dirty` only for inspection. Do not publish dirty working trees.
Use `cargo semver-checks` when installed or when a public crate is being released from an existing version.

## Cargo.toml metadata template

```toml
[package]
name = "crate-name"
version = "0.1.0"
edition = "2024"
rust-version = "1.85"
description = "One-sentence description under 200 characters."
license = "MIT OR Apache-2.0"
repository = "https://github.com/user/repo"
readme = "README.md"
keywords = ["rust", "cli"]
categories = ["command-line-utilities"]
exclude = [".github/", "target/"]
```

## Semver rules

- `0.x` can still break users; document breaking changes.
- Public type names, trait bounds, features, and error variants are API.
- Removing a feature flag or changing default features can be breaking.
- Prefer additive changes for patch/minor releases.
- Check MSRV changes, default feature changes, and re-export changes as compatibility events.

## Workspace publishing

- Publish dependency crates before crates that depend on them.
- Confirm every workspace member has correct `version`, `license`, `repository`, and `readme` metadata.
- Use `cargo publish -p crate_name --dry-run` for each publishable member.
- Do not publish private helper crates accidentally; set `publish = false` where needed.

## Release safety

- Verify crates.io owners and registry token setup outside the repository.
- Never print or store registry tokens in logs, docs, or scripts.
- Create a release tag only after the publish command succeeds.
- After publishing, install or depend on the published version in a clean temporary project for a smoke check.

## README checklist

- What the crate does.
- Install command.
- Minimal example.
- Feature flags.
- MSRV if set.
- License.

## Output expectations

Report readiness, missing metadata, dry-run results, and exact publish command. Never claim a publish succeeded unless the publish command was actually run and returned success.

## Avoid

- Do not publish from a dirty working tree.
- Do not assume workspace version bumps are harmless.
- Do not remove old feature flags or defaults without documenting the breaking change.
