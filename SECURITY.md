# Security Policy

## Reporting a vulnerability

Open a private security advisory on the repository if available, or email the maintainer listed in the package metadata.

## Package behavior

The extension included in this package is intentionally read-only. It inspects Rust project metadata and toolchain versions. It does not write files, delete files, send network traffic, or publish crates.

The skills are instruction documents. They can guide an agent to run commands in a user's project, so users should review the skill contents before installing or invoking them.

## Maintainer checklist

- Keep extension tools read-only unless a future version clearly documents write behavior.
- Avoid adding install scripts to `package.json`.
- Keep dependencies minimal.
- Review generated or contributed skills for dangerous instructions.
