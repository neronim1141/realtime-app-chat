"use client";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { FC, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { friendRequestSchema } from "../../dto/friend-request.dto";
import { usePusherKey } from "../hooks/pusher.hook";
interface FriendRequestsProps {
  incomingFriendRequest: IncomingFriendRequest[];
}

const FriendRequests: FC<FriendRequestsProps> = ({ incomingFriendRequest }) => {
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequest
  );

  usePusherKey("incoming_friend_request", ({ senderId, senderEmail }) => {
    setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
  });
  const { mutate } = useMutation(
    async (data: { senderId: string; type: "accept" | "deny" }) => {
      await axios.post(
        `/api/friends/requests`,
        friendRequestSchema.parse({
          id: data.senderId,
          type: data.type,
        })
      );
      return data.senderId;
    },
    {
      onSuccess: (senderId) =>
        setFriendRequests((prev) =>
          prev.filter((request) => request.senderId !== senderId)
        ),
    }
  );

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
            onClick={() =>
              mutate({ type: "accept", senderId: request.senderId })
            }
          >
            <Check className="font-semibold text-white w-3/4 h-3/4" />
          </button>

          <button
            aria-label="deny friend"
            className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            onClick={() => mutate({ type: "deny", senderId: request.senderId })}
          >
            <X className="font-semibold text-white w-3/4 h-3/4" />
          </button>
        </div>
      ))}
    </>
  );
};
export default FriendRequests;
