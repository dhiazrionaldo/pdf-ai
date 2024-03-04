'use client'
import { uploadToS3 } from '@/lib/s3';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import axios from 'axios';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation'

const FileUpload = () => {
    const router = useRouter()
    const [uploading, setUploading] = React.useState(false);
    const { mutate, isPending } = useMutation({
        mutationFn: async ({file_key, file_name}: {file_key: string; file_name: string;}) => {
            const response = await axios.post('/api/create-chat', {file_key, file_name});
           
            return response.data;
        }
    })

    const {getRootProps, getInputProps} = useDropzone({
        accept: {'application/pdf': [".pdf"]},
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            // File limit bigger than 10mb
            if(file.size > 10 * 1024 * 1024){
                toast.error("File too large\nPlease upload file lower than 10mb!");
                return
            }

            try {
                setUploading(true);
                const data = await uploadToS3(file);   

                if(!data?.file_key || !data.file_name){
                    toast.error("something wrong within the file_key or file_name");
                    
                    return;
                }

                mutate(data, {
                    onSuccess: ({ chat_id }) => {
                        toast.success("chat has been created");
                        router.push(`/chat/${chat_id}`)
                    },
                    onError: (error) => {
                        toast.error("Error creating chat");
                        console.log(error);
                    }
                });
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false);
            }
        }
    });
    return (
        <div className='p-2 bg-white rounded-xl'>
            <div {...getRootProps({
                className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col'
            })}>
                <input {...getInputProps()}/>
                {uploading || isPending ? (
                    <>
                    <Loader2 className='h-10 w-10 text-blue-600 animate-spin'/>
                    <p className='mt-2 text-sm text-slate-400'>
                        Eating your document...
                    </p>
                    </>
                ):(
                    <>               
                    <Inbox className='w-10 h-10 text-blue-600'/>
                        <p className='mt-2 text-sm text-slate-400'>Drop PDF Here</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default FileUpload