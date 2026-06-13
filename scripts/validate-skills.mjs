#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const skillsRoot = path.join(root, "skills");
const namePattern = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const errors = [];
const warnings = [];

async function walk(dir) {
  const entries = await readdir(dir);
  const skillDirs = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const info = await stat(full);
    if (info.isDirectory()) {
      try {
        await stat(path.join(full, "SKILL.md"));
        skillDirs.push(full);
      } catch {
        const nested = await walk(full);
        skillDirs.push(...nested);
      }
    }
  }
  return skillDirs;
}

function parseFrontmatter(content, file) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    errors.push(`${file}: missing YAML frontmatter`);
    return {};
  }

  const fields = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    value = value.replace(/^['"]|['"]$/g, "");
    fields[key] = value;
  }
  return fields;
}

const skillDirs = await walk(skillsRoot);
const names = new Map();

for (const dir of skillDirs) {
  const file = path.join(dir, "SKILL.md");
  const rel = path.relative(root, file);
  const content = await readFile(file, "utf8");
  const fm = parseFrontmatter(content, rel);

  if (!fm.name) errors.push(`${rel}: frontmatter requires name`);
  if (!fm.description) errors.push(`${rel}: frontmatter requires description`);

  if (fm.name && !namePattern.test(fm.name)) {
    errors.push(`${rel}: invalid skill name '${fm.name}'`);
  }

  if (fm.name && fm.name.length > 64) {
    errors.push(`${rel}: skill name exceeds 64 characters`);
  }

  if (fm.description && fm.description.length > 1024) {
    errors.push(`${rel}: description exceeds 1024 characters`);
  }

  if (fm.name && names.has(fm.name)) {
    errors.push(`${rel}: duplicate skill name '${fm.name}' also found in ${names.get(fm.name)}`);
  }
  if (fm.name) names.set(fm.name, rel);

  if (!content.includes("## Workflow")) {
    warnings.push(`${rel}: consider adding a '## Workflow' section`);
  }
}

if (skillDirs.length === 0) errors.push("no skills found");

if (warnings.length > 0) {
  console.warn("Warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error("Errors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${skillDirs.length} skills successfully.`);
