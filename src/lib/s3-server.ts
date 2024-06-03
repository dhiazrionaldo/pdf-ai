import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import { Readable } from 'stream';

export async function downloadFromS3(file_key: string) {
    try {
        console.log("Initializing S3 client...");

        const s3 = new S3({
            region: 'ap-southeast-2',
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY!,
                secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!
            }
        });

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key
        };

        const command = new GetObjectCommand(params);

        const obj = await s3.send(command);

        const file_name = `/tmp/pdf-${Date.now()}.pdf`;

        if (obj.Body instanceof Readable) {
            await streamToFile(obj.Body, file_name);
        } else if (Buffer.isBuffer(obj.Body)) {
            fs.writeFileSync(file_name, obj.Body);
        } else {
            throw new Error("Unexpected response type");
        }

        return file_name;
    } catch (error) {
        console.error('Error downloading from S3:', error);
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

// import AWS from 'aws-sdk'
// import fs from 'fs'

// export async function downloadFromS3(file_key: string){
//     try {
//         console.log("Initializing S3 client...");
//         AWS.config.update({
//             accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
//             secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
//         });

//         const s3 = new AWS.S3({
//             params: {
//                 Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
//             },
//             region: 'ap-southeast-2'
//         });

//         const params = {
//             Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
//             Key: file_key
//         };

//         const obj = await s3.getObject(params).promise();
//         const file_name = `/tmp/pdf-${Date.now()}.pdf`
//         fs.writeFileSync(file_name, obj.Body as Buffer);

//         return file_name
//     } catch (error) {
//         console.log(error)

//         return null
//     }
// }