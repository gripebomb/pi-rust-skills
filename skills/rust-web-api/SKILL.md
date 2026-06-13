---
name: rust-web-api
description: Builds and reviews Rust web APIs with Axum, Actix Web, Hyper, routing, extractors, middleware, request validation, auth boundaries, OpenAPI, graceful shutdown, and HTTP integration tests. Use for Rust server and web service work.
license: MIT
compatibility: Rust stable. Common stacks include Axum, Actix Web, Hyper, Tower, Tokio, Serde, and utoipa.
---

# Rust Web API

Use this skill when creating, changing, testing, or reviewing Rust HTTP APIs and services.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, and `rust_project_context` output when available.
2. Identify the API contract: routes, methods, request and response schemas, auth, errors, and compatibility expectations.
3. Keep transport concerns near the router and business logic in testable modules.
4. Add integration tests for happy paths, validation errors, auth failures, and shutdown behavior.
5. Validate with workspace-aware cargo commands and any service-specific tests.

## Design rules

- Prefer explicit typed extractors and response types over ad hoc JSON maps.
- Validate request size, content type, path/query parameters, and semantic constraints.
- Keep auth and authorization boundaries visible in middleware or extractors.
- Use structured errors that map predictably to HTTP status codes and response bodies.
- Add tracing spans for request IDs, route names, latency, and error classification.
- Document public APIs with OpenAPI only when consumers need a stable contract.
- Implement graceful shutdown for long-running services and background tasks.

## Testing

```bash
cargo test --workspace --all-features
cargo test -p crate_name --test api
cargo clippy --workspace --all-targets --all-features -- -D warnings
```

Test handlers through the router when possible. Use real HTTP only when socket behavior, TLS, middleware layers, or deployment wiring matters.

## Avoid

- Do not put database, auth, and business logic directly in route handlers.
- Do not return inconsistent error shapes for the same API.
- Do not log tokens, cookies, request bodies with secrets, or authorization headers.

## Output expectations

Report the API contract changed, routes affected, validation commands, and any compatibility or auth implications.
