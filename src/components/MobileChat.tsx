"use client"
import React from "react"
import { Input } from "./ui/input";
import { useChat } from "ai/react"
import { Button } from "./ui/button";
import { BookOpenText, Menu, MessageCircleMore, Send } from "lucide-react";
import MessageList from "./MessageList";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Message } from "ai";
import Image from 'next/image';
import jasLogo from '@/asset/jas - white.png';
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { UserButton } from "@clerk/nextjs";
import ClearChat from "./ClearChat";

type Props = {chatId: number};

const MobileChatComponent = ({chatId}: Props) => {
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
        className="max-h-screen relative overflow-scroll"
        id="message-container"
      >
        {/* header */}
        {/* <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit"> */}
          {/* <h3 className="text-xl font-bold">Chat</h3> */}
          <div className="sticky top-0 inset-x-0 p-2 h-fit w-full flex justify-between z-10">
            <Sheet>
              <SheetTrigger asChild >
                  <Button variant="outline"><Menu /></Button>
              </SheetTrigger>
              <SheetContent side='left' className='text-gray-200 bg-gray-900'>
                  <SheetHeader className='text-gray-200 bg-gray-900 w-full px-5'>
                      <SheetTitle className="flex item-center justify-between">
                        <Image src={jasLogo} width={90} height={90} alt="jas logo white" className='pb-3'/>
                        <UserButton />
                      </SheetTitle>
                  </SheetHeader> 
                  <Link href={`/mobilePdf/${chatId}`}>
                      <Button className="w-full border-dashed border-white border"><BookOpenText className='mr-2 w-4 h-4'/> PDF</Button>
                  </Link>
                  <Link href={`/mobileSideBar/${chatId}`}>
                      <Button className="w-full border-dashed border-white border"> <MessageCircleMore className='mr-2 w-4 h-4'/> File List</Button>
                  </Link>
              </SheetContent>
            </Sheet>

            <ClearChat chatId={chatId} />
            
          </div>
        {/* </div> */}

        {/* message list */}
          
            <MessageList messages={messages} isLoading={isLoading} />
          
          
        
          <form onSubmit={handleSubmit} className="sticky bottom-0 inset-x-0 px-2 py-4 z-10">
              <div className="flex">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask any question..."
                  className="w-full"
                />
                <Button className="bg-blue-600 ml-2">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
          </form>        
      </div>
      // <div
      //   className="relative max-h-screen"
      //   id="message-container"
      // >
      //   <div className="relative max-h-screen">
      //       <div className="overflow-y">
      //         <MessageList messages={messages} isLoading={isLoading}/>
      //       </div>
            
      //       <form onSubmit={handleSubmit} className="flex sticky bottom-0 inset-x-0 px-2 py-4 bg-white mt-5">
      //         {/* <div className="flex"> */}
      //           <Input value={input} onChange={handleInputChange} placeholder="Ask any question..." className="w-full grow"/>
      //           <Button>
      //               <Send className="h-4 w-4" />
      //           </Button>

      //         {/* </div> */}
      //       </form>
      //   </div>
      // </div>
    );
}

export default MobileChatComponent