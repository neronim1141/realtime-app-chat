import { friendRequestSchema } from "@/src/features/chat/dto/friend-request.dto";
import { friendRequest } from "@/src/features/chat/server/handlers/friendRequest.handler";
import { getUser } from "@/src/features/chat/server/utils/getUser.util";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const user = await getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { id, type } = friendRequestSchema.parse(body);

    return await friendRequest({ user, requestId: id, type });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
};
