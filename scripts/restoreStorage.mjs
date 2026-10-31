// Uploads Storage files downloaded from a paused Supabase project, without overwriting.
// Usage: node --env-file=.env scripts/restoreStorage.mjs <dump> <filesDir> [--apply]

import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  detectMimeType,
  parseObjectManifest,
  planUploads,
} from "./storageManifest.mjs";

const PAGE_SIZE = 1000;

const readLocalSizes = async (filesDir, manifest) => {
  const sizes = new Map();
  for (const { bucket, name } of manifest) {
    const file = await stat(join(filesDir, bucket, name)).catch(() => null);
    if (file) sizes.set(`${bucket}/${name}`, file.size);
  }
  return sizes;
};

const readRemoteKeys = async (supabase, buckets) => {
  const keys = new Set();
  for (const bucket of buckets) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list("", { limit: PAGE_SIZE });
    if (error) throw new Error(`Cannot list ${bucket}: ${error.message}`);
    data.forEach((file) => keys.add(`${bucket}/${file.name}`));
  }
  return keys;
};

const uploadObject = async (supabase, filesDir, { bucket, name }) => {
  const bytes = await readFile(join(filesDir, bucket, name));
  const { error } = await supabase.storage.from(bucket).upload(name, bytes, {
    cacheControl: "3600",
    contentType: detectMimeType(bytes),
    upsert: false,
  });
  if (error) throw new Error(`Cannot upload ${bucket}/${name}: ${error.message}`);
  console.log(`uploaded ${bucket}/${name}`);
};

const printPlan = (plan) => {
  Object.entries(plan).forEach(([group, objects]) => {
    console.log(`${group}: ${objects.length}`);
    if (group === "missing" || group === "sizeMismatch") {
      objects.forEach(({ bucket, name }) => console.log(`  ${bucket}/${name}`));
    }
  });
};

const main = async () => {
  const [dumpPath, filesDir, flag] = process.argv.slice(2);
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key } =
    process.env;
  if (!dumpPath || !filesDir || !url || !key) {
    throw new Error("Missing dump path, files folder or Supabase variables");
  }

  const manifest = parseObjectManifest(await readFile(dumpPath, "utf8"));
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const buckets = [...new Set(manifest.map(({ bucket }) => bucket))];
  const plan = planUploads(
    manifest,
    await readLocalSizes(filesDir, manifest),
    await readRemoteKeys(supabase, buckets)
  );

  printPlan(plan);
  if (flag !== "--apply") return console.log("Dry run: nothing was uploaded");
  for (const object of plan.upload) {
    await uploadObject(supabase, filesDir, object);
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
