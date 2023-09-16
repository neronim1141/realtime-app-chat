import { z } from "zod";

export const friendRequestSchema = z.object({
  id: z.string(),
  type: z.enum(["accept", "deny"]),
});
export type FriendRequest = z.infer<typeof friendRequestSchema>;
