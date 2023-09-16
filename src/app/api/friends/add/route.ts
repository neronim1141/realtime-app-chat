import { addFriendSchema } from "@/src/features/chat/dto/add-friend.dto";
import { addFriend } from "@/src/features/chat/server/handlers/addFriend.handler";
import { getUser } from "@/src/features/chat/server/utils/getUser.util";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const user = await getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { email: emailToAdd } = addFriendSchema.parse(body);
    return await addFriend({ user, emailToAdd });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
};
