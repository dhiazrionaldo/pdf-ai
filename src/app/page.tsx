import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
// import { Inbox, Loader2 } from 'lucide-react';
// import React, { useState } from 'react';
// import toast from "react-hot-toast";

export default async function Home() {
  // const [isLoading, setIsLoading] = useState(false);
  const {userId} = await auth()
  const isAuth = !!userId
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-gray-900 to-gray-600 bg-gradient-to-r">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold text-white">Chat with document in AI!</h1>
            <UserButton afterSignOutUrl="/sign-in"/>
          </div>
          <div className="flex mt-2">
            {isAuth && firstChat && (
                <>
                  <Link href={`/chat/${firstChat.id}`}>
                      <Button>
                        Go to Chats <ArrowRight className="ml-2" />
                      </Button>
                    </Link>
                </>
              )}
          </div>
          <p className="max-w-xl mt-1 text-lg text-white">
            Join millions of users, AI will answer your questions in your documents and 
            understanding your document easily!
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
              ):(
              <Link href="/sign-in">
                <Button>Login to get Started <LogIn className="w-4 h-4 ml-2"/></Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
