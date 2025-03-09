import { Router } from "express";
import { GenericController } from "../../controllers/genericController";
import ArtistReview from "../../models/ArtistReview";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
const router = Router();
const artistController = new GenericController(ArtistReview);
router.get('/artists', artistController.getByQuery);
router.post('/create', isAuthenticated('user'), artistController.create);
export default router;
