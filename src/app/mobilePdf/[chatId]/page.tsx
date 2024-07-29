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
            <div className="flex flex-col h-screen w-screen">
                <div className="max-h-screen relative overflow-scroll">
                    <div className="fixed top-0 inset-x-0 p-2 h-fit w-full flex justify-between z-10">
                        <Sheet>
                        <SheetTrigger asChild >
                            <Button variant="outline"><Menu /></Button>
                        </SheetTrigger>
                        <SheetContent side='left' className='text-gray-200 bg-gray-900'>
                            <SheetHeader className='text-gray-200 bg-gray-900 w-full px-5'>
                                <SheetTitle className="flex item-center justify-between">
                                    <Image src={jasLogo} width={90} height={90} alt="jas logo white" className='pb-3'/>
                                </SheetTitle>
                            </SheetHeader> 
                            <Link href={`/chat/${chatId}`}>
                                <Button className="w-full border-dashed border-white border"><MessageCircle className='mr-2 w-4 h-4'/> Chats</Button>
                            </Link>
                            <MobileChatSideBar chats={_chats} chatId={parseInt(chatId)}/>
                        </SheetContent>
                        </Sheet>
                        <UserButton afterSignOutUrl='/'/>
                    </div>
                    <ModalPDFViewer chatId={chatId} pdf_url={currentChat?.pdfUrl || ""} />      
                    {/* <div className="sticky top-0 inset-x-0 p-2 h-fit w-full flex justify-between z-10">
                        <Sheet>
                            <SheetTrigger asChild className='fixed float-left m-1'>
                                <Button variant="outline"><Menu /></Button>
                            </SheetTrigger>
                            <SheetContent side='left' className='text-gray-200 bg-gray-900'>
                                <SheetHeader className='text-gray-200 bg-gray-900 w-full px-5'>
                                    <SheetTitle className="flex item-center justify-between">
                                    <Image src={jasLogo} width={90} height={90} alt="jas logo white" className='pb-3'/>
                                    </SheetTitle>
                                </SheetHeader> 
                                <Link href={`/chat/${chatId}`}>
                                    <Button className="w-full border-dashed border-white border"><MessageCircle className='mr-2 w-4 h-4'/> Chats</Button>
                                </Link>
                                <MobileChatSideBar chats={_chats} chatId={parseInt(chatId)}/>
                            </SheetContent>
                        </Sheet>
                        <UserButton afterSignOutUrl='/'/>
                    </div> */}
                
                    {/* <ModalPDFViewer chatId={chatId} pdf_url={currentChat?.pdfUrl || ""} />                 */}
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