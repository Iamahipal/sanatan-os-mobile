import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const appRoot = path.join(root, "apps", "temples");
const dataRoot = path.join(appRoot, "data");

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function listTempleIds() {
  const indexPath = path.join(dataRoot, "index.json");
  const index = await readJson(indexPath);

  assert(Array.isArray(index), "data/index.json must be an array.");

  for (const item of index) {
    assert(typeof item.id === "string" && item.id.trim(), "Each index item requires non-empty id.");
    assert(typeof item.name === "string" && item.name.trim(), `Temple ${item.id} missing name.`);
    assert(typeof item.thumbnail === "string" && item.thumbnail.trim(), `Temple ${item.id} missing thumbnail.`);
  }

  return index.map((item) => item.id);
}

async function validateTempleFiles(templeId) {
  const templeRoot = path.join(dataRoot, "temples", templeId);
  const requiredFiles = ["manifest.json", "deity.json", "facts.json", "why_visit.json", "media.json"];

  for (const fileName of requiredFiles) {
    const filePath = path.join(templeRoot, fileName);
    const parsed = await readJson(filePath);
    assert(parsed !== null, `${templeId}/${fileName} has invalid JSON.`);
  }

  const manifest = await readJson(path.join(templeRoot, "manifest.json"));
  assert(typeof manifest.id === "string" && manifest.id, `${templeId}/manifest.json missing id.`);
  assert(typeof manifest.name === "string" && manifest.name, `${templeId}/manifest.json missing name.`);

  const media = await readJson(path.join(templeRoot, "media.json"));
  assert(Array.isArray(media), `${templeId}/media.json must be an array.`);

  for (const item of media) {
    assert(typeof item.url === "string" && item.url.trim(), `${templeId}/media.json contains media item without url.`);
  }
}

async function run() {
  const templeIds = await listTempleIds();
  for (const templeId of templeIds) {
    await validateTempleFiles(templeId);
  }
  console.log(`Validated ${templeIds.length} temples successfully.`);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
