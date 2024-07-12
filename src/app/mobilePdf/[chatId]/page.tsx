import ChatComponent from '@/components/ChatComponent';
import ChatSideBar from '@/components/ChatSideBar';
import PDFViewer from '@/components/PDFViewer';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React, {useState} from 'react';
import {useIsMobile} from '@/hooks/useIsMobile'; 
import { headers } from "next/headers";
import ModalPDFViewer from '@/components/PdfModalViewer';
import Image from 'next/image';
import jasLogo from '@/asset/new-logo-cas-group-jas-airport-services.png';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

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
            <div className="flex max-h-screen">
                <div className="flex w-full max-h-screen h-screen">
                    <ModalPDFViewer chatId={chatId} pdf_url={currentChat?.pdfUrl || ""} />
                </div>
            </div>
            ) : (
            <div className="flex max-h-screen">
                <div className="flex w-full max-h-screen">
                    <div className="flex-[1] overflow-y" style={{width:'17%'}}>
                        <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
                    </div>
                    <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
                        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
                    </div>
                    <div className="flex-[3] border-l-4 border-l-slate-200 overflow-y">
                        <ChatComponent chatId={parseInt(chatId)}/>
                    </div>
                </div>
            </div>
            )
        }
        
        </>
    );
};

export default ChatPage;