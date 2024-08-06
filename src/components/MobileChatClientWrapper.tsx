"use client";

import React, { useState } from "react";
import ModalPDFViewer from "@/components/PdfModalViewer";

type Props = {
  pdfUrl: string;
  chats: any[];
  chatId: number;
};

const MobileChatClientWrapper = ({ pdfUrl, chats, chatId }: Props) => {
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);

  return (
      <ModalPDFViewer pdfUrl={pdfUrl} chats={chats} chatId={chatId} pageNumbers={pageNumbers} />
  );
};

export default MobileChatClientWrapper;