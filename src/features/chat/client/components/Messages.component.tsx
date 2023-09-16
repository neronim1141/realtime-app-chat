"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Image from "next/image";
import { FC } from "react";
import { cn } from "../../../../lib/utils";
import { Message } from "../../dto/message.dto";
import { usePusherKey } from "../hooks/pusher.hook";

interface MessagesProps {
  user: User;
  chatPartner: User;
  chatId: string;
  initialMessages: Message[];
}
const formatTimestamp = (timestamp: number) => {
  return format(timestamp, "HH:mm");
};

const Messages: FC<MessagesProps> = ({
  chatId,
  user,
  chatPartner,
  initialMessages,
}) => {
  const queryClient = useQueryClient();
  usePusherKey("incoming_message", (message) => {
    queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
      if (old) return [message, ...old];
      return [];
    });
  });
  const { data, isLoading } = useQuery<Message[]>({
    queryKey: ["messages", chatId],
    initialData: initialMessages,
    queryFn: () =>
      fetch("/api/friends/messages/" + chatId).then((res) => res.json()),
  });

  if (isLoading) return <MessagesSkeleton />;
  if (!data || data.length === 0)
    return (
      <div className="grid place-content-center">
        <div className="px-4 py-2 rounded-md shadow-lg bg-indigo-50 text-xl font-semibold text-center">
          No chat history.
          <br />
          Send an Message!
        </div>
      </div>
    );

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-0.5 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      {data.map((message, index) => {
        const isCurrentUser = message.senderId === user.id;
        const hasNextMessageFromSameUser =
          data[index - 1]?.senderId === data[index].senderId;
        const hasPrevMessageFromSameUser =
          data[index + 1]?.senderId === data[index].senderId;
        const author = isCurrentUser ? user : chatPartner;
        return (
          <div
            key={`${message.id}-${message.timestamp}`}
            className="chat-message"
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn("flex flex-col  text-base max-w-sx mx-2", {
                  "order-1 items-end": isCurrentUser,
                  "order-2 items-start": !isCurrentUser,
                })}
              >
                <span
                  className={cn("px-4 py-4 rounded-2xl inline-block", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                    "rounded-br-none":
                      hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      hasNextMessageFromSameUser && !isCurrentUser,
                    "rounded-tl-none":
                      hasPrevMessageFromSameUser && !isCurrentUser,
                    "rounded-tr-none":
                      hasPrevMessageFromSameUser && isCurrentUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-400 justify-self-start">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </span>
              </div>
              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                {author.image ? (
                  <Image
                    fill
                    src={author.image}
                    alt={`${author.name} profile image`}
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;

const MessagesSkeleton = () => (
  <div className="flex h-full flex-1 flex-col-reverse gap-0.5 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
    {Array.from({ length: 100 }).map((_, i) => {
      return Math.random() < 0.5 ? (
        <UserMessageSkeleton key={i} />
      ) : (
        <FriendMessageSkeleton key={i} />
      );
    })}
  </div>
);
const UserMessageSkeleton = () => (
  <div className="chat-message">
    <div className="flex items-end justify-end">
      <div className="flex flex-col  text-base max-w-sx mx-2 order-1 items-end">
        <div className="px-4 py-4 rounded-2xl inline-block bg-indigo-600 text-white animate-pulse w-28 h-14"></div>
      </div>
      <div className="relative w-6 h-6 order-2"></div>
    </div>
  </div>
);
const FriendMessageSkeleton = () => (
  <div className="chat-message">
    <div className="flex items-end">
      <div className="flex flex-col  text-base max-w-sx mx-2 order-2 items-start">
        <div className="px-4 py-4 rounded-2xl inline-block bg-gray-200 text-gray-900  animate-pulse w-28 h-14"></div>
      </div>
      <div className="relative w-6 h-6 order-1"></div>
    </div>
  </div>
);
