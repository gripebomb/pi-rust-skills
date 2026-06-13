---
name: rust-wasm
description: Builds Rust WebAssembly projects with wasm-pack, wasm-bindgen, web-sys, js-sys, browser or Node targets, bundler integration, size optimization, and wasm tests. Use for Rust code compiled to WebAssembly.
license: MIT
compatibility: Rust stable with wasm32 target. Optional tools include wasm-pack, wasm-bindgen-cli, trunk, and wasm-opt.
---

# Rust WASM

Use this skill for Rust projects targeting WebAssembly for browser apps, Node packages, plugin sandboxes, or shared computational modules.

## Workflow

1. Confirm target environment: browser, Node, bundler, no-bundler, WASI, or embedded runtime.
2. Add the correct crate type:
   ```toml
   [lib]
   crate-type = ["cdylib", "rlib"]
   ```
3. Keep the core logic platform-neutral. Put browser bindings behind a thin `wasm-bindgen` layer.
4. Minimize boundary crossings between JavaScript and Rust.
5. Validate both native tests for core logic and wasm-specific tests for bindings.

## Common setup

```toml
[dependencies]
wasm-bindgen = "0.2"

[target.'cfg(target_arch = "wasm32")'.dependencies]
js-sys = "0.3"
web-sys = { version = "0.3", features = ["console"] }
```

Add target:

```bash
rustup target add wasm32-unknown-unknown
```

Build with wasm-pack:

```bash
wasm-pack build --target web
wasm-pack build --target bundler
wasm-pack build --target nodejs
```

## Design rules

- Avoid exposing complex Rust lifetimes across the wasm boundary.
- Prefer simple structs, strings, numbers, typed arrays, and serialized data at the boundary.
- Keep panics visible during development with `console_error_panic_hook` when appropriate.
- Watch binary size. Review dependencies, feature flags, and `wee_alloc` only if justified.
- Avoid assuming browser APIs exist in Node or test environments.

## Testing

Native core tests:

```bash
cargo test
```

WASM tests with wasm-pack:

```bash
wasm-pack test --node
wasm-pack test --headless --firefox
```

## Optimization

For release builds:

```toml
[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
```

Use `wasm-opt` only after confirming it is installed and appropriate for the pipeline.

## Output expectations

State the selected wasm target, JS integration path, files changed, build/test commands, and any size or compatibility tradeoffs.
