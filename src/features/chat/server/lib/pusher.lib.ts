import PusherServer from "pusher";
import { z } from "zod";
const env = z
  .object({
    PUSHER_APP_ID: z.string(),
    NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
    PUSHER_APP_SECRET: z.string(),
  })
  .parse(process.env);

const pusherServerSingleton = () => {
  return new PusherServer({
    appId: env.PUSHER_APP_ID,
    key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
    secret: env.PUSHER_APP_SECRET,
    cluster: "eu",
    useTLS: true,
  });
};
type PusherServerSingleton = ReturnType<typeof pusherServerSingleton>;

const globalForPusher = globalThis as unknown as {
  pusher: PusherServerSingleton | undefined;
};
if (process.env.NODE_ENV !== "production")
  globalForPusher.pusher = pusherServerSingleton();

const pusherServer = globalForPusher.pusher ?? pusherServerSingleton();

export default pusherServer;
