import config from "../config.js"
import { PutObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
// Step 2: The s3Client function validates your request and directs it to your Space's specified endpoint using the AWS SDK.
const s3Client = new S3Client({
    endpoint: config.DO_ENDPOINT, // Find your endpoint in the control panel, under Settings. Prepend "https://".
    forcePathStyle: false,
    region: "us-east-1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
    credentials: {
        accessKeyId: config.DO_ACCESS_KEY_ID, // Access key pair. You can create access key pairs using the control panel or API.
        secretAccessKey: config.DO_SECRET_ACCESS_KEY // Secret access key defined through an environment variable.
    }
});
const upload = async (fileKey, fileContent) => {
    // Step 3: Define the parameters for the object you want to upload.
    const params = {
        Bucket: config.DO_BUCKET,
        Key: fileKey,
        Body: fileContent,
        ACL: "private",
    };
    const uploadObject = async () => {
        try {
            const data = await s3Client.send(new PutObjectCommand(params));
            console.log(
                "Successfully uploaded object: " +
                params.Bucket +
                "/" +
                params.Key
            );
            return data
        } catch (err) {
            console.log("Error", err)
        }
    };


    // Step 5: Call the uploadObject function.
    uploadObject();
}

const download = async (fileKey) => {
    var params = {
        Bucket: config.DO_BUCKET,
        Key: fileKey
    };

    const downloadObject = async () => {
        try {
            const data = await s3Client.send(new GetObjectCommand(params))
            const streamToString = (stream) =>
                new Promise((resolve, reject) => {
                    const chunks = [];
                    stream.on("data", (chunk) => chunks.push(chunk));
                    stream.on("error", reject);
                    stream.on("end", () => resolve(Buffer.concat(chunks)))//.toString("utf8")));
                });
            //let file = data.createReadStream()
            const bodyContents = await streamToString(data.Body)
            return bodyContents
        } catch (error) {
            console.log("Error", error)
        }
    }
    return downloadObject()
    /*
    .then(response => {
        return response
    })*/

}

export default {
    upload,
    download
}
