import ChatComponent from '@/components/ChatComponent';
import ChatSideBar from '@/components/ChatSideBar';
import PDFViewer from '@/components/PDFViewer';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth, UserButton } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react';
import {useIsMobile} from '@/hooks/useIsMobile'; 
import { headers } from "next/headers";
import MobileChatComponent from '@/components/MobileChat';
import Image from 'next/image';
import jasLogo from '@/asset/jas - white.png';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { BookOpenText, Menu, MessageCircleMore, PlusCircle } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";

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
                <div className="flex w-full max-h-screen">
                    <MobileChatComponent chatId={parseInt(chatId)}/>
                </div>
            </div>
            ) : (
            <div className="flex h-full">
                <div className="flex w-full h-full">
                    <Sheet>
                        <SheetTrigger asChild >
                            <Button variant="outline"><Menu /></Button>
                        </SheetTrigger>
                        <SheetContent side='left' className='text-gray-200 bg-gray-900'>
                            <SheetHeader className='text-gray-200 bg-gray-900'>
                                <SheetTitle>
                                    <Image src={jasLogo} width={120} height={120} alt="jas logo white" className='pb-3'/>
                                </SheetTitle>
                            
                                <Link href="/">
                                    <Button className='w-full border-dashed border-white border'>
                                        <PlusCircle className='mr-2 w-4 h-4'/>
                                        New Chat</Button>
                                </Link>
                            </SheetHeader> 
                            <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
                        </SheetContent>
                    </Sheet>
                        {/* <ChatSideBar chats={_chats} chatId={parseInt(chatId)} /> */}
                    
                    <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
                        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
                    </div>
                    <div className="f max-h-screen flex-[6] border-l-4 border-l-slate-200 overflow-hidden">
                        <div className="absolute-top top-0 inset-x-0 p-2 bg-white h-fit max-w-screen flex items-center justify-between">
                            <h3 className="text-xl font-bold">Chat</h3>
                            <UserButton afterSignOutUrl='/'/>
                        </div>
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