import { Router } from "express";
import { GenericController } from "../../../controllers/genericController.js";
import ArtistReview from "../../../models/ArtistReview.js";
import { isAuthenticated } from "../../../middlewares/isAuthenticated.js";
import { validateFields } from "../../../middlewares/validation.js";
import { reviewValidationFields } from "../../../utils/validators/validator.js";
const router = Router();
const artistController = new GenericController(ArtistReview);
router.get('/', artistController.getByQuery);
router.post('/create', isAuthenticated('user&artist'), validateFields(reviewValidationFields), artistController.create);
export default router;
//# sourceMappingURL=review.js.map