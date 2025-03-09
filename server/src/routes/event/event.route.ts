import express from 'express';
import Event from '../../models/Event.js';
import { GenericController } from '../../controllers/genericController.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { validateFields } from '../../middlewares/validation.js';
import { mandatoryFieldsForEvent } from '../../utils/validators/validator.js';

const router = express.Router();
const controller = new GenericController(Event);

router.post('/', isAuthenticated('user&artist'), validateFields(mandatoryFieldsForEvent), async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create event'
    });
  }
});

router.put('/:id', isAuthenticated('user&artist'), validateFields(mandatoryFieldsForEvent) , controller.update); 
router.get('/:id', controller.get); 
router.get('/', controller.getAll); 
router.put('/', isAuthenticated('user&artist') , validateFields(mandatoryFieldsForEvent), controller.updateAll); 


export default router;
