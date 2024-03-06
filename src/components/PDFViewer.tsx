"use client"
import React , {useState} from "react";
import {Loader2} from 'lucide-react'

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  React.useEffect(() => {
    // Set a timeout to simulate loading time (replace with your actual loading logic)
    const timeout = setTimeout(() => {
      setIsLoading(false); // After simulated delay, switch to loaded state
    }, 6000); // Replace with actual loading time

    return () => clearTimeout(timeout); // Clean up timeout on unmount
  }, []);
  return (
    <div className="w-full h-full">
      {isLoading ? (
        // Display loading indicator while loading
        <div className="w-full h-full flex flex-col items-center text-center">
          
          <Loader2 className='h-10 w-10 text-blue-600 animate-spin' />
          {/* Add optional spinner or progress bar */}
        </div>
      ) : (
        // Render the iframe once loaded
        <iframe
          src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
          className="w-full h-full"
        />
      )}
    </div>
    // <iframe
    //   src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
    //   className="w-full h-full"
    // ></iframe>
  );
};

export default PDFViewer;
