import { z } from "zod";
import { messageValidator } from "./message";

export const chatValidator = z.object({
  id: z.string(),
  messages: messageValidator.array(),
});
export type Chat = z.infer<typeof chatValidator>;
