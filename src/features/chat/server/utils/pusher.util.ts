import { PusherAction } from "../../types/pusher";
import pusherServer from "../lib/pusher.lib";

export const pusherTrigger = async <T extends keyof PusherAction>(
  sendTo: string,
  key: T,
  data: PusherAction[T]
) => {
  await pusherServer.trigger(`user__${sendTo}`, key, data);
};
