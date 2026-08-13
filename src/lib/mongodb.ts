import type { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export function getMongoUri(): string | null {
  return (
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    process.env.MONGODB_URL ||
    process.env.DATABASE_URL ||
    null
  );
}

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  const uri = getMongoUri();
  if (!uri) {
    return { client: null, db: null };
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("draftforge");

    cachedClient = client;
    cachedDb = db;

    // Ensure helpful indexes on key collections
    try {
      await db.collection("users").createIndex({ address: 1 }, { unique: true, sparse: true });
      await db.collection("draft_requests").createIndex({ id: 1 }, { unique: true });
      await db.collection("draft_requests").createIndex({ user_address: 1 });
      await db.collection("activity_logs").createIndex({ user_address: 1, created_at: -1 });
      await db.collection("payments").createIndex({ tx_hash: 1 }, { sparse: true });
    } catch (idxErr) {
      console.warn("[MongoDB Index Notice]", idxErr);
    }

    return { client, db };
  } catch (error) {
    console.error("[MongoDB Connection Error]", error);
    return { client: null, db: null };
  }
}


