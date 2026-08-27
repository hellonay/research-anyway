import { Pool } from "pg";

// Vercel의 Postgres 마켓플레이스 연동(Neon 등)은 DATABASE_URL을 주입한다.
// 예전 "Vercel Postgres"와의 호환을 위해 POSTGRES_URL도 함께 확인한다.
const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

export function hasDatabase(): boolean {
  return Boolean(connectionString);
}

let pool: Pool | null = null;
let ensureTablePromise: Promise<void> | null = null;

function getPool(): Pool {
  if (!connectionString) {
    throw new Error("DATABASE_URL(또는 POSTGRES_URL)이 설정되어 있지 않습니다.");
  }
  pool ??= new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  return pool;
}

async function ensureTable(): Promise<void> {
  ensureTablePromise ??= getPool().query(
    `CREATE TABLE IF NOT EXISTS trip_data (
       id TEXT PRIMARY KEY,
       data JSONB NOT NULL
     )`
  ).then(() => undefined);
  await ensureTablePromise;
}

export async function readTripRow(): Promise<unknown | null> {
  await ensureTable();
  const result = await getPool().query(
    "SELECT data FROM trip_data WHERE id = $1",
    ["trip"]
  );
  return result.rows[0]?.data ?? null;
}

export async function writeTripRow(data: unknown): Promise<void> {
  await ensureTable();
  await getPool().query(
    `INSERT INTO trip_data (id, data) VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
    ["trip", JSON.stringify(data)]
  );
}
