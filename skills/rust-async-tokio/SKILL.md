---
name: rust-async-tokio
description: Builds and reviews Rust async code using Tokio, async traits, streams, channels, cancellation, task supervision, graceful shutdown, backpressure, and nonblocking I/O. Use for Rust networking, services, and async runtime work.
license: MIT
compatibility: Tokio-based Rust projects or projects considering async Rust.
---

# Rust Async Tokio

Use this skill when implementing or reviewing async Rust, especially Tokio services, clients, workers, daemons, queues, and network applications.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, and `rust_project_context` output when available.
2. Confirm whether async is actually needed. Do not add Tokio for simple CPU-bound or synchronous CLI work.
3. Identify runtime boundaries: binary entry point, library API, spawned tasks, blocking sections, and shutdown path.
4. Ensure every task has ownership, cancellation, supervision, and error reporting strategy.
5. Check that `.await` points do not hold mutex guards, borrowed temporaries, or other resources longer than intended.
6. Add integration tests for cancellation, timeout, graceful shutdown, and error paths.

## Tokio rules

- Use `tokio::spawn` for independent `Send + 'static` work.
- Use `tokio::task::spawn_blocking` for CPU-heavy or blocking filesystem/process work.
- Use `tokio::select!` for shutdown and cancellation.
- Prefer `JoinSet` for supervising groups of tasks.
- Prefer bounded channels for producer/consumer systems.
- Avoid `std::sync::Mutex` in async code when lock contention crosses `.await`; use `tokio::sync::Mutex` carefully or restructure ownership.

## Observability

- Use `tracing` spans around request, worker, queue, and task boundaries.
- Report task failures explicitly; do not detach tasks that can fail silently.
- Track queue depth, timeouts, retries, and shutdown duration when operating a service.
- Include enough context in errors to identify the runtime boundary that failed.

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
cargo test --workspace --all-features
cargo test -p crate_name async_test_name -- --nocapture
cargo clippy --workspace --all-targets --all-features -- -D warnings
```

Use timeouts in tests to avoid hangs:

```rust
tokio::time::timeout(Duration::from_secs(1), operation()).await??;
```

Use `tokio::time::pause` and `advance` for timer-heavy code. Prefer channels, cancellation tokens, and controlled clocks over sleeps.

## Output expectations

Explain task ownership, cancellation behavior, backpressure, and validation commands. Flag any blocking or lock-across-await risks explicitly.

## Avoid

- Do not spawn untracked background tasks.
- Do not run blocking I/O or CPU-heavy work on executor worker threads.
- Do not use unbounded channels or unlimited task spawning when producers can outrun consumers.
