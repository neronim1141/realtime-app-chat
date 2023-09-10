import { z } from "zod";
import { db } from "@/src/lib/db";
import { getUser } from "@/src/lib/helpers/auth";
import { Message, messageValidator } from "@/src/lib/validations/message";
import { nanoid } from "nanoid";
import { pusherServer } from "@/src/lib/pusher";
import { toPusher } from "@/src/lib/utils";
export const POST = async (req: Request) => {
  try {
    const user = await getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { text, chatId } = z
      .object({ text: z.string(), chatId: z.string() })
      .parse(body);

    const [userId1, userId2] = chatId.split("--");
    if (user.id !== userId1 && user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }
    const friendId = user.id === userId1 ? userId2 : userId1;
    const friendList = await db.smembers(`user:${user.id}:friends`);
    const isFriend = friendList.includes(friendId);
    if (!isFriend) {
      return new Response("Unauthorized", { status: 401 });
    }

    const sender = (await db.get(`user:${user.id}`)) as User;
    const timestamp = Date.now();

    const messageData = {
      id: nanoid(),
      senderId: user.id,
      receiverId: friendId,
      text,
      timestamp,
    };
    const message = messageValidator.parse(messageData);

    pusherServer.trigger(
      toPusher(`chat:${chatId}`),
      "incoming_message",
      message
    );
    pusherServer.trigger(toPusher(`user:${friendId}:chats`), "new_message", {
      ...message,
      senderImg: sender.image,
      senderName: sender.name,
    });

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: message,
    });

    return new Response("OK");
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
};
