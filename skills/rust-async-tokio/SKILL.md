---
name: rust-async-tokio
description: Builds and reviews Rust async code using Tokio, async traits, streams, channels, cancellation, task supervision, graceful shutdown, backpressure, and nonblocking I/O. Use for Rust networking, services, and async runtime work.
license: MIT
compatibility: Tokio-based Rust projects or projects considering async Rust.
---

# Rust Async Tokio

Use this skill when implementing or reviewing async Rust, especially Tokio services, clients, workers, daemons, queues, and network applications.

## Workflow

1. Confirm whether async is actually needed. Do not add Tokio for simple CPU-bound or synchronous CLI work.
2. Identify runtime boundaries: binary entry point, library API, spawned tasks, blocking sections, and shutdown path.
3. Ensure every task has ownership, cancellation, and error reporting strategy.
4. Check that `.await` points do not hold mutex guards, borrowed temporaries, or other resources longer than intended.
5. Add integration tests for cancellation, timeout, and error paths.

## Tokio rules

- Use `tokio::spawn` for independent `Send + 'static` work.
- Use `tokio::task::spawn_blocking` for CPU-heavy or blocking filesystem/process work.
- Use `tokio::select!` for shutdown and cancellation.
- Prefer `JoinSet` for supervising groups of tasks.
- Prefer bounded channels for producer/consumer systems.
- Avoid `std::sync::Mutex` in async code when lock contention crosses `.await`; use `tokio::sync::Mutex` carefully or restructure ownership.

## Graceful shutdown pattern

```rust
let token = CancellationToken::new();
let worker_token = token.clone();

let worker = tokio::spawn(async move {
    loop {
        tokio::select! {
            _ = worker_token.cancelled() => break,
            result = do_one_unit_of_work() => {
                result?;
            }
        }
    }
    Ok::<_, anyhow::Error>(())
});

tokio::signal::ctrl_c().await?;
token.cancel();
worker.await??;
```

Use `tokio-util` only if the project already accepts that dependency or cancellation tokens are worth it.

## Async traits

- Native `async fn` in traits is fine when object safety is not required.
- Use boxed futures or `async-trait` only when dynamic dispatch is required and the tradeoff is acceptable.
- Document `Send` requirements when futures cross thread boundaries.

## Testing

```bash
cargo test --all-features
cargo clippy --all-targets --all-features -- -D warnings
```

Use timeouts in tests to avoid hangs:

```rust
tokio::time::timeout(Duration::from_secs(1), operation()).await??;
```

## Output expectations

Explain task ownership, cancellation behavior, backpressure, and validation commands. Flag any blocking or lock-across-await risks explicitly.
