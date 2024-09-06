import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { downloadFromOSS } from "./oss-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embedding";
import { convertToAscii } from "./utils";

export const maxDuration = 60;

export const getPineconeClient = () => {
  return new Pinecone({
    //environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. obtain the pdf -> downlaod and read from pdf
  console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // 2. split and segment the pdf
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 4. upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("pdf-ai-jas");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  console.log("inserting vectors into pinecone");
  await upsertByBatch(namespace, vectors, 100);
  // await namespace.upsert(vectors);

  return documents[0];
}

export async function loadOSSIntoPinecone(fileKey: string) {
  // 1. obtain the pdf -> downlaod and read from pdf
  console.log("downloading oss into file system");
  const file_name = await downloadFromOSS(fileKey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // 2. split and segment the pdf
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 4. upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("pdf-ai-jas");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  console.log("inserting vectors into pinecone");
  await upsertByBatch(namespace, vectors, 100);
  // await namespace.upsert(vectors);

  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

async function upsertByBatch(namespace: any, vectors: PineconeRecord[], batchSize: number){
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await namespace.upsert(batch);
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");

  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 50000),
      },
    }),
  ]);

  // Function to identify and extract tables from document
  function extractTables(docText: string): string[] {
    // Your table extraction logic here
    // This could involve using regular expressions or other methods to identify and extract tables from the document text
    // For demonstration, let's assume we have a simple logic to identify tables based on certain keywords
    const tables: string[] = [];
    // Example logic to identify tables (replace this with your actual logic)
    const tableKeywords = ["TABLE", "Header", "Footer"];
    tableKeywords.forEach(keyword => {
      const startIndex = docText.indexOf(keyword);
      if (startIndex !== -1) {
        // Find the end of the table or any delimiter
        const endIndex = docText.indexOf("END TABLE", startIndex);
        if (endIndex !== -1) {
          tables.push(docText.substring(startIndex, endIndex));
        }
      }
    });
    return tables;
  }

  // Iterate through each document and extract tables
  for (const doc of docs) {
    const tables = extractTables(doc.pageContent);
    // If tables are found, split the document into sections (excluding tables)
    if (tables.length > 0) {
      // Remove tables from document content
      doc.pageContent = doc.pageContent.replace(/\b(TABLE|Header|Footer)\b.*?\bEND TABLE\b/, "");
      // Append extracted tables as separate documents
      tables.forEach(table => {
        docs.push(new Document({
          pageContent: table,
          metadata: {
            pageNumber: metadata.loc.pageNumber,
            text: truncateStringByBytes(table, 36000),
          },
        }));
      });
    }
  }

  return docs;
}