"use client"
import Image from 'next/image'
import jasLogo from '@/asset/jas - white.png';
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { BookOpenText, Menu, MessageCircle, MessageCircleMore } from "lucide-react";

type Props = { pdf_url: string, chatId: string };

const ModalPDFViewer = ({ pdf_url, chatId }: Props) => {
  const completeUrl = `https://docs.google.com/gview?url=${pdf_url}&embedded=true`;
  
  return (
    <div className="relative max-h-screen max-w-screen">
      <Sheet>
        <SheetTrigger asChild className="fixed float-left">
            <Button variant="outline"><Menu /></Button>
        </SheetTrigger>
        <SheetContent side='left' className='text-gray-200 bg-gray-900'>
            <SheetHeader className='text-gray-200 bg-gray-900 w-full px-5'>
                <SheetTitle className="flex item-center justify-between">
                  <Image src={jasLogo} width={90} height={90} alt="jas logo white" className='pb-3'/>
                  <UserButton />
                </SheetTitle>
            </SheetHeader> 
            <Link href={`/chat/${chatId}`}>
                <Button className="w-full border-dashed border-white border"><MessageCircle className='mr-2 w-4 h-4'/> Chats</Button>
            </Link>
            <Link href={`/mobileSideBar/${chatId}`}>
                <Button className="w-full border-dashed border-white border"> <MessageCircleMore className='mr-2 w-4 h-4'/> File List</Button>
            </Link>
        </SheetContent>
      </Sheet>
      <iframe
        src={completeUrl}
        className={`w-screen`}
        loading="eager"
        height={`90%`}
      />
    </div>
  );
};

export default ModalPDFViewer;
