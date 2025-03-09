import express from 'express';
import Event from '../../models/Event.js';
import { GenericController } from '../../controllers/genericController.js';
const router = express.Router();
const controller = new GenericController(Event);
router.post('/:id');
export default router;
