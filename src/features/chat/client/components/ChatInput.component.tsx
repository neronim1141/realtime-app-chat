"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import Button from "../../../../components/ui/Button";
interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const [input, setInput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { mutate: sendMessage, isLoading } = useMutation(
    async () => {
      if (!input.trim()) return;
      await axios.post("/api/friends/messages", { text: input.trim(), chatId });
    },
    {
      onSuccess: () => {
        setInput("");
        textareaRef.current?.focus();
      },
      onError: () => {
        toast.error("Something went wrong. Please try again later.");
      },
    }
  );

  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0 ">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 border ">
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>
        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button
              isLoading={isLoading}
              onClick={() => sendMessage()}
              type="submit"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
