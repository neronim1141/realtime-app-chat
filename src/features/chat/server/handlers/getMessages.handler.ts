import { db } from "@/src/lib/db";
import { z } from "zod";
import { messageSchema } from "../../dto/message.dto";

export const getChatMessages = async (chatId: string) => {
  const results = await db.zrange(`chat:${chatId}:messages`, 0, -1);

  const dbMessages = results.reverse();

  return z.array(messageSchema).parse(dbMessages);
};
