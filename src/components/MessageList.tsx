import { cn } from '@/lib/utils';
import { Message } from 'ai/react';
import { Loader2 } from "lucide-react";
import React from 'react';

type Props = {
    isLoading: boolean;
    messages: Message[];
}

const MessageList = ({messages, isLoading}: Props) =>{
    if (isLoading) {
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }
    if(!messages) return <></>

    const renderMessageContent = (content: string) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');

        return lines.map((line, index) => {
            if (line.match(/^\d+\./)) {
                // Numbered list
                return <p key={index} className="pl-5">{line}</p>;
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                // Bullet point
                return <p key={index} className="pl-5">• {line.substring(2)}</p>;
            } else {
                // Normal paragraph
                return <p key={index}>{line}</p>;
            }
        });
    };
    
    return (
        <div className='flex flex-col gap-5 px-4'>
            {messages.map((message) =>{
                return(
                    <div key={message.id} className={cn(
                        "flex", 
                        {"justify-end pl-10":message.role === "user", "justify-start pr-10": message.role === "assistant"}
                    )}>
                        <div className={cn(
                            "rounded-lg px-3 text-sm py-1 shadow-md fing-1 ring-gray-900/10", 
                            {"bg-blue-700 text-white": message.role === "user"}
                        )}>
                            {/* <p>{message.content}</p> */}
                            {renderMessageContent(message.content)}
                        </div>
                    </div>
                );
        })}</div>
    )
}

export default MessageList