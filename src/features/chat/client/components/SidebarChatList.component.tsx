"use client";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Message } from "../../dto/message.dto";

import Badge from "@/src/components/ui/Badge";
import toast from "react-hot-toast";
import { getChatCode } from "../../utils/getChatCode.util";
import { usePusherKey } from "../hooks/pusher.hook";
import { UnseenChatToast } from "./UnseenChatToast.component";

interface SidebarChatListProps {
  friends: User[];
  userId: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, userId }) => {
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

  usePusherKey("new_message", (message) => {
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
  });
  usePusherKey("new_friend", (newFriend) => {
    setActiveChats((prev) => [...prev, newFriend]);
  });

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
                <Badge>{unseenMessagesCount}</Badge>
              ) : null}
            </a>
          </div>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
