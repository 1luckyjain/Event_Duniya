import { Router } from "express";
import { validateFields } from "../../../middlewares/validation.js";
import { bookFreeEventFields, contactFormFields } from "../../../utils/validators/validator.js";
import { GenericController } from "../../../controllers/genericController.js";
import EventRegistrations from "../../../models/EventRegistration.js";
import { isAuthenticated } from "../../../middlewares/isAuthenticated.js";

const router = Router();
const bookFreeEventsController = new GenericController(EventRegistrations);

router.post("/:id", isAuthenticated('user&artist'), validateFields(bookFreeEventFields) ,bookFreeEventsController.create);

export default router;
