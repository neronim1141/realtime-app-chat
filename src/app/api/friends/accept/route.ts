import { z } from "zod";
import { db } from "@/src/lib/db";
import { getUser } from "@/src/lib/helpers/auth";
import { pusherServer } from "@/src/lib/pusher";
import { toPusher } from "@/src/lib/utils";

export const POST = async (req: Request) => {
  try {
    const user = await getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const isAlreadyFriend = await db.sismember(
      `user:${user.id}:friends`,
      idToAdd
    );
    if (isAlreadyFriend) {
      return new Response("You are already friends", { status: 400 });
    }
    const hasFriendRequest = await db.sismember(
      `user:${user.id}:incoming_friend_requests`,
      idToAdd
    );
    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }
    const friend = await db.get(`user:${idToAdd}`);

    await Promise.all([
      db.sadd(`user:${user.id}:friends`, idToAdd),
      db.sadd(`user:${idToAdd}:friends`, user.id),
      db.srem(`user:${user.id}:incoming_friend_requests`, idToAdd),
      pusherServer.trigger(
        toPusher(`user:${idToAdd}:friends`),
        "new-friend",
        user
      ),
      pusherServer.trigger(
        toPusher(`user:${user.id}:friends`),
        "new-friend",
        friend
      ),
    ]);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
};
