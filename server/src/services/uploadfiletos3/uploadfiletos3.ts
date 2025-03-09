import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import 'dotenv/config';

const AWS_ACCESS_KEY_ID = process.env.S3_ACCESS || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const BUCKET_NAME = process.env.BUCKET_NAME || "";
const REGION =  process.env.REGION || "";

const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function getPresignedUrl(imageName: string, imageType: string) {
  const extension = imageType.split('/')[1];
  const fileKey = `images/lucky/${imageName}_${Date.now()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: imageType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { url, fileKey };
}