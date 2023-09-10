import { z } from "zod";

export const friendRequestValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  reeiverId: z.string(),
});
export type FriendRequest = z.infer<typeof friendRequestValidator>;
