import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embedding";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      // environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("pdf-ai-jas");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    const queryResult = await namespace.query({
      topK: 6,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score >= 0.7
  );
  
  // let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);

  type Metadata = {
    text: string;
    pageNumber: number;
  };
  
  let context = qualifyingDocs.map((match) => {
    const metadata = match.metadata as Metadata;
    return `Page ${metadata.pageNumber}: ${metadata.text}`;
  });
  

  // 5 vectors
  return context.join("\n").substring(0, 10000);
}
