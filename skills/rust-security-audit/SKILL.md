---
name: rust-security-audit
description: Audits Rust projects for unsafe code, dependency vulnerabilities, secret handling, injection risks, path traversal, deserialization hazards, cryptography misuse, supply-chain risk, and cargo-audit/cargo-deny findings. Use for Rust security reviews.
license: MIT
compatibility: Rust stable. Optional tools include cargo-audit, cargo-deny, cargo-geiger, and cargo-vet.
---

# Rust Security Audit

Use this skill for Rust security reviews, dependency audits, unsafe-code reviews, and hardening tasks.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, and `rust_project_context` output when available.
2. Define the trust boundary: inputs, files, network, environment variables, subprocesses, database queries, and external services.
3. Inspect `Cargo.lock`, features, build scripts, unsafe code, and parsing/deserialization paths.
4. Run available security tools.
5. Review risky code manually; do not rely only on scanners.
6. Produce findings with severity, exploitability, evidence, and fix.

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
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace --all-features
```

For package-specific audits, narrow to the affected crate with `-p crate_name` after workspace context is understood.

## Threat model

| Boundary | Review focus |
|---|---|
| Files and paths | Traversal, symlink handling, overwrite rules, temp file safety |
| Network and HTTP | SSRF, TLS settings, redirects, request size, timeout policy |
| Environment and config | Secret leakage, unsafe defaults, untrusted config parsing |
| Subprocesses | Shell injection, inherited environment, argument escaping |
| Dependencies and build scripts | Vulnerabilities, native code, scripts, maintainer and license risk |

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
- Search for committed secrets and generated fixtures that may contain credentials.

### Deserialization

- Avoid deserializing untrusted data into overly permissive types.
- Validate semantic constraints after parsing.
- Watch for YAML, regex, XML, archive, and compression edge cases.

### Crypto

- Prefer well-reviewed high-level crates.
- Avoid custom crypto.
- Use constant-time comparison for secrets when relevant.
- Validate randomness source and nonce uniqueness.

### Supply chain

- Review `build.rs`, proc macros, git dependencies, path dependencies, and broad feature flags.
- Prefer `cargo-deny` policies for advisories, duplicate versions, licenses, and banned crates.
- Generate SBOM or dependency inventory when the project or release process requires it.

## Finding format

```markdown
### Severity: High - Path traversal allows overwrite outside output directory

- Location: `src/archive.rs:42`
- Evidence: user-controlled archive path is joined without normalization checks
- Impact: attacker can overwrite arbitrary writable files
- Fix: reject absolute paths and components containing `..`; canonicalize destination
- Validation: added regression test and ran `cargo test --all-features`
```

## Avoid

- Do not treat scanner output as complete coverage.
- Do not silence advisories without documenting exploitability and compensation.
- Do not add secret values to tests, logs, snapshots, or issue reports.
