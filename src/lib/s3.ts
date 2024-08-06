import { S3, PutObjectCommand } from '@aws-sdk/client-s3';

export const maxDuration = 60;

export async function uploadToS3(file: File){
    try {
        console.log("Initializing S3 client...");

        const s3 = new S3({
            region: 'ap-southeast-2',
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY!,
                secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!
            }
        });

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(/\s/g, '-');
        
        console.log("Preparing upload parameters...");
        
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file
        };

        console.log("Creating PutObjectCommand...");

        const command = new PutObjectCommand(params);

        console.log("Sending upload request...");

        await s3.send(command);

        console.log('Successfully uploaded to S3: ' + file_key);

        return Promise.resolve({
            file_key,
            file_name: file.name
        });
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
}

export function getS3Url(file_key: string){
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${file_key}`;
    return url;
}

// import AWS from 'aws-sdk'

// export async function uploadToS3(file: File){
//     try {
//         AWS.config.update({
//             accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
//             secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
//         });

//         const s3 = new AWS.S3({
//             params: {
//                 Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
//             },
//             region: 'ap-southeast-2'
//         })

//         const file_key = 'uploads/'+Date.now().toString()+file.name.replace(/\s/g, '-');;

//         const params = {
//             Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
//             Key: file_key,
//             Body: file
//         }

//         const upload = s3.putObject(params).on('httpUploadProgress', evt => {
//             console.log('Uploading to s3...', parseInt(((evt.loaded*100)/evt.total).toString())) + "%"
//         }).promise()

//         await upload.then(data => {
//             console.log('success uploaded to s3'+file_key);
//         })

//         return Promise.resolve({
//             file_key,
//             file_name: file.name
//         })
//     } catch (error) {
        
//     }
// }

// export function getS3Url(file_key: string){
//     const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${file_key}`;
//     return url
// }