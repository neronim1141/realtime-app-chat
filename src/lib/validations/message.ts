import { z } from "zod";

export const messageValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  text: z.string(),
  timestamp: z.number(),
});
export type Message = z.infer<typeof messageValidator>;
