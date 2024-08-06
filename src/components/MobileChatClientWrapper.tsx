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
      <PDFViewer pdfUrl={pdfUrl} chats={chats} chatId={chatId} pageNumbers={pageNumbers} />
    </div>
  );
};

export default ChatClientWrapper;