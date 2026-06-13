# pi-rust-skills

Rust programming skills and a lightweight Rust project context tool for [Pi Coding Agent](https://pi.dev/).

This package is meant to be published to npm and installed by Pi users with:

```bash
pi install npm:pi-rust-skills
```

For a scoped package, rename the package to something like `@gripebomb/pi-rust-skills` and install it with:

```bash
pi install npm:@gripebomb/pi-rust-skills
```

## What it includes

### Extension tool

- `rust_project_context` — read-only helper that inspects a Rust/Cargo project and returns:
  - Rust/Cargo/rustup/rustfmt/clippy version information.
  - Cargo.toml preview.
  - `cargo metadata --no-deps` output.
  - Optional `cargo tree -e features` output.

### Skills

| Skill | Purpose |
|---|---|
| `/skill:rust-project-bootstrap` | Create or restructure Rust crates/workspaces. |
| `/skill:rust-code-review` | Review Rust code for correctness, idioms, safety, and maintainability. |
| `/skill:rust-debugging` | Diagnose compiler errors, panics, failing tests, and Cargo issues. |
| `/skill:rust-testing` | Add unit, integration, doc, async, property, and regression tests. |
| `/skill:rust-async-tokio` | Build/review Tokio and async Rust systems. |
| `/skill:rust-cli` | Build Rust command-line applications. |
| `/skill:rust-wasm` | Build Rust WebAssembly projects. |
| `/skill:rust-ffi` | Implement and review Rust FFI boundaries. |
| `/skill:rust-performance` | Profile and optimize Rust code. |
| `/skill:rust-security-audit` | Audit Rust projects for security issues. |
| `/skill:rust-crate-publishing` | Prepare crates for crates.io publishing. |
| `/skill:rust-refactor-migration` | Safely refactor and modernize Rust codebases. |
| `/skill:rust-toolchain-ci` | Configure Rust toolchains, lint policy, and CI. |

## Local development

```bash
git clone https://github.com/gripebomb/pi-rust-skills.git
cd pi-rust-skills
npm test
npm run list
```

Try it locally in Pi:

```bash
pi install ./pi-rust-skills
# or from inside the parent directory:
pi -e ./pi-rust-skills
```

Then invoke a skill:

```text
/skill:rust-code-review Review this Rust project and suggest fixes.
```

## Package structure

```text
pi-rust-skills/
├── extensions/
│   └── rust-skills.ts
├── skills/
│   ├── rust-project-bootstrap/SKILL.md
│   ├── rust-code-review/SKILL.md
│   └── ...
├── references/
├── scripts/
├── examples/
├── package.json
└── README.md
```

Pi discovers resources through the `pi` manifest in `package.json`:

```json
{
  "keywords": ["pi-package"],
  "pi": {
    "extensions": ["./extensions"],
    "skills": ["./skills"]
  }
}
```

## Publishing to npm

Before publishing, update these fields in `package.json`:

- `name` if you want a scoped package, for example `@gripebomb/pi-rust-skills`.
- `author`.
- `repository`, `homepage`, and `bugs`.
- `version`.

Then run:

```bash
npm test
npm pack --dry-run
npm login
npm publish --access public
```

After npm publication, install through Pi:

```bash
pi install npm:pi-rust-skills
```

If you publish as a scoped package:

```bash
pi install npm:@gripebomb/pi-rust-skills
```

## Getting listed on pi.dev/packages

Pi's package catalog displays npm packages tagged with the `pi-package` keyword. This package already includes that keyword and a `pi` manifest.

The catalog appears to crawl npm metadata; after publishing, allow time for the package page to update. Use a clear npm description because the catalog shows package names, descriptions, resource types, npm links, repository links, and install commands.

## Security notes

Pi packages can execute code and influence agent behavior. This package keeps the bundled extension read-only and uses skills as instruction files, but users should still review package contents before installing.

The `rust_project_context` tool runs read-only commands such as `rustc --version`, `cargo --version`, `cargo metadata --no-deps`, and optionally `cargo tree -e features`.

## License

MIT
