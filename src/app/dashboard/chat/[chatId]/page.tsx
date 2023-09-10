import { db } from "@/src/lib/db";
import { getUser } from "@/src/lib/helpers/auth";
import { Message, messageValidator } from "@/src/lib/validations/message";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";
import Image from "next/image";
import Messages from "@/src/components/Messages";
import ChatInput from "@/src/components/ChatInput";
import { fetchRedis } from "@/src/lib/helpers/redis";
interface ChatPageProps {
  params: {
    chatId: string;
  };
}

const getChatMessages = async (chatId: string) => {
  try {
    const results = await db.zrange(`chat:${chatId}:messages`, 0, -1);

    const dbMessages = results.reverse();

    return messageValidator.array().parse(dbMessages);
  } catch (error) {
    notFound();
  }
};

const ChatPage: FC<ChatPageProps> = async ({ params: { chatId } }) => {
  const user = await getUser();
  if (!user) redirect("/login");
  const [userId1, userId2] = chatId.split("--");
  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;
  const initialMessages = await getChatMessages(chatId);

  return (
    <main className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)}">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              {chatPartner.image ? (
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  src={chatPartner.image}
                  alt={`${chatPartner.name} profile picture`}
                  className="rounded-full"
                />
              ) : null}
            </div>
          </div>
          <div className="flex flex-col leading-thight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>
            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <Messages
        initialMessages={initialMessages}
        user={user}
        chatPartner={chatPartner}
        chatId={chatId}
      />
      <ChatInput chatPartner={chatPartner} chatId={chatId} />
    </main>
  );
};

export default ChatPage;
