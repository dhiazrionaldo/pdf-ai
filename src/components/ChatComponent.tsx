"use client"
import React from "react"
import { Input } from "./ui/input";
import { useChat } from "ai/react"
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Message } from "ai";
import ClearChat from "./ClearChat";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

type Props = {chatId: number; setPageNumbers: React.Dispatch<React.SetStateAction<number[]>>;};

const ChatComponent = ({chatId, setPageNumbers }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

      
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
    onFinish(message) {
      const metadata = message.content.match(/(?:Based on the|Based on the page|Berdasarkan halaman)\s*(\d+)/g);
      const pageNumbers = metadata ? metadata.map(m => parseInt(m?.match(/\d+/)?.[0]?? '0', 10)) : [];
      setPageNumbers(pageNumbers);
    },
  });

  
  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  
  return (
    <div
      className="relative max-h-screen justify-between overflow-scroll"
      id="message-container"
    >
      <div className="sticky top-0 inset-x-0 p-1 bg-white h-fit w-full flex items-center justify-between">
          <h3 className="text-xl font-bold">Chat</h3>
          <div className='flex flex-row gap-2'>
          <UserButton afterSignOutUrl='/'/>
          <OrganizationSwitcher hidePersonal={true} defaultOpen/>
          </div>
          <ClearChat chatId={chatId}/>
      </div>
      <MessageList messages={messages} isLoading={isLoading}/>
      
      <form onSubmit={handleSubmit} className="sticky bottom-0 inset-x-2 px-2 py-4 w-full bg-white">
        <div className="flex">
          <Input value={input} onChange={handleInputChange} placeholder="Ask any question..." className="w-full"/>
          <Button>
              <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChatComponent