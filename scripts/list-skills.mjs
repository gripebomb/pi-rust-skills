#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const skillsRoot = path.join(root, "skills");

async function walk(dir) {
  const entries = await readdir(dir);
  const skillDirs = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const info = await stat(full);
    if (!info.isDirectory()) continue;
    try {
      await stat(path.join(full, "SKILL.md"));
      skillDirs.push(full);
    } catch {
      skillDirs.push(...(await walk(full)));
    }
  }
  return skillDirs;
}

function frontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  const fields = {};
  if (!match) return fields;
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    fields[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return fields;
}

const rows = [];
for (const dir of await walk(skillsRoot)) {
  const content = await readFile(path.join(dir, "SKILL.md"), "utf8");
  const fm = frontmatter(content);
  rows.push({ name: fm.name, description: fm.description });
}

for (const row of rows.sort((a, b) => a.name.localeCompare(b.name))) {
  console.log(`/skill:${row.name}`);
  console.log(`  ${row.description}`);
}
