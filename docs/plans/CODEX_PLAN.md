## Project: Pi Rust Skills Plugin Upgrade

**Goal**: Turn `pi-rust-skills` from a good bootstrap into a reliable, publishable npm package with tested skills, validated packaging, safer extension behavior, and stronger Pi-facing docs.  
**Timeline**: 2-3 focused weeks for one maintainer.  
**Team**: 1 maintainer, optional reviewer for release/package sanity.  
**Constraints**: Keep dependencies minimal, preserve read-only extension posture, avoid overbuilding.

## Milestones

| # | Milestone | Target | Success Criteria |
|---|---|---:|---|
| 1 | Package Validation Fixed | End Week 1 | `npm test` works on Windows, WSL/Linux, and CI |
| 2 | Extension Verified | End Week 1 | Extension import/register smoke test passes |
| 3 | CI Hardened | Mid Week 2 | CI covers Windows + Linux, Node 20/22/current |
| 4 | Skill Quality Pass | End Week 2 | Validator checks metadata drift, names, README table, references |
| 5 | Release-Ready Docs | Week 3 | README, examples, contributing, changelog support npm release |

## Phase 1: Fix Package Reliability

| Task | Effort | Depends On | Done Criteria |
|---|---:|---|---|
| Replace `new URL(...).pathname` with `fileURLToPath` in scripts | 2h | None | `validate-skills` and `list-skills` work from Windows paths |
| Add Windows path regression fixture/test | 3h | Script fix | Test proves no `C:\C:\...` or UNC duplication bug |
| Decide TS packaging strategy | 3h | None | Written choice: raw TS supported by Pi, or build to `dist` |
| Add extension smoke test | 4h | Packaging decision | Fake `pi.registerTool` captures `rust_project_context` |
| Fix dependency model for `typebox` | 2h | Packaging decision | Runtime import works locally or is explicitly host-provided |

## Phase 2: Strengthen Validation

| Task | Effort | Depends On | Done Criteria |
|---|---:|---|---|
| Replace ad hoc frontmatter parsing with YAML parser or stricter parser | 4h | Package scripts fixed | Quoted values, colons, malformed YAML handled cleanly |
| Enforce directory name equals skill name | 2h | Validator update | Mismatch fails validation |
| Validate `license`, `description`, and trigger specificity | 3h | Validator update | Bad/missing fields produce actionable errors |
| Validate package `pi` manifest paths exist | 2h | Validator update | Broken `pi.extensions` or `pi.skills` fails |
| Check README skill table against actual skills | 4h | Validator update | Drift fails or warns clearly |

## Phase 3: Harden Extension Safety

| Task | Effort | Depends On | Done Criteria |
|---|---:|---|---|
| Add safer Cargo execution mode | 4h | Extension smoke test | Default uses `--frozen` or documents why not |
| Add optional `offline`/`frozen`/`locked` parameter | 4h | Safety decision | User can choose Cargo behavior intentionally |
| Improve command result details | 3h | Smoke test | Timeout, missing tool, and nonzero exit are clear |
| Add fake-project test for no `Cargo.toml` | 3h | Smoke test harness | Tool returns useful context without crashing |
| Add fake-project test for Cargo project | 4h | Test harness | Metadata/Cargo.toml branches are covered |

## Phase 4: CI and Release Workflow

| Task | Effort | Depends On | Done Criteria |
|---|---:|---|---|
| Add CI matrix for OS and Node versions | 3h | Package scripts fixed | Ubuntu + Windows, Node 20/22/current |
| Add `npm run list` to CI | 1h | None | Skill listing checked in CI |
| Add `npm pack --dry-run` artifact inspection | 3h | Build/package strategy | CI verifies expected files are packed |
| Add `npm publish --dry-run` or release dry-run docs | 2h | Pack validation | Maintainer has repeatable release check |
| Add badges once CI exists | 1h | CI merged | README shows package health |

## Phase 5: Skill and Docs Polish

| Task | Effort | Depends On | Done Criteria |
|---|---:|---|---|
| Add examples for async, CLI, WASM, FFI, performance, refactor, CI | 4h | None | Every bundled skill has at least one example prompt |
| Link skills to shared references where useful | 4h | Skill review | Skills consistently mention `RUST_AGENT_GUIDE` or commands ref |
| Add “skill selection guide” to README | 3h | Examples pass | Users know which skill to invoke and combine |
| Add release checklist to `CONTRIBUTING.md` | 2h | CI/release workflow | Publishing steps match actual checks |
| Add issue templates or maintainer checklist | 3h | Docs pass | Contributors know how to report skill bugs or package bugs |

## Dependencies Map

```text
Script path fix
  -> Validator tests
  -> CI matrix
  -> npm pack confidence

Packaging decision
  -> Dependency model
  -> Extension smoke test
  -> CI import/register test

Validator upgrade
  -> README drift checks
  -> Release confidence

Extension safety
  -> Security docs update
  -> Release readiness
```

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Pi expects raw `.ts` extensions | High | Medium | Confirm package conventions before switching to `dist` |
| Adding deps bloats a simple package | Medium | Medium | Use one small YAML parser or a constrained local parser |
| Cargo `--frozen` breaks legitimate first-run context | Medium | Medium | Make safe mode default but configurable |
| CI matrix reveals platform-specific npm behavior | Medium | High | Good outcome; fix before publishing |
| Skill validator becomes too strict | Low | Medium | Use warnings first for subjective checks |

## Recommended Order

Start with the script path bug and extension smoke test. Those are the sharp edges. Then harden CI so regressions stay caught. After that, improve validation and docs. The Rust skill content is already the calm center of the package; the wrapper around it just needs to grow a spine.
