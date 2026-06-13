import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const MAX_STDOUT = 80_000;
const MAX_FILE_PREVIEW = 24_000;

type RunResult = {
  ok: boolean;
  command: string;
  stdout: string;
  stderr: string;
  error?: string;
};

type RustProjectContextParams = {
  cwd?: string;
  includeMetadata?: boolean;
  includeTree?: boolean;
  includeCargoToml?: boolean;
};

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function truncate(value: string, max = MAX_STDOUT): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}\n\n[truncated ${value.length - max} characters]`;
}

async function run(command: string, args: string[], cwd: string, timeout = 20_000): Promise<RunResult> {
  try {
    const result = await execFileAsync(command, args, {
      cwd,
      timeout,
      maxBuffer: MAX_STDOUT * 2,
      windowsHide: true,
    });

    return {
      ok: true,
      command: [command, ...args].join(" "),
      stdout: truncate(result.stdout ?? ""),
      stderr: truncate(result.stderr ?? ""),
    };
  } catch (error) {
    const err = error as Error & { stdout?: string; stderr?: string; code?: string | number };
    return {
      ok: false,
      command: [command, ...args].join(" "),
      stdout: truncate(err.stdout ?? ""),
      stderr: truncate(err.stderr ?? ""),
      error: err.message,
    };
  }
}

function section(title: string, body: string): string {
  return `## ${title}\n\n${body.trim() || "(no output)"}`;
}

function formatRun(result: RunResult): string {
  const status = result.ok ? "ok" : "failed";
  const parts = [`$ ${result.command}`, `status: ${status}`];

  if (result.error) parts.push(`error: ${result.error}`);
  if (result.stdout.trim()) parts.push(`stdout:\n${result.stdout.trim()}`);
  if (result.stderr.trim()) parts.push(`stderr:\n${result.stderr.trim()}`);

  return parts.join("\n");
}

async function readOptionalCargoToml(cwd: string): Promise<string> {
  const cargoToml = path.join(cwd, "Cargo.toml");
  if (!(await exists(cargoToml))) return "Cargo.toml not found in this directory.";

  const content = await readFile(cargoToml, "utf8");
  return truncate(content, MAX_FILE_PREVIEW);
}

export default function rustSkillsExtension(pi: ExtensionAPI) {
  pi.registerTool({
    name: "rust_project_context",
    label: "Rust Project Context",
    description:
      "Inspect a Rust project or workspace using read-only Rust/Cargo commands and return toolchain, manifest, metadata, and dependency context.",
    promptSnippet: "Inspect Rust/Cargo project context before planning Rust code changes.",
    promptGuidelines: [
      "Use rust_project_context when the user asks to change, review, debug, test, or publish an existing Rust project and Cargo.toml is likely present.",
      "Use rust_project_context output to choose the right Rust skill, target crate, feature flags, workspace member, and validation commands.",
      "Do not use rust_project_context as a replacement for reading source files; it only provides project-level context.",
    ],
    parameters: Type.Object({
      cwd: Type.Optional(
        Type.String({
          description:
            "Directory to inspect. Defaults to the current working directory where Pi is running.",
        }),
      ),
      includeMetadata: Type.Optional(
        Type.Boolean({
          description:
            "Run cargo metadata --no-deps --format-version 1. Defaults to true.",
        }),
      ),
      includeTree: Type.Optional(
        Type.Boolean({
          description:
            "Run cargo tree -e features. Defaults to false because it can be noisy on large projects.",
        }),
      ),
      includeCargoToml: Type.Optional(
        Type.Boolean({
          description: "Include a preview of Cargo.toml. Defaults to true.",
        }),
      ),
    }),
    async execute(_toolCallId, params: RustProjectContextParams) {
      const cwd = path.resolve(params.cwd ?? process.cwd());
      const includeMetadata = params.includeMetadata ?? true;
      const includeTree = params.includeTree ?? false;
      const includeCargoToml = params.includeCargoToml ?? true;

      const cargoTomlPath = path.join(cwd, "Cargo.toml");
      const hasCargoToml = await exists(cargoTomlPath);

      const checks: string[] = [];
      checks.push(`cwd: ${cwd}`);
      checks.push(`Cargo.toml: ${hasCargoToml ? cargoTomlPath : "not found"}`);

      const outputs: string[] = [section("Rust workspace detection", checks.join("\n"))];

      const versionCommands: Array<[string, string[]]> = [
        ["rustc", ["--version"]],
        ["cargo", ["--version"]],
        ["rustup", ["show", "active-toolchain"]],
        ["rustfmt", ["--version"]],
        ["cargo", ["clippy", "--version"]],
      ];

      const versionResults = await Promise.all(versionCommands.map(([cmd, args]) => run(cmd, args, cwd, 10_000)));
      outputs.push(section("Toolchain", versionResults.map(formatRun).join("\n\n")));

      if (includeCargoToml) {
        outputs.push(section("Cargo.toml preview", await readOptionalCargoToml(cwd)));
      }

      if (hasCargoToml && includeMetadata) {
        const metadata = await run("cargo", ["metadata", "--no-deps", "--format-version", "1"], cwd, 30_000);
        outputs.push(section("cargo metadata --no-deps", formatRun(metadata)));
      }

      if (hasCargoToml && includeTree) {
        const tree = await run("cargo", ["tree", "-e", "features"], cwd, 30_000);
        outputs.push(section("cargo tree -e features", formatRun(tree)));
      }

      const text = outputs.join("\n\n---\n\n");

      return {
        content: [{ type: "text", text }],
        details: {
          cwd,
          hasCargoToml,
          includeMetadata,
          includeTree,
          includeCargoToml,
        },
      };
    },
  });
}
