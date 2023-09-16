import { db } from "@/src/lib/db";
import { nanoid } from "nanoid";
import { messageSchema } from "../../dto/message.dto";
import { pusherTrigger } from "../utils/pusher.util";

interface MessageHandlerArgs {
  chatId: string;
  userId: string;
  friendId: string;
  text: string;
}
export const sendMessage = async ({
  chatId,
  userId,
  friendId,
  text,
}: MessageHandlerArgs) => {
  const friendList = await db.smembers(`user:${userId}:friends`);
  const isFriend = friendList.includes(friendId);
  if (!isFriend) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sender = (await db.get(`user:${userId}`)) as User;
  const timestamp = Date.now();

  const messageData = {
    id: nanoid(),
    senderId: userId,
    receiverId: friendId,
    text,
    timestamp,
  };
  const message = messageSchema.parse(messageData);

  await pusherTrigger(userId, "incoming_message", message);
  await pusherTrigger(friendId, "incoming_message", message);
  await pusherTrigger(friendId, "new_message", {
    ...message,
    senderImg: sender.image,
    senderName: sender.name,
  });

  await db.zadd(`chat:${chatId}:messages`, {
    score: timestamp,
    member: message,
  });
  return new Response("OK");
};
