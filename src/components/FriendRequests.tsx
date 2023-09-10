"use client";
import { Check, UserPlus, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "../lib/pusher";
import { toPusher } from "../lib/utils";

interface FriendRequestsProps {
  incomingFriendRequest: IncomingFriendRequest[];
  userId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequest,
  userId,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequest
  );

  useEffect(() => {
    const key = toPusher(`user:${userId}:incoming_friend_requests`);
    pusherClient.subscribe(key);

    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
    };
    pusherClient.bind("incoming_friend_request", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(key);
      pusherClient.unbind("incoming_friend_request", friendRequestHandler);
    };
  }, [userId]);

  const handleButton = async (type: "accept" | "deny", senderId: string) => {
    await axios.post(`/api/friends/${type}`, {
      id: senderId,
    });
    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );
    router.refresh();
  };

  if (friendRequests.length === 0)
    return <p className="text-sm text-zinc-500">Nothing to show here...</p>;

  return (
    <>
      {friendRequests.map((request) => (
        <div key={request.senderId} className="flex gap-4 items-center">
          <UserPlus className="text-black" />
          <p className="font-medium text-lg">{request.senderEmail}</p>
          <button
            aria-label="accept friend"
            className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
            onClick={() => handleButton("accept", request.senderId)}
          >
            <Check className="font-semibold text-white w-3/4 h-3/4" />
          </button>

          <button
            aria-label="deny friend"
            className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            onClick={() => handleButton("deny", request.senderId)}
          >
            <X className="font-semibold text-white w-3/4 h-3/4" />
          </button>
        </div>
      ))}
    </>
  );
};
export default FriendRequests;
