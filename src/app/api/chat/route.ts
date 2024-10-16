import { Configuration, OpenAIApi } from "openai-edge";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages, messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 60;

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);
    let pageNumbers = [];
    
    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI assistant are able to translate any language, it will answer the response with the same asked language.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      AI assistant will ignore "Table of Contents" and directly straight to the content of the PDF
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will answer every question in complete result in 1 response.
      AI assistant able to read and understand all the context provided without the page limitation and without missing any information of the document.
      AI assistant to read the context page either it is from the page number metadata or the page that defined in the table of content if the document has one, once it is questioning you will answer the exact page where the question is talked about.
      AI assistant answer the question format is "based on the {metadata page number on the context} page number at section {the section where the context is}, the information is
      AI assistant answer the question in indonesian format is "Berdasarkan halaman {metadata page number on the context} pada bagian {the section number and section name where the context is}, informasinya adalah"
      AI assistant at the end of the response in indonesian will add "Ini hanya rekomendasi dari mesin, untuk informasi yang lebih akurat agar dapat di validasi terlebih dahulu".
      AI assistant at the end of the response in english will add "It's only AI recommendation, for more accurate information please make a validation first".
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
      // content: `You are a helpful AI assistant, that specialize for audit documentation.
      // you are also able to identify the exact page number of the uploaded document.
      // you will traits of AI include expert knowledge, helpfulness, cleverness, and articulateness just like human being. 
      // if you are asked not from english, you have to answer with the asked language. 
      // if the context is on other language, you have to translate it first.
      // if you are not sure what language is it, then use the indonesian language as your default language.
      // you will answer every question in complete result in 1 response.
      // you will take into account any CONTEXT BLOCK that is provided in a conversation.
      // you will have to gather all the content of the context provided without the page limitation and without missing any information of the document.
      // you are also able to read the context page either it is from the page number metadata or the page that defined in the table of content if the document has one, once it is questioning you will answer the exact page where the question is talked about.
      // to answer the question format is "based on the {metadata page number on the context} page number, the information is"
      // make sure you answer all the question in complete information that are containing in the context and also you have to put the page number (metadata or page number from table of content) in one respond.
      // here is the context.
      // AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      // START CONTEXT BLOCK
      // ${context}
      // END OF CONTEXT BLOCK
      // `
    };
    
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      stream: true,
    });

    const stream = OpenAIStream(response, {
      onStart: async () => {
        // save user message into db
        await db.insert(_messages).values({
          chatId,
          content: lastMessage.content,
          role: "user",
        });
      },
      onCompletion: async (completion) => {
        // save ai message into db
        await db.insert(_messages).values({
          chatId,
          content: completion,
          role: "system",
        });     

      },
    }); 
    
    return new StreamingTextResponse(stream);
  } catch (error) {}
}

export async function DELETE(req: Request){
  try {
    const { chatId } = await req.json();
    await db.delete(messages).where(eq(messages.chatId, chatId));
    
    return NextResponse.json(
      {messages: 'Chat deleted successfully'}, 
      {status: 200}
    )
  } catch (error) {
    return NextResponse.json(
      {error: "internal server error"},
      {status: 500}
    )
  }
}
