"use client";
import { FC, useEffect, useState } from "react";
import { Message } from "../lib/validations/message";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getChatCode, toPusher } from "../lib/utils";
import { pusherClient } from "../lib/pusher";
import toast from "react-hot-toast";
import { UnseenChatToast } from "./UnseenChatToast";
interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

interface SidebarChatListProps {
  friends: User[];
  userId: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, userId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);

  useEffect(() => {
    if (pathname.includes("chat")) {
      setUnseenMessages((prev) =>
        prev.filter((msg) => !pathname.includes(msg.senderId))
      );
    }
  }, [pathname]);

  useEffect(() => {
    const chats = toPusher(`user:${userId}:chats`);
    const friends = toPusher(`user:${userId}:friends`);
    pusherClient.subscribe(chats);
    pusherClient.subscribe(friends);

    const newFriendHandler = (newFriend: User) => {
      setActiveChats((prev) => [...prev, newFriend]);
    };
    const chatHandler = (message: ExtendedMessage) => {
      console.log("test");

      const shouldNotify =
        pathname !== `/dashboard/chat/${getChatCode(userId, message.senderId)}`;
      if (!shouldNotify) return;
      toast.custom((t) => (
        <UnseenChatToast
          {...t}
          senderId={message.senderId}
          senderImage={message.senderImg}
          senderName={message.senderName}
          userId={userId}
          senderMessage={message.text}
        />
      ));
      setUnseenMessages((prev) => [...prev, message]);
    };
    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new-friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(chats);
      pusherClient.unsubscribe(friends);
      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new-friend", newFriendHandler);
    };
  }, [userId, pathname, router]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {activeChats.map((friend) => {
        const unseenMessagesCount = unseenMessages.filter(
          (msg) => msg.senderId === friend.id
        ).length;
        return (
          <div key={friend.id}>
            <a
              href={`/dashboard/chat/${getChatCode(userId, friend.id)}`}
              className="text-gray-700 hover:text-indigo-600 hiver:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              {friend.name}
              {unseenMessagesCount > 0 ? (
                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full grid place-content-center">
                  {unseenMessagesCount}
                </div>
              ) : null}
            </a>
          </div>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
