'use client'

import { Button } from "./ui/button";
import { Loader2, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from "react-hot-toast";
import React from 'react';
import {useRouter} from 'next/navigation'

type Props = {chatId: number};


export default function ClearChat({chatId}: Props){
    
    const [isLoading, setLoading] = React.useState(false);
    const router = useRouter()

    async function clearChat(){
        setLoading(true)
        try {
            await axios.delete('/api/chat', {data: {chatId}}).then(response => {
                console.log(response.data);
            }).finally(()=> {
                toast.success('success clear chat');
                setLoading(false);
            })
            
            location.reload();

        } catch (error) {
            console.log(error)
            toast.error('error clear chat')
        }
        
    }
    return(
        <>
            {isLoading ? (
                <Button disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>
            ):(
                <div className="p-2">
                    <Button className="p-0 h-10 w-10" onClick={()=> {clearChat()}} variant={'destructive'}><Trash2 /> </Button>
                </div>
                
            )}
        </>       
    );
}