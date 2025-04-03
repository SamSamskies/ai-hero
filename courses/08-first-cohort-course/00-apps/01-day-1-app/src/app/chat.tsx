"use client";

import { useState, useEffect } from "react";
import { ChatMessage } from "~/components/chat-message";
import { SignInModal } from "~/components/sign-in-modal";
import { useChat } from "@ai-sdk/react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { isNewChatCreated } from "../utils";
import type { Message } from "ai";

interface ChatProps {
  userName: string;
  isAuthenticated: boolean;
  chatId?: string;
  initialMessages: Message[];
}

export function ChatPage({
  userName,
  isAuthenticated,
  chatId,
  initialMessages,
}: ChatProps) {
  const router = useRouter();
  const [showSignInModal, setShowSignInModal] = useState(!isAuthenticated);

  const {
    data,
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    body: {
      chatId,
    },
    initialMessages,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setShowSignInModal(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (data && data.length > 0) {
      const lastData = data[data.length - 1];
      if (lastData && isNewChatCreated(lastData)) {
        router.push(`?id=${lastData.chatId}`);
      }
    }
  }, [data, router]);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div
          className="mx-auto w-full max-w-[65ch] flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
          role="log"
          aria-label="Chat messages"
        >
          {messages.map((message) => {
            return (
              <ChatMessage
                key={message.id}
                text={message.content}
                parts={message.parts}
                role={message.role}
                userName={userName}
              />
            );
          })}
        </div>

        <div className="border-t border-gray-700">
          <form onSubmit={handleSubmit} className="mx-auto max-w-[65ch] p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Say something..."
                autoFocus
                aria-label="Chat input"
                className="flex-1 rounded border border-gray-700 bg-gray-800 p-2 text-gray-200 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                disabled={!isAuthenticated}
              />
              <button
                type="submit"
                disabled={isLoading || !isAuthenticated}
                className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:hover:bg-gray-700"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </>
  );
}
