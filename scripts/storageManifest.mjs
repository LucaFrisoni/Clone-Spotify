// Reads the Storage file list from a database dump and plans which files to upload.

const COPY_OBJECTS = /^COPY storage\.objects \(.*\) FROM stdin;$/;

export const parseObjectManifest = (dump) => {
  const lines = dump.split(/\r?\n/);
  const start = lines.findIndex((line) => COPY_OBJECTS.test(line));
  if (start === -1) {
    throw new Error("The dump has no storage.objects table");
  }

  const manifest = [];
  for (const line of lines.slice(start + 1)) {
    if (line === "\\.") break;
    const [, bucket, name, , , , , metadata] = line.split("\t");
    const size = Number(metadata.match(/"size": (\d+)/)?.[1]);
    if (size > 0) manifest.push({ bucket, name, size });
  }
  return manifest;
};

export const planUploads = (manifest, localSizes, remoteKeys) => {
  const plan = { upload: [], present: [], missing: [], sizeMismatch: [] };

  for (const object of manifest) {
    const key = `${object.bucket}/${object.name}`;
    if (remoteKeys.has(key)) plan.present.push(object);
    else if (!localSizes.has(key)) plan.missing.push(object);
    else if (localSizes.get(key) !== object.size) plan.sizeMismatch.push(object);
    else plan.upload.push(object);
  }
  return plan;
};

export const detectMimeType = (bytes) => {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png";
  if (bytes.subarray(8, 12).toString() === "WEBP") return "image/webp";
  if (bytes.subarray(0, 3).toString() === "ID3") return "audio/mpeg";
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return "audio/mpeg";
  return "application/octet-stream";
};
