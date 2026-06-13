---
name: rust-performance
description: Profiles and optimizes Rust code for CPU, memory, allocations, binary size, async throughput, dependency bloat, and algorithmic complexity. Use when Rust code is slow, allocates too much, or needs performance review.
license: MIT
compatibility: Rust stable. Optional tools include criterion, cargo-flamegraph, heaptrack, samply, perf, dhat, and cargo-bloat.
---

# Rust Performance

Use this skill when the user asks to speed up Rust code, reduce allocations, shrink binary size, or explain performance tradeoffs.

## Workflow

1. Define the performance goal and workload.
2. Measure before changing code.
3. Look for algorithmic improvements before micro-optimizations.
4. Make one change at a time and compare results.
5. Preserve readability unless the measured gain justifies complexity.

## Measurement commands

```bash
cargo test --release
cargo bench
cargo build --release
```

Optional tools when installed:

```bash
cargo flamegraph --bench bench_name
cargo bloat --release --crates
heaptrack target/release/binary_name
```

Use `criterion` for stable benchmarks:

```toml
[dev-dependencies]
criterion = "0.5"

[[bench]]
name = "throughput"
harness = false
```

## Common Rust performance checks

- Avoid unnecessary `String` allocation; prefer `&str` where ownership is not needed.
- Avoid repeated allocation inside loops; reuse buffers.
- Prefer iterator clarity, but verify generated performance when hot.
- Use `HashMap::with_capacity` when size is known.
- Avoid cloning large structures; clone IDs or handles instead.
- Use `Cow` only when it simplifies a real borrowed-or-owned API.
- Check `Debug` or formatting in hot paths.
- Avoid holding async locks in hot loops.

## Binary size

```toml
[profile.release]
lto = true
codegen-units = 1
strip = true
panic = "abort"
```

Review dependencies and features before adding size-focused profile settings.

## Async throughput

- Look for blocking calls on executor workers.
- Add bounded queues for backpressure.
- Batch small operations when safe.
- Avoid unbounded task spawning.
- Use `tracing` to find slow spans.

## Output expectations

Provide baseline measurement, change made, new measurement, tradeoffs, and commands used. If no measurement is possible, clearly label recommendations as hypotheses.
