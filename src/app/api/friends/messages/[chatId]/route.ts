import { getChatMessages } from "@/src/features/chat/server/handlers/getMessages.handler";
import { getUser } from "@/src/features/chat/server/utils/getUser.util";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (
  req: NextRequest,
  { params: { chatId } }: { params: { chatId: string } }
) => {
  try {
    const user = await getUser();
    const [userId1, userId2] = chatId.split("--");
    if (!user || (user.id !== userId1 && user.id !== userId2)) {
      return new Response("Unauthorized", { status: 401 });
    }

    return NextResponse.json(await getChatMessages(chatId));
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
