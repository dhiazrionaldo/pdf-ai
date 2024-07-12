"use client"
import React , { useState } from "react";
import { Loader2 } from 'lucide-react';

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  const completeUrl = `https://docs.google.com/gview?url=${pdf_url}&embedded=true`;
  const [isLoading, setIsLoading] = useState(true);
  
  const handleLoad = () => {
    setIsLoading(false);
  }
  return (
    <div className="w-full h-full relative">
      {/* Always render loader and iframe, but control their visibility */}
      {/* <div className={`w-full h-full flex items-center justify-center absolute top-0 left-0`}>
        <Loader2 className='h-10 w-10 text-blue-600 animate-spin' />
      </div> */}
      <iframe
        src={completeUrl}
        className={`w-full h-full`}
        onLoad={handleLoad}
        onLoadStart={handleLoad}
        onLoadedData={handleLoad}
        loading="eager"
      />
    </div>
  );
};

export default PDFViewer;
