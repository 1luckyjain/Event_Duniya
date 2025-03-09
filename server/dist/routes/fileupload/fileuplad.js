import { Router } from "express";
import fileUpload from "../../controllers/fileupload/fileupload.js";
const router = Router();
router.post('/upload', fileUpload);
export default router;
//# sourceMappingURL=fileuplad.js.map