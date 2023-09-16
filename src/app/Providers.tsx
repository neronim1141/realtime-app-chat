"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { FC, ReactNode, useState } from "react";
import { Toaster } from "react-hot-toast";
import { PusherProvider } from "../features/chat/client/context/pusher.context";
interface ProvidersProps {
  children: ReactNode;
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" reverseOrder={false} />
        <PusherProvider>{children}</PusherProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};
