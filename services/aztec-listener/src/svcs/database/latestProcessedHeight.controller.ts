import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { eq } from "drizzle-orm";
import { L2_NETWORK_ID } from "../../environment.js";
import { latestProcessedHeight } from "./schema.js";

export async function storeHeight(height: number) {
  await db()
    .insert(latestProcessedHeight)
    .values({ networkId: L2_NETWORK_ID, height })
    .onConflictDoUpdate({
      target: latestProcessedHeight.networkId,
      set: { height },
    });
}

export async function getHeight(): Promise<number | null> {
  const result = await db()
    .select({ height: latestProcessedHeight.height })
    .from(latestProcessedHeight)
    .where(eq(latestProcessedHeight.networkId, L2_NETWORK_ID))
    .limit(1);

  return result.length > 0 ? result[0].height : null;
}
