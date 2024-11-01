import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone, loadOSSIntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { getOSSUrl } from "@/lib/oss";
import { auth, clerkClient } from "@clerk/nextjs";
import { keepPreviousData } from "@tanstack/react-query";
import { NextResponse } from "next/server";

export const maxDuration = 60;


export async function POST(req: Request, res: Response){
    const {userId, orgId} = await auth();
    const organizationMembers = await clerkClient.organizations.getOrganizationMembershipList({ organizationId: orgId! });
    const memberUserIds = organizationMembers.map(member => member.publicUserData!.userId);

    if(!userId) {
        return NextResponse.json({error: "Un-Authorized"},{status: 401})
    }

    try {
        const body = await req.json()
        const {file_key, file_name} = body
        
        
        // await loadS3IntoPinecone(file_key); //old setup using aws-s3
        await loadOSSIntoPinecone(file_key);
        
        type ChatEntry = {
            fileKey: any;
            pdfName: any;
            pdfUrl: any;
            userId: any;
            orgId: any;
        };

        const chatEntries: ChatEntry[] = memberUserIds.map(memberId => ({
            fileKey: file_key,
            pdfName: file_name,
            // pdfUrl: getS3Url(file_key),
            pdfUrl: getOSSUrl(file_key), 
            userId: memberId,
            orgId
        }));

        const chatIds = await db.insert(chats).values(chatEntries).returning({
            insertedId: chats.id
        });

        return NextResponse.json({ chat_ids: chatIds.map(chat => chat.insertedId) }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error: "internal server error"},
            {status: 500}
        )
    }
}