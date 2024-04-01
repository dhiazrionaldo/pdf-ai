"use client"
import React , {useState} from "react";
import {Loader2} from 'lucide-react'

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  const completeUrl = `https://docs.google.com/gview?url=${pdf_url}&embedded=true`
  const [isLoading, setIsLoading] = useState(true);
  
  const handleLoad = () => {
    setIsLoading(false);
  }
  
  return (
    <div className="w-full h-full">
      {isLoading && (
        // Display loading indicator while loading
        <div className="w-full h-full flex flex-col items-center text-center">
          
          <Loader2 className='h-10 w-10 text-blue-600 animate-spin' />
          {/* Add optional spinner or progress bar */}
        </div>
      )}
      <iframe
        src={completeUrl}
        className="w-full h-full"
        onLoad={handleLoad}
      />
    </div>
  );
};

export default PDFViewer;
