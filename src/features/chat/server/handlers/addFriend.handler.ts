import { db } from "@/src/lib/db";
import { pusherTrigger } from "../utils/pusher.util";

interface AddFriendData {
  user: User;
  emailToAdd: string;
}
export const addFriend = async ({ user, emailToAdd }: AddFriendData) => {
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

  await pusherTrigger(idToAdd, "incoming_friend_request", {
    senderId: user.id,
    senderEmail: user.email,
  });

  await db.sadd(`user:${idToAdd}:incoming_friend_requests`, user.id);
  return new Response("OK");
};
