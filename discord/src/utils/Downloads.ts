import { createWriteStream } from "node:fs";
import { access, constants, mkdir, readdir } from "node:fs/promises";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { basename, join } from "node:path";
import fs from "node:fs/promises";

const streamPipeline = promisify(pipeline);
const SAFE_DOWNLOAD_DIR = join(process.cwd(), "downloaded");

function sanitizeFilename(filename: string): string {
  return basename(filename);
}

function validateUrl(input: string): URL {
  const url = new URL(input);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Invalid protocol: only HTTP/HTTPS are allowed.");
  }
  return url;
}

const audioExtensions = [
  ".mp3",
  ".wav",
  ".ogg",
  ".flac",
  ".aac",
  ".m4a",
  ".wma",
];

export async function isAudioFile(filename: string) {
  const lower = filename.toLowerCase();
  return audioExtensions.some((ext) => lower.endsWith(ext));
}

export async function listFiles(): Promise<string[]> {
  try {
    const files = (await readdir(SAFE_DOWNLOAD_DIR)).filter(isAudioFile);
    return files;
  } catch (err) {
    console.error("Error listing files:", err);
    return [];
  }
}

export async function doesFileExist(filename: string) {
  const safeName = sanitizeFilename(filename);
  try {
    await access(join(SAFE_DOWNLOAD_DIR, safeName), constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function download(urlString: string, filename: string) {
  const url = validateUrl(urlString);
  const safeName = sanitizeFilename(filename);

  await mkdir(SAFE_DOWNLOAD_DIR, { recursive: true });

  const targetPath = join(SAFE_DOWNLOAD_DIR, safeName);
  if (await doesFileExist(safeName)) {
    throw new Error(`File ${safeName} already exists.`);
  }

  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(
      `Failed to download ${url}: ${res.status} ${res.statusText}`
    );
  }

  const tempPath = targetPath + ".tmp";
  const fileStream = createWriteStream(tempPath);

  await streamPipeline(res.body, fileStream);
  await fs.rename(tempPath, targetPath);
}
