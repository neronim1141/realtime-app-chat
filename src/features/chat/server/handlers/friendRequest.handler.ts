import { db } from "@/src/lib/db";
import { pusherTrigger } from "../utils/pusher.util";
interface FriendRequestData {
  user: User;
  requestId: string;
  type: "accept" | "deny";
}
export const friendRequest = async ({
  user,
  requestId,
  type,
}: FriendRequestData) => {
  if (type === "deny") {
    await db.srem(`user:${user.id}:incoming_friend_requests`, requestId);

    return new Response("OK");
  } else {
    const isAlreadyFriend = await db.sismember(
      `user:${user.id}:friends`,
      requestId
    );
    if (isAlreadyFriend) {
      return new Response("You are already friends", { status: 400 });
    }
    const hasFriendRequest = await db.sismember(
      `user:${user.id}:incoming_friend_requests`,
      requestId
    );
    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }
    const friend = (await db.get(`user:${requestId}`)) as User;

    await Promise.all([
      db.sadd(`user:${user.id}:friends`, requestId),
      db.sadd(`user:${requestId}:friends`, user.id),
      db.srem(`user:${user.id}:incoming_friend_requests`, requestId),
      pusherTrigger(requestId, "new_friend", user),
      pusherTrigger(user.id, "new_friend", friend),
    ]);

    return new Response("OK");
  }
};
