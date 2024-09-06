//@ts-ignore
import OSS from 'ali-oss';
import fs from 'fs';
import { Readable } from 'stream';

export const maxDuration = 60;

export async function downloadFromOSS(file_key: string) {
    try {
        console.log("Initializing OSS client...");

        const ossClient = new OSS({
            region: process.env.NEXT_PUBLIC_OSS_REGION, 
            accessKeyId: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY!,
            accessKeySecret: process.env.NEXT_PUBLIC_OSS_SECRET_ACCESS_KEY!,
            bucket: process.env.NEXT_PUBLIC_OSS_BUCKET_NAME!, // Replace with your actual bucket name
        });

        console.log("Downloading file...");

        // Download the file
        const obj = await ossClient.get(file_key);

        const file_name = `/tmp/pdf-${Date.now()}.pdf`;

        if (obj.content instanceof Readable) {
            await streamToFile(obj.content, file_name);
        } else if (Buffer.isBuffer(obj.content)) {
            fs.writeFileSync(file_name, obj.content);
        } else {
            throw new Error("Unexpected response type");
        }

        console.log('Successfully downloaded from OSS:', file_name);

        return file_name;
    } catch (error) {
        console.error('Error downloading from OSS:', error);
        return null;
    }
}

function streamToFile(stream: Readable, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(path);
        stream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}
