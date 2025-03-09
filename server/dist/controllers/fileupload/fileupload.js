var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPresignedUrl } from "../../services/uploadfiletos3/uploadfiletos3.js";
const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
export const fileUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageName, imageType } = req.body;
        if (!imageName || !imageType) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        const { url, fileKey } = yield getPresignedUrl(imageName, imageType);
        res.status(200).json({
            success: true,
            uploadUrl: url,
            fileKey,
            imageUrl: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileKey}`,
        });
    }
    catch (error) {
        console.error("Error generating signed URL:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export default fileUpload;
//# sourceMappingURL=fileupload.js.map