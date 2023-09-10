import { FC } from "react";
import { cn, getChatCode } from "../lib/utils";
import toast, { Toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

interface UnseenChatToastProps extends Toast {
  userId: string;
  senderId: string;
  senderImage: string;
  senderName: string;
  senderMessage: string;
}
export const UnseenChatToast: FC<UnseenChatToastProps> = ({
  id,
  visible,
  userId,
  senderId,
  senderImage,
  senderName,
  senderMessage,
}) => {
  return (
    <div
      className={cn(
        "max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black/5",
        {
          "animate-enter": visible,
          "animate-leave": !visible,
        }
      )}
    >
      <a
        href={`/dashboard/chat/${getChatCode(userId, senderId)}`}
        onClick={() => toast.dismiss(id)}
        className="flex-1 w-0 p-4"
      >
        <div className="flex items-start">
          <div className="shrink-0 pt-0.5">
            <div className="relative h-10 w-10">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={senderImage}
                alt={`${senderName} profile image`}
              />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-md text-gray-900">{senderName}</p>
            <p className="mt-1 text-sm text-gray-900">{senderMessage}</p>
          </div>
        </div>
      </a>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};
