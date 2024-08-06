"use client";

import React, { useEffect, useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import toast from "react-hot-toast";
import { useResizeDetector } from "react-resize-detector";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Image from 'next/image';
import jasLogo from '@/asset/jas - white.png';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Menu, PlusCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import PDFToolbar from '@/components/PDFToolBar';
import ChatSideBar from "./ChatSideBar";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

type Props = { pdfUrl: string; chats: any[]; chatId: number; pageNumbers: number[] };

const ModalPDFViewer = ({ pdfUrl, chats, chatId, pageNumbers }: Props) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { width, height, ref } = useResizeDetector();

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const handlePreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages!));
  };

  const handlePageInputChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  useEffect(() => {
    if (pageNumbers.length > 0) {
      setPageNumber(pageNumbers[0]); // Navigate to the first page number from the chat
    }
  }, [pageNumbers]);

  return (
    <div className="flex h-full">
      <div className="w-fit">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="text-gray-200 bg-gray-900">
            <SheetHeader className="text-gray-200 bg-gray-900">
              <SheetTitle>
                <Image src={jasLogo} width={120} height={120} alt="jas logo white" className="pb-3" />
              </SheetTitle>
              <Link href={`/chat/${chatId}`}>
                  <Button className="w-full border-dashed border-white border">
                    <MessageCircle className='mr-2 w-4 h-4'/> Chats
                  </Button>
              </Link>
              <Link href="/">
                <Button className="w-full border-dashed border-white border">
                  <PlusCircle className="mr-2 w-4 h-4" />
                  New Chat
                </Button>
              </Link>
            </SheetHeader>
            <ChatSideBar chats={chats} chatId={chatId} />
          </SheetContent>
        </Sheet>
        <PDFToolbar
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          currentPage={pageNumber}
          totalPages={numPages!}
          onPageInputChange={handlePageInputChange}
        />
      </div>
      <div ref={ref} className="flex-1 h-screen overflow-scroll">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex justify-center">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
          }
          onLoadError={() => {
            toast.error("Error Loading PDF, Please Re-Load the Page!");
          }}
        >
          <Page pageNumber={pageNumber} width={width ? width : 1} />
        </Document>
      </div>
    </div>
  );
};

export default ModalPDFViewer;