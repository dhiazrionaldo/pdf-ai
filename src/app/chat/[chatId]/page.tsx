import ChatComponent from '@/components/ChatComponent';
import PDFViewer from '@/components/PDFViewer';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import {useIsMobile} from '@/hooks/useIsMobile'; 
import { headers } from "next/headers";
import MobileChatComponent from '@/components/MobileChat';
import ChatClientWrapper from '@/components/ChatClientWrapper';

type Props = {
    params: {
        chatId: string
    }
}

const ChatPage = async ({params: {chatId}}: Props) => {
    const userAgent = headers().get("user-agent") || "";
    const isMobile = useIsMobile(userAgent);

    const {userId, orgId} = await auth();
    const Chats = {
        userIds: userId!,
        orgId: orgId!
    }
    if(!userId){
        return redirect("/sign-in");
    }

    const _chats = await db.select().from(chats).where(and(eq(chats.userId, Chats.userIds), eq(chats.orgId, Chats.orgId))); //.where(eq(chats.userId, userId)); //shows chat list here
    
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
                <div className="flex flex-col h-screen w-screen justify-between">
                    <MobileChatComponent _chats={_chats} chatId={parseInt(chatId)}/>
                </div>
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