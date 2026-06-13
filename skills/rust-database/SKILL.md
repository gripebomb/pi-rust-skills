---
name: rust-database
description: Builds and reviews Rust database code with SQLx, Diesel, migrations, transactions, pooling, query validation, test databases, schema drift checks, and async database error handling. Use for Rust persistence and data access work.
license: MIT
compatibility: Rust stable. Common tools include SQLx, Diesel, refinery, sea-query, PostgreSQL, SQLite, and MySQL.
---

# Rust Database

Use this skill when implementing, testing, or reviewing Rust data access layers, migrations, and database-backed workflows.

## Workflow

1. Inspect `Cargo.toml`, workspace shape, feature flags, target crates, and `rust_project_context` output when available.
2. Identify the database engine, migration tool, connection pool, schema ownership, and transaction boundaries.
3. Keep SQL/data access behind a small module or repository boundary that is easy to test.
4. Add tests for migrations, query behavior, transaction rollback, uniqueness/conflict handling, and missing-row behavior.
5. Validate schema and query checks using the project's chosen tool.

## Design rules

- Prefer compile-time checked queries when SQLx offline data or live database validation is available.
- Keep migrations forward-only unless the project already maintains down migrations.
- Use transactions for multi-step invariants and make rollback behavior explicit.
- Configure pool size, timeouts, and retry policy deliberately.
- Map database errors into domain errors at the boundary.
- Avoid leaking raw SQL errors to user-facing API responses.
- Treat schema drift between migrations, generated types, and tests as a correctness bug.

## Commands

```bash
cargo test --workspace --all-features
cargo clippy --workspace --all-targets --all-features -- -D warnings
sqlx migrate run
sqlx prepare --check
diesel migration run
```

Use the commands that match the project. Do not require SQLx or Diesel if the project uses another migration path.

## Testing

- Use isolated test databases, transactions, schemas, or temporary SQLite files.
- Seed only the records each test needs.
- Test constraints and conflict cases, not only happy-path queries.
- Keep tests deterministic and independent of production data.

## Avoid

- Do not build SQL by string concatenation with untrusted input.
- Do not add global database state that makes tests order-dependent.
- Do not hide failed migrations or query validation behind broad error handling.

## Output expectations

Report schema or query changes, migration behavior, transaction assumptions, validation commands, and required database setup.
