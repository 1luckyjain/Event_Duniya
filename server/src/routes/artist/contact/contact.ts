import { Router } from "express";
import { isAuthenticated } from "../../../middlewares/isAuthenticated.js";
import { validateFields } from "../../../middlewares/validation.js";
import {  contactFormFields } from "../../../utils/validators/validator.js";
import { GenericController } from "../../../controllers/genericController.js";
import ContactForm from "../../../models/Contact.js";

const router = Router();
const contactController = new GenericController(ContactForm);


router.post("/create" , isAuthenticated('user&artist') , validateFields(contactFormFields) ,  contactController.create);
router.get("/" , isAuthenticated('artist'), contactController.getByQuery);
export default router;
