"use client";
import { FC, useEffect, useRef, useState } from "react";
import { Message } from "../lib/validations/message";
import { cn, toPusher } from "../lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "../lib/pusher";

interface MessagesProps {
  initialMessages: Message[];
  user: User;
  chatPartner: User;
  chatId: string;
}
const formatTimestamp = (timestamp: number) => {
  return format(timestamp, "HH:mm");
};

const Messages: FC<MessagesProps> = ({
  initialMessages,
  user,
  chatPartner,
  chatId,
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = toPusher(`chat:${chatId}`);
    pusherClient.subscribe(key);

    const incommingMessageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };
    pusherClient.bind("incoming_message", incommingMessageHandler);

    return () => {
      pusherClient.unsubscribe(key);
      pusherClient.unbind("incoming_message", incommingMessageHandler);
    };
  }, [chatId]);
  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-0.5 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === user.id;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;
        const hasPrevMessageFromSameUser =
          messages[index + 1]?.senderId === messages[index].senderId;
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
