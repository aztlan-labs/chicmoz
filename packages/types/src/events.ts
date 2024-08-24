import { z } from "zod";

// this event signals the end of the api key creation flow
export const endCreateApiKeyEventSchema = z.object({
  kind: z.literal("END_CREATE_API_KEY"),
  apiKey: z.string(),
  projectId: z.string(),
  userId: z.string(),
});
export type EndCreateApiKeyEvent = z.infer<typeof endCreateApiKeyEventSchema>;

export const endDeleteApiKeyEventSchema = z.object({
  kind: z.literal("END_DELETE_API_KEY"),
  apiKey: z.string(),
});
export type EndDeleteApiKeyEvent = z.infer<typeof endDeleteApiKeyEventSchema>;

export const chicmozEventSchema = endCreateApiKeyEventSchema.or(endDeleteApiKeyEventSchema);
export type ChicmozEvent = z.infer<typeof chicmozEventSchema>;
