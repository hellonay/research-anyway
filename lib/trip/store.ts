import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { createSeedTrip } from "./seed";
import type { Trip } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "trip.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// 서버 재시작 사이에도 유지되는 유일한 저장소: DB 없이 로컬 JSON 파일 하나에 여행 전체를 담는다.
// (docs/decisions/data-storage.md)

// 기존에 저장된 파일에 새로 추가된 필드(정보 카드, 사진첩)가 없을 수 있어 기본값으로 채운다.
function normalizeTrip(trip: Trip): Trip {
  trip.infoNotes ??= [];
  trip.galleryPhotos ??= [];
  return trip;
}

async function readTripFile(): Promise<Trip> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return normalizeTrip(JSON.parse(raw) as Trip);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      const seed = createSeedTrip();
      await writeTripFile(seed);
      return seed;
    }
    throw error;
  }
}

async function writeTripFile(trip: Trip): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(trip, null, 2), "utf-8");
}

// 동시 요청이 같은 파일을 읽고-고치고-쓰는 동안 서로 덮어쓰지 않도록 순서를 강제하는 간단한 큐.
let writeQueue: Promise<unknown> = Promise.resolve();

export async function readTrip(): Promise<Trip> {
  return readTripFile();
}

export async function mutateTrip(
  mutate: (trip: Trip) => Trip | void
): Promise<Trip> {
  const result = writeQueue.then(async () => {
    const trip = await readTripFile();
    const next = mutate(trip) ?? trip;
    await writeTripFile(next);
    return next;
  });
  writeQueue = result.catch(() => undefined);
  return result;
}

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// 이미지 파일만 public/uploads에 저장하고, 공유 링크로 바로 보여줄 수 있는 /uploads/... 경로를 돌려준다.
export async function savePhoto(file: File): Promise<string | null> {
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) return null;

  await mkdir(UPLOADS_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}
