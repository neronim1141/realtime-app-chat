import { sendMessage } from "@/src/features/chat/server/handlers/sendMessage.handler";
import { getUser } from "@/src/features/chat/server/utils/getUser.util";
import { z } from "zod";
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
    return await sendMessage({
      chatId,
      userId: user.id,
      friendId,
      text,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
};
