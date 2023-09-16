"use client";
import { FC, useState } from "react";

import Badge from "@/src/components/ui/Badge";
import { usePusherKey } from "../hooks/pusher.hook";

interface NewFriendBadgeProps {
  initialUnseenRequestCount: number;
}

export const NewFriendBadge: FC<NewFriendBadgeProps> = ({
  initialUnseenRequestCount,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState(
    initialUnseenRequestCount
  );

  usePusherKey("incoming_friend_request", () => {
    setUnseenRequestCount((prev) => prev + 1);
  });
  usePusherKey("new_friend", () => {
    setUnseenRequestCount((prev) => prev - 1);
  });
  if (unseenRequestCount <= 0) return null;

  return <Badge>{unseenRequestCount}</Badge>;
};
