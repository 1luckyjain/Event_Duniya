import { Request, Response } from "express";
import { getPresignedUrl } from "../../services/uploadfiletos3/uploadfiletos3.js";

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;

export const fileUpload = async (req: Request, res: Response): Promise<void> => {

  try {
    const { imageName, imageType } = req.body;
   
    if (!imageName || !imageType) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    
    const { url, fileKey } = await getPresignedUrl(imageName, imageType);
 
    res.status(200).json({
      success: true,
      uploadUrl: url,
      fileKey,
      imageUrl: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileKey}`,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default fileUpload;
