import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { hasDatabase, readTripRow, writeTripRow } from "./db";
import { createSeedTrip } from "./seed";
import type { Trip } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "trip.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// 저장소는 두 가지다: DATABASE_URL이 있으면(Vercel 등 서버리스 배포) Postgres에,
// 없으면(로컬 bun dev) 로컬 JSON 파일에 저장한다. Vercel의 서버리스 함수는 배포된
// 코드 디렉터리에 쓰기가 안 되어 로컬 파일 방식이 그 환경에서는 동작하지 않기
// 때문이다. (docs/decisions/data-storage.md)

// 기존에 저장된 데이터에 새로 추가된 필드(정보 카드, 사진첩)가 없을 수 있어 기본값으로 채운다.
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

async function readTripFromDb(): Promise<Trip> {
  const row = await readTripRow();
  if (row) return normalizeTrip(row as Trip);
  const seed = createSeedTrip();
  await writeTripRow(seed);
  return seed;
}

async function loadTrip(): Promise<Trip> {
  return hasDatabase() ? readTripFromDb() : readTripFile();
}

async function persistTrip(trip: Trip): Promise<void> {
  await (hasDatabase() ? writeTripRow(trip) : writeTripFile(trip));
}

// 동시 요청이 같은 저장소를 읽고-고치고-쓰는 동안 서로 덮어쓰지 않도록 순서를 강제하는 간단한 큐.
let writeQueue: Promise<unknown> = Promise.resolve();

export async function readTrip(): Promise<Trip> {
  return loadTrip();
}

export async function mutateTrip(
  mutate: (trip: Trip) => Trip | void
): Promise<Trip> {
  const result = writeQueue.then(async () => {
    const trip = await loadTrip();
    const next = mutate(trip) ?? trip;
    await persistTrip(next);
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

// DB 모드에서는 별도 파일 저장소가 없어 이미지를 data URL로 인코딩해 Trip 데이터 안에 그대로 담는다.
// 로컬 파일 모드에서는 public/uploads에 저장하고 공유 링크로 바로 보여줄 수 있는 /uploads/... 경로를 돌려준다.
export async function savePhoto(file: File): Promise<string | null> {
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) return null;

  if (hasDatabase()) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  await mkdir(UPLOADS_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}
