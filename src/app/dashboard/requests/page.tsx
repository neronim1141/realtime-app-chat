import FriendRequests from "@/src/components/FriendRequests";
import { db } from "@/src/lib/db";
import { getUser } from "@/src/lib/helpers/auth";
import { redirect } from "next/navigation";
import { FC } from "react";
export const dynamic = "force-dynamic";

const RequestPage: FC = async () => {
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
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequest={incomingFriendRequests}
          userId={user.id}
        />
      </div>
    </main>
  );
};

export default RequestPage;
