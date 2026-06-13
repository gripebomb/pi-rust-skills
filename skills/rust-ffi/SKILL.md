---
name: rust-ffi
description: Implements and reviews Rust FFI with C ABI, repr(C), raw pointers, ownership transfer, bindgen, cbindgen, unsafe boundaries, dynamic libraries, and cross-language tests. Use when Rust interoperates with C, C++, or other native languages.
license: MIT
compatibility: Requires careful unsafe review. C toolchain may be required depending on target.
---

# Rust FFI

Use this skill when Rust crosses a native language boundary through C ABI, dynamic libraries, generated bindings, or embedded Rust.

## Workflow

1. Define ownership and lifetime contracts before writing code.
2. Keep unsafe code at the boundary and expose safe Rust internally.
3. Use `repr(C)` only for types that cross the ABI boundary.
4. Validate nullability, allocation ownership, string encoding, alignment, and thread-safety.
5. Add cross-language smoke tests or examples when possible.

## Exporting Rust to C

```rust
#[repr(C)]
pub struct MyResult {
    pub code: i32,
}

#[unsafe(no_mangle)]
pub extern "C" fn my_library_do_work(input: *const std::ffi::c_char) -> MyResult {
    if input.is_null() {
        return MyResult { code: -1 };
    }

    let input = unsafe { std::ffi::CStr::from_ptr(input) };
    match input.to_str() {
        Ok(value) => {
            let _ = value;
            MyResult { code: 0 }
        }
        Err(_) => MyResult { code: -2 },
    }
}
```

Every unsafe block needs a safety comment explaining why pointers, aliasing, initialization, and lifetimes are valid.

## Cargo setup

For a dynamic/static library:

```toml
[lib]
crate-type = ["cdylib", "staticlib", "rlib"]
```

For generating headers:

```bash
cbindgen --config cbindgen.toml --crate crate_name --output include/crate_name.h
```

For consuming C headers:

```bash
bindgen wrapper.h -o src/bindings.rs
```

## Safety checklist

- Who allocates memory?
- Who frees memory?
- Can null pointers be passed?
- Are buffers length-delimited?
- Are strings UTF-8, UTF-16, or platform-native?
- Are callbacks called synchronously or asynchronously?
- Can foreign code call from multiple threads?
- Is unwinding across FFI prevented?

## Validation

```bash
cargo test --all-features
cargo clippy --all-targets --all-features -- -D warnings
```

For FFI code, also run platform-specific build commands and any C/C++ integration test harness available.

## Output expectations

Document ABI contracts, safety invariants, ownership rules, and test evidence. Treat missing safety comments as review findings.
