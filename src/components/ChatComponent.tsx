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

type Props = {chatId: number};

const ChatComponent = ({chatId}: Props) => {
    const { data, isLoading } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
          const response = await axios.post<Message[]>("/api/get-messages", {
            chatId,
          });
          return response.data;
        },
      });
      
    const {input, handleInputChange, handleSubmit, messages} = useChat({
        api: "/api/chat",
        body: {
          chatId,
        },
        initialMessages: data || []
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
        className="h-screen flex flex-col justify-between"
        style={{height: '90%'}}
        id="message-container"
      >
        <div className="overflow-auto">
          <MessageList messages={messages} isLoading={isLoading}/>
        </div>   
        
        <form onSubmit={handleSubmit} className="flex sticky-bottom bottom-0 inset-x-2 px-2 py-4 w-full bg-white">
          {/* <div className="sticky"> */}
            <Input value={input} onChange={handleInputChange} placeholder="Ask any question..." className="w-full"/>
            <Button>
                <Send className="h-4 w-4" />
            </Button>
            
          {/* </div> */}
        </form>
      </div>
    );
}

export default ChatComponent