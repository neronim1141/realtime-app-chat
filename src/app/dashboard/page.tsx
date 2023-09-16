import { Message } from "@/src/features/chat/dto/message.dto";
import { getUser } from "@/src/features/chat/server/utils/getUser.util";
import { getFriendsByUserId } from "@/src/features/chat/utils/get-friends-by-user-id.util";
import { getChatCode } from "@/src/features/chat/utils/getChatCode.util";
import { db } from "@/src/lib/db";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}
const DashboardPage: FC<pageProps> = async ({}) => {
  const user = await getUser();
  if (!user) redirect("/login");
  const friends = await getFriendsByUserId(user.id);
  const friendWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const chatCode = getChatCode(user.id, friend.id);
      const [lastMessage] = await db.zrange<Message[]>(
        `chat:${chatCode}:messages`,
        -1,
        -1
      );
      return { ...friend, lastMessage, chatCode };
    })
  );
  return (
    <div className="container py-12">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendWithLastMessage.length === 0 ? (
        <p className="text-sm text-zinc-500"> Nothing to show here....</p>
      ) : (
        friendWithLastMessage.map((friend) =>
          !friend.lastMessage ? null : (
            <div
              key={friend.id}
              className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md"
            >
              <div className="absolute right-4 inset-y-0 flex items-center">
                <ChevronRight className="h-7 w-7 text-zinc-400" />
              </div>
              <Link
                href={`/dashboard/chat/${friend.chatCode}`}
                className="relative sm:flex"
              >
                <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                  <div className="relative h-6 w-6">
                    {friend.image ? (
                      <Image
                        fill
                        referrerPolicy="no-referrer"
                        src={friend.image}
                        alt={`${friend.name} profile image`}
                        className="rounded-full "
                      />
                    ) : null}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{friend.name}</h4>
                  <p className="mt-1 max-w-md">
                    <span className="text-zinc-400">
                      {friend.lastMessage.senderId === user.id ? "You: " : ""}
                      {friend.lastMessage.text}
                    </span>
                  </p>
                </div>
              </Link>
            </div>
          )
        )
      )}
    </div>
  );
};

export default DashboardPage;
