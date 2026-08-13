import { connectToDatabase } from "./mongodb";

export interface UserProfile {
  _id?: string;
  address: string;
  email: string;
  provider: string;
  created_at: string;
  last_login_at: string;
  login_count: number;
  last_ip?: string;
  location?: {
    city?: string;
    region?: string;
    country?: string;
    ip?: string;
    userAgent?: string;
  };
  sessions?: Array<{
    sessionId: string;
    loginAt: string;
    ip?: string;
    userAgent?: string;
    location?: { city?: string; region?: string; country?: string };
  }>;
  stats?: {
    totalRequests: number;
    completedContracts: number;
    totalSpentUsd: number;
  };
  updated_at: string;
}

export interface ActivityLogItem {
  id?: string;
  user_address: string;
  action: string;
  details?: Record<string, unknown>;
  ip?: string;
  location?: { city?: string; region?: string; country?: string };
  created_at: string;
}

// In-memory fallback if MongoDB URI is not set or temporarily connecting
const memoryUsers = new Map<string, UserProfile>();
const memoryLogs: ActivityLogItem[] = [];

/**
 * Upserts a user profile on wallet login / sign up into MongoDB.
 */
export async function upsertUserProfile(params: {
  address: string;
  email: string;
  provider: string;
  ip?: string;
  userAgent?: string;
  locationData?: { city?: string; region?: string; country?: string };
}): Promise<UserProfile> {
  const normAddress = params.address.toLowerCase();
  const now = new Date().toISOString();
  const sessionId = crypto.randomUUID();

  const sessionObj = {
    sessionId,
    loginAt: now,
    ip: params.ip || "127.0.0.1",
    userAgent: params.userAgent || "Browser",
    location: params.locationData || { city: "San Francisco", region: "CA", country: "US" },
  };

  const { db } = await connectToDatabase();

  if (db) {
    try {
      const existing = await db.collection<UserProfile>("users").findOne({ address: normAddress });

      if (existing) {
        const updateDoc = {
          $set: {
            email: params.email,
            provider: params.provider,
            last_login_at: now,
            last_ip: params.ip || existing.last_ip || "127.0.0.1",
            location: params.locationData || existing.location || { city: "San Francisco", region: "CA", country: "US" },
            updated_at: now,
          },
          $inc: { login_count: 1 },
          $push: {
            sessions: {
              $each: [sessionObj],
              $slice: -20, // Keep last 20 sessions on profile
            },
          },
        };

        await db.collection("users").updateOne({ address: normAddress }, updateDoc);
        const updated = await db.collection<UserProfile>("users").findOne({ address: normAddress });
        if (updated) return updated;
      } else {
        const newUser: UserProfile = {
          address: normAddress,
          email: params.email,
          provider: params.provider,
          created_at: now,
          last_login_at: now,
          login_count: 1,
          last_ip: params.ip || "127.0.0.1",
          location: params.locationData || { city: "San Francisco", region: "CA", country: "US" },
          sessions: [sessionObj],
          stats: {
            totalRequests: 0,
            completedContracts: 0,
            totalSpentUsd: 0,
          },
          updated_at: now,
        };

        await db.collection("users").insertOne(newUser);
        return newUser;
      }
    } catch (err) {
      console.error("[MongoDB User Upsert Error]", err);
    }
  }

  // Memory fallback
  const existingMem = memoryUsers.get(normAddress);
  const user: UserProfile = {
    address: normAddress,
    email: params.email,
    provider: params.provider,
    created_at: existingMem?.created_at || now,
    last_login_at: now,
    login_count: (existingMem?.login_count || 0) + 1,
    last_ip: params.ip || "127.0.0.1",
    location: params.locationData || { city: "San Francisco", region: "CA", country: "US" },
    sessions: [sessionObj, ...(existingMem?.sessions || []).slice(0, 19)],
    stats: existingMem?.stats || { totalRequests: 0, completedContracts: 0, totalSpentUsd: 0 },
    updated_at: now,
  };
  memoryUsers.set(normAddress, user);
  return user;
}

/**
 * Gets a user profile by wallet address.
 */
export async function getUserProfileByAddress(address: string): Promise<UserProfile | null> {
  const normAddress = address.toLowerCase();
  const { db } = await connectToDatabase();

  if (db) {
    try {
      const user = await db.collection<UserProfile>("users").findOne({ address: normAddress });
      if (user) return user;
    } catch (err) {
      console.error("[MongoDB Get User Error]", err);
    }
  }

  return memoryUsers.get(normAddress) || null;
}

/**
 * Records a user activity event in MongoDB.
 */
export async function recordUserActivity(params: {
  userAddress: string;
  action: string;
  details?: Record<string, unknown>;
  ip?: string;
  location?: { city?: string; region?: string; country?: string };
}): Promise<void> {
  const normAddress = params.userAddress.toLowerCase();
  const now = new Date().toISOString();

  const logItem: ActivityLogItem = {
    user_address: normAddress,
    action: params.action,
    details: params.details || {},
    ip: params.ip || "127.0.0.1",
    location: params.location || { city: "San Francisco", region: "CA", country: "US" },
    created_at: now,
  };

  const { db } = await connectToDatabase();

  if (db) {
    try {
      await db.collection("activity_logs").insertOne(logItem);
      // Also attach activity record to user document history
      await db.collection("users").updateOne(
        { address: normAddress },
        {
          $push: {
            activity_history: {
              $each: [{ action: params.action, details: params.details, created_at: now }],
              $slice: -50, // Keep last 50 activity events directly on profile
            },
          },
          $set: { updated_at: now },
        },
      );
      return;
    } catch (err) {
      console.error("[MongoDB Record Activity Error]", err);
    }
  }

  memoryLogs.push(logItem);
}

/**
 * Fetches activity logs for a user address.
 */
export async function getUserActivityLogs(address: string, limit = 30): Promise<ActivityLogItem[]> {
  const normAddress = address.toLowerCase();
  const { db } = await connectToDatabase();

  if (db) {
    try {
      const logs = await db
        .collection<ActivityLogItem>("activity_logs")
        .find({ user_address: normAddress })
        .sort({ created_at: -1 })
        .limit(limit)
        .toArray();
      return logs;
    } catch (err) {
      console.error("[MongoDB Get Activity Logs Error]", err);
    }
  }

  return memoryLogs
    .filter((l) => l.user_address === normAddress)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}
