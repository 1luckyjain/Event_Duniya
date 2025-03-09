var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import 'dotenv/config';
const AWS_ACCESS_KEY_ID = process.env.S3_ACCESS || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const BUCKET_NAME = process.env.BUCKET_NAME || "";
const REGION = process.env.REGION || "";
const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});
export function getPresignedUrl(imageName, imageType) {
    return __awaiter(this, void 0, void 0, function* () {
        const extension = imageType.split('/')[1];
        const fileKey = `images/lucky/${imageName}_${Date.now()}.${extension}`;
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
            ContentType: imageType,
        });
        const url = yield getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return { url, fileKey };
    });
}
//# sourceMappingURL=uploadfiletos3.js.map