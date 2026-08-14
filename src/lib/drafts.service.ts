import { connectToDatabase } from "./mongodb";
import { recordUserActivity } from "./user.service";

export interface DraftAsset {
  id: string;
  kind: "image" | "video" | "reference";
  url: string;
  prompt?: string;
  signedUrl?: string | null;
  created_at: string;
}

export interface DraftRequestDoc {
  id: string;
  title: string;
  document_type: string;
  category: string;
  jurisdiction: string;
  urgency: string;
  description: string;
  key_terms: string[];
  counterparty_info?: string | null;
  governing_law?: string | null;
  special_instructions?: string | null;
  attached_files: { name: string; url: string; size?: number }[];
  assets?: DraftAsset[];
  dimensions?: string | null;
  units?: string;
  style?: string | null;
  package?: string;
  status:
    | "draft"
    | "submitted"
    | "paid"
    | "in_review"
    | "drafting"
    | "review_ready"
    | "completed"
    | "cancelled";
  price_usd: number;
  base_payment_tx?: string | null;
  payment_id?: string | null;
  payer_address?: string | null;
  payment_network?: string | null;
  paid_amount_usdc?: number | null;
  user_address?: string | null;
  draft_output?: string | null;
  ai_analysis?: {
    riskScore?: number;
    keyRisks?: string[];
    recommendations?: string[];
    clausesSummary?: string;
  } | null;
  created_at: string;
  updated_at: string;
}

const memoryDrafts = new Map<string, DraftRequestDoc>();

/**
 * Adds an asset (preview image, motion video, reference) to a draft request in MongoDB.
 */
export async function addAssetToDraftMongo(
  requestId: string,
  asset: DraftAsset,
): Promise<void> {
  const { db } = await connectToDatabase();
  if (db) {
    try {
      await db.collection("draft_requests").updateOne(
        { id: requestId },
        {
          $push: { assets: asset } as unknown as Record<string, unknown>,
          $set: { updated_at: new Date().toISOString() },
        },
      );
      return;
    } catch (err) {
      console.error("[MongoDB addAssetToDraftMongo Error]", err);
    }
  }

  const existing = memoryDrafts.get(requestId);
  if (existing) {
    existing.assets = [...(existing.assets || []), asset];
    existing.updated_at = new Date().toISOString();
  }
}


/**
 * Creates a new draft request document in MongoDB.
 */
export async function createDraftRequestMongo(doc: DraftRequestDoc): Promise<DraftRequestDoc> {
  const { db } = await connectToDatabase();

  if (db) {
    try {
      await db.collection("draft_requests").insertOne(doc);
      if (doc.user_address) {
        await recordUserActivity({
          userAddress: doc.user_address,
          action: "create_draft_request",
          details: { id: doc.id, title: doc.title, document_type: doc.document_type },
        });
      }
      return doc;
    } catch (err) {
      console.error("[MongoDB createDraftRequest Error]", err);
    }
  }

  memoryDrafts.set(doc.id, doc);
  return doc;
}

/**
 * Gets a draft request by ID from MongoDB.
 */
export async function getDraftRequestMongo(id: string): Promise<DraftRequestDoc | null> {
  const { db } = await connectToDatabase();

  if (db) {
    try {
      const row = await db.collection<DraftRequestDoc>("draft_requests").findOne({ id });
      if (row) return row;
    } catch (err) {
      console.error("[MongoDB getDraftRequest Error]", err);
    }
  }

  return memoryDrafts.get(id) || null;
}

/**
 * Lists draft requests from MongoDB.
 */
export async function listDraftRequestsMongo(userAddress?: string): Promise<DraftRequestDoc[]> {
  const { db } = await connectToDatabase();

  if (db) {
    try {
      const filter = userAddress ? { user_address: userAddress.toLowerCase() } : {};
      const rows = await db
        .collection<DraftRequestDoc>("draft_requests")
        .find(filter)
        .sort({ created_at: -1 })
        .toArray();
      return rows;
    } catch (err) {
      console.error("[MongoDB listDraftRequests Error]", err);
    }
  }

  const list = Array.from(memoryDrafts.values());
  if (userAddress) {
    const norm = userAddress.toLowerCase();
    return list.filter((d) => d.user_address?.toLowerCase() === norm);
  }
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Updates a draft request in MongoDB.
 */
export async function updateDraftRequestMongo(
  id: string,
  updatePayload: Partial<DraftRequestDoc>,
): Promise<DraftRequestDoc | null> {
  const now = new Date().toISOString();
  const payloadWithTime = { ...updatePayload, updated_at: now };

  const { db } = await connectToDatabase();

  if (db) {
    try {
      await db
        .collection("draft_requests")
        .updateOne({ id }, { $set: payloadWithTime });
      const updated = await db.collection<DraftRequestDoc>("draft_requests").findOne({ id });
      if (updated && updated.user_address) {
        await recordUserActivity({
          userAddress: updated.user_address,
          action: "update_draft_request",
          details: { id, status: updated.status, title: updated.title },
        });
      }
      if (updated) return updated;
    } catch (err) {
      console.error("[MongoDB updateDraftRequest Error]", err);
    }
  }

  const existing = memoryDrafts.get(id);
  if (!existing) return null;
  const newDoc = { ...existing, ...payloadWithTime };
  memoryDrafts.set(id, newDoc);
  return newDoc;
}

/**
 * Deletes a draft request from MongoDB.
 */
export async function deleteDraftRequestMongo(id: string): Promise<boolean> {
  const { db } = await connectToDatabase();

  if (db) {
    try {
      await db.collection("draft_requests").deleteOne({ id });
      return true;
    } catch (err) {
      console.error("[MongoDB deleteDraftRequest Error]", err);
    }
  }

  return memoryDrafts.delete(id);
}

/**
 * Computes dashboard statistics from MongoDB data.
 */
export async function getDashboardStatsMongo(userAddress?: string): Promise<{
  totalRequests: number;
  completedCount: number;
  pendingCount: number;
  totalSpentUsd: number;
}> {
  const requests = await listDraftRequestsMongo(userAddress);
  const totalRequests = requests.length;
  const completedCount = requests.filter(
    (r) => r.status === "completed" || r.status === "review_ready",
  ).length;
  const pendingCount = requests.filter(
    (r) => r.status !== "completed" && r.status !== "cancelled",
  ).length;
  const totalSpentUsd = requests.reduce(
    (acc, r) => acc + (r.base_payment_tx || r.status === "paid" ? r.price_usd : 0),
    0,
  );

  return {
    totalRequests,
    completedCount,
    pendingCount,
    totalSpentUsd,
  };
}
