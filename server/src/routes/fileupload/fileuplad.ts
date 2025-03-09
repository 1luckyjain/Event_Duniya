import { Router } from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import fileUpload from "../../controllers/fileupload/fileupload.js";

const router = Router();

router.post('/upload', fileUpload);

export default router;
