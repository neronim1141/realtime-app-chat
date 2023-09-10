import { addFriendValidator } from "@/src/lib/validations/add-friend";
import { db } from "@/src/lib/db";
import { z } from "zod";
import { getUser } from "@/src/lib/helpers/auth";
import { pusherServer } from "@/src/lib/pusher";
import { toPusher } from "@/src/lib/utils";

export const POST = async (req: Request) => {
  try {
    const user = await getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body);
    const idToAdd = await db.get<string>(`user:email:${emailToAdd}`);

    if (!idToAdd)
      return new Response("This person does not exist", { status: 400 });

    if (idToAdd === user.id)
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });

    const isAlreadyAdded = await db.sismember(
      `user:${idToAdd}:incoming_friend_requests`,
      user.id
    );

    if (isAlreadyAdded)
      return new Response("Already added this user", { status: 400 });

    const isAlreadyFriend = await db.sismember(
      `user:${user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriend)
      return new Response("Already friends with this user", { status: 400 });

    pusherServer.trigger(
      toPusher(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_request",
      {
        senderId: user.id,
        senderEmail: user.email,
      }
    );

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, user.id);
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
};
