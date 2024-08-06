import ChatComponent from '@/components/ChatComponent';
import ChatSideBar from '@/components/ChatSideBar';
import PDFViewer from '@/components/PDFViewer';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth, UserButton } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React, {useState} from 'react';
import {useIsMobile} from '@/hooks/useIsMobile'; 
import { headers } from "next/headers";
import ModalPDFViewer from '@/components/PdfModalViewer';
import Image from 'next/image';
import jasLogo from '@/asset/jas - white.png';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MessageCircle, MessageCircleMore } from 'lucide-react';
import MobileChatSideBar from '@/components/MobileChatSideBar';
import axios from 'axios';
import ChatClientWrapper from '@/components/ChatClientWrapper';
import MobileChatClientWrapper from '@/components/MobileChatClientWrapper';

type Props = {
    params: {
        chatId: string
    }
}

const ChatPage = async ({params: {chatId}}: Props) => {
    const userAgent = headers().get("user-agent") || "";
    const isMobile = useIsMobile(userAgent);
    
    const {userId} = await auth();
    if(!userId){
        return redirect("/sign-in");
    }

    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
    if(!_chats){
        return redirect("/");
    }
    if(!_chats.find((chat) => chat.id === parseInt(chatId))){
        return redirect("/");
    }

    const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
    
    return (
        <>
        {isMobile ? ( 
            // <div className="flex w-screen h-screen overflow-hidden">
            //  <MobileChatClientWrapper pdfUrl={currentChat?.pdfUrl || ""} chats={_chats} chatId={parseInt(chatId)} />
            // </div>
            <MobileChatClientWrapper pdfUrl={currentChat?.pdfUrl || ""} chats={_chats} chatId={parseInt(chatId)} />
            ) : (
            <div className="flex flex-col h-screen overflow-hidden justify-between">
                <ChatClientWrapper pdfUrl={currentChat?.pdfUrl || ""} chats={_chats} chatId={parseInt(chatId)} />
            </div>
            )
        }
        
        </>
    );
};

export default ChatPage;