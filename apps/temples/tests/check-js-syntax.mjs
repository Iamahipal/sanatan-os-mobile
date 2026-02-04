import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();

const files = [
  "apps/temples/app/main.js",
  "apps/temples/app/ui.js",
  "apps/temples/app/data-service.js",
  "apps/temples/app/router.js",
  "apps/temples/app/pwa.js",
  "apps/temples/app/i18n.js",
  "apps/temples/app/preferences.js",
  "apps/temples/sw.js"
];

for (const relativePath of files) {
  const fullPath = path.join(root, relativePath);
  const result = spawnSync(process.execPath, ["--check", fullPath], { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log(`Syntax check passed for ${files.length} files.`);
