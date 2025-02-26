import { z } from "zod";

export const tabIds = ["txEffects", "contracts"] as const;

export const tabIdSchema = z.enum(tabIds);
export type TabId = z.infer<typeof tabIdSchema>;

export const tabSchema = z.object({
  id: tabIdSchema,
  label: z.string(),
});
export type Tab = z.infer<typeof tabSchema>;

export const blockDetailsTabs: Tab[] = [
  { id: "txEffects", label: "Transaction effects" },
  { id: "contracts", label: "Contracts" },
];
