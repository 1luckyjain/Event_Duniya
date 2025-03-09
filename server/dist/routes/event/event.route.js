var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import Event from '../../models/Event.js';
import { GenericController } from '../../controllers/genericController.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { validateFields } from '../../middlewares/validation.js';
import { mandatoryFieldsForEvent } from '../../utils/validators/validator.js';
const router = express.Router();
const controller = new GenericController(Event);
router.post('/', isAuthenticated('user&artist'), validateFields(mandatoryFieldsForEvent), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield Event.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create event'
        });
    }
}));
router.put('/:id', isAuthenticated('user&artist'), validateFields(mandatoryFieldsForEvent), controller.update);
router.get('/:id', controller.get);
router.get('/', controller.getAll);
router.put('/', isAuthenticated('user&artist'), validateFields(mandatoryFieldsForEvent), controller.updateAll);
export default router;
//# sourceMappingURL=event.route.js.map