import { useEffect } from "react";
import { PusherAction } from "../../types/pusher";
import { usePusher } from "../context/pusher.context";

export const usePusherKey = <T extends keyof PusherAction>(
  key: T,
  handler: (data: PusherAction[T]) => void
) => {
  const pusher = usePusher();
  useEffect(() => {
    pusher.bind(key, handler);
    return () => {
      pusher.unbind(key, handler);
    };
  }, [pusher, handler, key]);
};
