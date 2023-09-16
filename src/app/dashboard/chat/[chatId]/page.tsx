import { Chat } from "@/src/features/chat/client/pages/Chat.page";
import { getUser } from "@/src/features/chat/server/utils/getUser.util";
import { db } from "@/src/lib/db";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

const ChatPage: FC<ChatPageProps> = async ({ params: { chatId } }) => {
  const user = await getUser();
  if (!user) redirect("/login");
  const [userId1, userId2] = chatId.split("--");
  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

  return <Chat chatId={chatId} user={user} chatPartner={chatPartner} />;
};

export default ChatPage;
