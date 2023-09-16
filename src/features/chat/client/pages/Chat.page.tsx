import ChatInput from "@/src/features/chat/client/components/ChatInput.component";
import Messages from "@/src/features/chat/client/components/Messages.component";
import Image from "next/image";
import { FC } from "react";
import { getChatMessages } from "../../server/handlers/getMessages.handler";

interface ChatProps {
  chatId: string;
  chatPartner: User;
  user: User;
}

export const Chat: FC<ChatProps> = async ({ chatId, user, chatPartner }) => {
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
        user={user}
        chatPartner={chatPartner}
        chatId={chatId}
        initialMessages={initialMessages}
      />
      <ChatInput chatPartner={chatPartner} chatId={chatId} />
    </main>
  );
};
