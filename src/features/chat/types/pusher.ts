import { Message } from "@/src/features/chat/dto/message.dto";

interface ExtendedMessage extends Message {
  senderImg?: string | null;
  senderName?: string | null;
}

export type PusherAction = {
  incoming_friend_request: {
    senderId: string;
    senderEmail: string | null | undefined;
  };
  new_friend: User;
  new_message: ExtendedMessage;
  incoming_message: Message;
};
