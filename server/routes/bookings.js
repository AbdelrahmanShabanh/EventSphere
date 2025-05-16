import express from 'express';
import { 
  createBooking, 
  getUserBookings, 
  cancelBooking 
} from '../controllers/bookingController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createBooking);
router.get('/user', auth, getUserBookings);
router.delete('/:id', auth, cancelBooking);

export default router;
