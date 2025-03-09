import express from "express";
import { isAuthenticated } from "../../../middlewares/isAuthenticated.js";
import { validateFields } from "../../../middlewares/validation.js";
import { savedArtistFields } from "../../../utils/validators/validator.js";
import { GenericController } from "../../../controllers/genericController.js";
import SavedArtist from "../../../models/SavedArtist.js";

const router = express.Router();
const savedArtistController = new GenericController(SavedArtist);

router.get("/", isAuthenticated('user&artist'), savedArtistController.getByQuery);
router.post("/create", isAuthenticated('user&artist'), validateFields(savedArtistFields), savedArtistController.create);
router.post("/delete", isAuthenticated('user&artist'), validateFields(savedArtistFields), savedArtistController.deleteByQuery);

export default router;