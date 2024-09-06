//@ts-ignore
import OSS from 'ali-oss';

export const maxDuration = 60;

export async function uploadToOSS(file: File) {
    try {
        console.log("Initializing OSS client...");

        const ossClient = new OSS({
            region: process.env.NEXT_PUBLIC_OSS_REGION!,
            accessKeyId: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY!,
            accessKeySecret: process.env.NEXT_PUBLIC_OSS_SECRET_ACCESS_KEY!,
            bucket: process.env.NEXT_PUBLIC_OSS_BUCKET_NAME!,
            secure: true
        });

        // Use the path as it is defined in your preset
        const file_key = 'CHAT_PDF/uploads/' + Date.now().toString() + '-' + file.name.replace(/\s/g, '-');
        
        console.log("Preparing upload parameters...");

        // Upload the file to the specified folder
        console.log("Sending upload request...");

        const result = await ossClient.put(file_key, file);
        
        console.log('Successfully uploaded to OSS: ' + result.url);

        return Promise.resolve({
            file_key,
            file_name: file.name,
            url: result.url
        });
    } catch (error) {
        console.error('Error uploading to OSS:', error);
        throw error;
    }
}

export function getOSSUrl(file_key: string){
    const url = `https://${process.env.NEXT_PUBLIC_OSS_BUCKET_NAME}.oss-ap-southeast-5.aliyuncs.com/${file_key}`;
    return url;
}