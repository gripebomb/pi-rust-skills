---
name: rust-security-audit
description: Audits Rust projects for unsafe code, dependency vulnerabilities, secret handling, injection risks, path traversal, deserialization hazards, cryptography misuse, supply-chain risk, and cargo-audit/cargo-deny findings. Use for Rust security reviews.
license: MIT
compatibility: Rust stable. Optional tools include cargo-audit, cargo-deny, cargo-geiger, and cargo-vet.
---

# Rust Security Audit

Use this skill for Rust security reviews, dependency audits, unsafe-code reviews, and hardening tasks.

## Workflow

1. Define the trust boundary: inputs, files, network, environment variables, subprocesses, database queries, and external services.
2. Inspect `Cargo.toml`, `Cargo.lock`, features, build scripts, unsafe code, and parsing/deserialization paths.
3. Run available security tools.
4. Review risky code manually; do not rely only on scanners.
5. Produce findings with severity, exploitability, evidence, and fix.

## Commands

Use what is available; do not fail the task only because optional tools are missing.

```bash
cargo audit
cargo deny check
cargo geiger
cargo tree -e features
cargo update -p vulnerable_crate
```

Always run core validation after changes:

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-features
```

## Checklist

### Unsafe code

- Every unsafe block has a precise safety comment.
- No unsound aliasing, lifetime extension, or invalid initialization.
- FFI boundaries validate null pointers and buffer lengths.
- Unsafe abstractions expose safe APIs that enforce invariants.

### Input handling

- Validate paths to prevent traversal and unintended overwrite.
- Treat environment variables and config files as untrusted.
- Avoid shell injection; prefer `Command::new(program).arg(value)` over shell strings.
- Bound input size for parsers and decompression.

### Secrets

- Do not log secrets, tokens, cookies, private keys, or passwords.
- Use secret-specific types or redaction wrappers when possible.
- Avoid storing secrets in panic messages, errors, or snapshots.

### Deserialization

- Avoid deserializing untrusted data into overly permissive types.
- Validate semantic constraints after parsing.
- Watch for YAML, regex, XML, archive, and compression edge cases.

### Crypto

- Prefer well-reviewed high-level crates.
- Avoid custom crypto.
- Use constant-time comparison for secrets when relevant.
- Validate randomness source and nonce uniqueness.

## Finding format

```markdown
### Severity: High - Path traversal allows overwrite outside output directory

- Location: `src/archive.rs:42`
- Evidence: user-controlled archive path is joined without normalization checks
- Impact: attacker can overwrite arbitrary writable files
- Fix: reject absolute paths and components containing `..`; canonicalize destination
- Validation: added regression test and ran `cargo test --all-features`
```
