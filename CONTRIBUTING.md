# Contributing

## Local checks

```bash
npm test
npm run list
npm pack --dry-run
```

## Skill rules

Each skill must live in its own directory with a `SKILL.md` file and valid frontmatter:

```yaml
---
name: lowercase-skill-name
description: Specific trigger description explaining when Pi should use this skill.
license: MIT
---
```

Use lowercase letters, numbers, and hyphens for skill names. Keep descriptions specific so Pi loads the right skill at the right time.

## Release process

1. Update `CHANGELOG.md`.
2. Update `package.json` version.
3. Run `npm test`.
4. Run `npm pack --dry-run` and verify the files list.
5. Publish with `npm publish --access public`.
6. Create a matching git tag.
