"use client";

import React, { useState } from "react";
import PDFViewer from '@/components/PDFViewer';
import ChatComponent from '@/components/ChatComponent';

type Props = {
  pdfUrl: string;
  chats: any[];
  chatId: number;
};

const ChatClientWrapper = ({ pdfUrl, chats, chatId }: Props) => {
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);

  return (
    <div className="flex flex-row w-full h-full overflow-hidden">
      <div className="max-h-screen p-0 flex-[5]">
        <PDFViewer pdfUrl={pdfUrl} chats={chats} chatId={chatId} pageNumbers={pageNumbers} />
      </div>
      <div className="flex-[6] border-l-4 border-l-slate-200">
        <ChatComponent chatId={chatId} setPageNumbers={setPageNumbers} />
      </div>
    </div>
  );
};

export default ChatClientWrapper;