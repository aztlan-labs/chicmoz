import { z } from "zod";

export const userIdRequestSchema = z.object({
  userId: z.string(),
});

export type UserIdRequest = z.infer<typeof userIdRequestSchema>;
