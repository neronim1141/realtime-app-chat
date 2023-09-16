import { AddFriend } from "@/src/features/chat/client/pages/AddFriend.page";
import { getUser } from "@/src/features/chat/server/utils/getUser.util";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { FC } from "react";

interface AddPageProps {}

const AddPage: FC<AddPageProps> = async ({}) => {
  const user = await getUser();
  if (!user) redirect("/login");
  const incomingSenderIds = await db.smembers(
    `user:${user.id}:incoming_friend_requests`
  );
  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await db.get(`user:${senderId}`)) as User;
      return { senderId, senderEmail: sender.email };
    })
  );
  return <AddFriend incomingFriendRequests={incomingFriendRequests} />;
};
export default AddPage;
