import { connectToDatabase } from "./mongodb";
import { recordUserActivity, type UserProfile } from "./user.service";
import crypto from "crypto";

const JWT_SECRET = process.env["AUTH_SECRET"] || "draftforge_mongo_secure_jwt_secret_key_2026";

export interface MongoAuthUser {
  id: string;
  email: string;
  name?: string;
  address?: string;
  provider: "email" | "wallet" | "google";
  created_at: string;
}

export interface UserDocument {
  _id?: string;
  id: string;
  email: string;
  password_hash?: string;
  password_salt?: string;
  name?: string;
  address?: string;
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
  };
  sessions?: Array<{
    sessionId: string;
    loginAt: string;
    ip?: string;
    userAgent?: string;
    location?: { city?: string; region?: string; country?: string };
  }>;
  updated_at: string;
}

// In-memory user store fallback
const memoryAuthUsers = new Map<string, UserDocument>();

/**
 * Hashes a password using PBKDF2 with a random salt.
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return { hash, salt };
}

/**
 * Verifies a password against the stored hash and salt.
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return checkHash === hash;
}

/**
 * Creates a signed stateless auth token containing user metadata.
 */
export function createSessionToken(payload: {
  userId: string;
  email: string;
  address?: string;
  name?: string;
  provider: string;
}): string {
  const data = {
    sub: payload.userId,
    email: payload.email,
    address: payload.address,
    name: payload.name,
    provider: payload.provider,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
  };

  const encodedData = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(encodedData)
    .digest("base64url");

  return `${encodedData}.${signature}`;
}

/**
 * Decodes and verifies an auth session token.
 */
export function verifySessionToken(token: string): {
  userId: string;
  email: string;
  address?: string;
  name?: string;
  provider: string;
} | null {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [encodedData, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(encodedData)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(encodedData, "base64url").toString("utf8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return {
      userId: payload.sub,
      email: payload.email,
      address: payload.address,
      name: payload.name,
      provider: payload.provider,
    };
  } catch {
    return null;
  }
}

/**
 * Registers a new user with Email and Password directly in MongoDB.
 */
export async function registerWithEmailPassword(params: {
  email: string;
  password: string;
  name?: string;
  ip?: string;
  userAgent?: string;
  locationData?: { city?: string; region?: string; country?: string };
}): Promise<{ user: MongoAuthUser; token: string }> {
  const normEmail = params.email.trim().toLowerCase();
  if (!normEmail || !params.password) {
    throw new Error("Email and password are required.");
  }
  if (params.password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const { db } = await connectToDatabase();
  const now = new Date().toISOString();
  const userId = `usr_${crypto.randomUUID()}`;
  const { hash, salt } = hashPassword(params.password);
  const sessionId = crypto.randomUUID();

  const sessionObj = {
    sessionId,
    loginAt: now,
    ip: params.ip || "127.0.0.1",
    userAgent: params.userAgent || "Browser",
    location: params.locationData || { city: "San Francisco", region: "CA", country: "US" },
  };

  if (db) {
    const existing = await db.collection<UserDocument>("users").findOne({ email: normEmail });
    if (existing) {
      throw new Error("An account with this email address already exists. Please sign in.");
    }

    const userDoc: UserDocument = {
      id: userId,
      email: normEmail,
      password_hash: hash,
      password_salt: salt,
      name: params.name || normEmail.split("@")[0],
      provider: "email",
      created_at: now,
      last_login_at: now,
      login_count: 1,
      last_ip: params.ip || "127.0.0.1",
      location: params.locationData || { city: "San Francisco", region: "CA", country: "US" },
      sessions: [sessionObj],
      updated_at: now,
    };

    await db.collection("users").insertOne(userDoc);

    await recordUserActivity({
      userAddress: normEmail,
      action: "user_registered_email",
      details: { email: normEmail, name: params.name },
      ip: params.ip,
      location: params.locationData,
    });

    const token = createSessionToken({
      userId,
      email: normEmail,
      name: params.name,
      provider: "email",
    });

    return {
      user: {
        id: userId,
        email: normEmail,
        name: params.name,
        provider: "email",
        created_at: now,
      },
      token,
    };
  }

  // Memory fallback
  if (memoryAuthUsers.has(normEmail)) {
    throw new Error("An account with this email already exists in session.");
  }

  const userDoc: UserDocument = {
    id: userId,
    email: normEmail,
    password_hash: hash,
    password_salt: salt,
    name: params.name || normEmail.split("@")[0],
    provider: "email",
    created_at: now,
    last_login_at: now,
    login_count: 1,
    last_ip: params.ip || "127.0.0.1",
    location: params.locationData || { city: "San Francisco", region: "CA", country: "US" },
    sessions: [sessionObj],
    updated_at: now,
  };

  memoryAuthUsers.set(normEmail, userDoc);
  const token = createSessionToken({
    userId,
    email: normEmail,
    name: params.name,
    provider: "email",
  });

  return {
    user: {
      id: userId,
      email: normEmail,
      name: params.name,
      provider: "email",
      created_at: now,
    },
    token,
  };
}

/**
 * Authenticates a user with Email and Password directly from MongoDB.
 */
export async function loginWithEmailPassword(params: {
  email: string;
  password: string;
  ip?: string;
  userAgent?: string;
  locationData?: { city?: string; region?: string; country?: string };
}): Promise<{ user: MongoAuthUser; token: string }> {
  const normEmail = params.email.trim().toLowerCase();
  const { db } = await connectToDatabase();
  const now = new Date().toISOString();
  const sessionId = crypto.randomUUID();

  const sessionObj = {
    sessionId,
    loginAt: now,
    ip: params.ip || "127.0.0.1",
    userAgent: params.userAgent || "Browser",
    location: params.locationData || { city: "San Francisco", region: "CA", country: "US" },
  };

  if (db) {
    const user = await db.collection<UserDocument>("users").findOne({ email: normEmail });
    if (!user || !user.password_hash || !user.password_salt) {
      throw new Error("Invalid email or password. Please check your credentials.");
    }

    const isValid = verifyPassword(params.password, user.password_hash, user.password_salt);
    if (!isValid) {
      throw new Error("Invalid email or password. Please check your credentials.");
    }

    await db.collection("users").updateOne(
      { email: normEmail },
      {
        $set: {
          last_login_at: now,
          last_ip: params.ip || user.last_ip || "127.0.0.1",
          location: params.locationData || user.location,
          updated_at: now,
        },
        $inc: { login_count: 1 },
        $push: {
          sessions: {
            $each: [sessionObj],
            $slice: -20,
          },
        },
      },
    );

    await recordUserActivity({
      userAddress: normEmail,
      action: "user_login_email",
      details: { email: normEmail },
      ip: params.ip,
      location: params.locationData,
    });

    const token = createSessionToken({
      userId: user.id || user._id?.toString() || normEmail,
      email: user.email,
      name: user.name,
      address: user.address,
      provider: "email",
    });

    return {
      user: {
        id: user.id || user._id?.toString() || normEmail,
        email: user.email,
        name: user.name,
        address: user.address,
        provider: "email",
        created_at: user.created_at,
      },
      token,
    };
  }

  // Memory fallback
  const user = memoryAuthUsers.get(normEmail);
  if (!user || !user.password_hash || !user.password_salt) {
    throw new Error("Invalid email or password.");
  }

  const isValid = verifyPassword(params.password, user.password_hash, user.password_salt);
  if (!isValid) {
    throw new Error("Invalid email or password.");
  }

  const token = createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    provider: "email",
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: "email",
      created_at: user.created_at,
    },
    token,
  };
}
