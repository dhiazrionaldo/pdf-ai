"use client"
import Image from 'next/image'
import jasLogo from '@/asset/jas - white.png';
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { BookOpenText, Loader2, Menu, MessageCircle, MessageCircleMore } from "lucide-react";
import React , { useState } from "react";

type Props = { pdf_url: string, chatId: string };

const ModalPDFViewer = ({ pdf_url, chatId }: Props) => {
  const completeUrl = `https://docs.google.com/gview?url=${encodeURIComponent(pdf_url)}&embedded=true`;
  const [isLoading, setIsLoading] = useState(true);
  
  const startLoad = () => {
    setIsLoading(true);
  }

  const endLoad = () =>{
    setIsLoading(false);
  }
  
  return (
    <iframe
      src={completeUrl}
      className={`w-full h-screen ${isLoading ? 'invisible' : 'visible'}`}
      loading="lazy"
      onLoad={endLoad}
      onLoadStart={startLoad}
      // onLoadedData={endLoad}
    />
    // <div className="h-screen relative overflow-scroll">
      
    //   {isLoading && (
    //     <div className={`w-full h-full flex items-center justify-center absolute top-0 left-0`}>
    //       <Loader2 className='h-10 w-10 text-blue-600 animate-spin' />
    //     </div>
    //   )}
      
    //   <iframe
    //       src={completeUrl}
    //       height="90%"
    //       className={`w-full h-full ${isLoading ? 'invisible' : 'visible'}`}
    //       loading="lazy"
    //       onLoad={endLoad}
    //       onLoadStart={startLoad}
    //       // onLoadedData={endLoad}
    //     />
    // </div>
  );
};

export default ModalPDFViewer;
