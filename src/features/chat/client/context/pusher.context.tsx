"use client";
import { useSession } from "next-auth/react";
import PusherClient from "pusher-js";
import { PropsWithChildren, createContext, useContext, useEffect } from "react";
const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  cluster: "eu",
});
const PusherContext = createContext<PusherClient | undefined>(undefined);

export const PusherProvider = ({ children }: PropsWithChildren) => {
  const session = useSession();

  useEffect(() => {
    if (session.data?.user) {
      const key = `user__${session.data.user.id}`;
      pusherClient.subscribe(key);
    }
    return () => {
      if (session.data?.user) {
        const key = `user__${session.data.user.id}`;
        pusherClient.unsubscribe(key);
      }
    };
  }, [session.data?.user]);
  return (
    <PusherContext.Provider value={pusherClient}>
      {children}
    </PusherContext.Provider>
  );
};
export const usePusher = () => {
  const ctx = useContext(PusherContext);
  if (!ctx) throw new Error("usePusher should be used in PusherProvider");

  return ctx;
};
