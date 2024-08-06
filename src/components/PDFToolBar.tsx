import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";

type Props = {
  onPreviousPage: () => void;
  onNextPage: () => void;
  currentPage: number;
  totalPages: number;
  onPageInputChange: (pageNumber: number) => void;
};

const PDFToolbar = ({
  onPreviousPage,
  onNextPage,
  currentPage,
  totalPages,
  onPageInputChange,
}: Props) => {
  const [inputValue, setInputValue] = useState(currentPage.toString());

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(inputValue);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      onPageInputChange(pageNumber);
    } else {
      setInputValue(currentPage.toString());
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button variant="ghost" onClick={onPreviousPage} disabled={currentPage <= 1}>
        <ChevronUp className="h-4 w-4" />
      </Button>
      <form onSubmit={handleInputSubmit} className="flex flex-col items-center">
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          className="w-12 text-center"
          min={1}
          max={totalPages}
        />
        <span>/</span>
        <span className="w-12 text-xs text-center">{totalPages ?? "..."}</span>
      </form>
      <Button variant="ghost" onClick={onNextPage} disabled={currentPage >= totalPages}>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PDFToolbar;