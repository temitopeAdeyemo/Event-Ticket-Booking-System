import express from 'express';
import { eventRouter } from './events/routes';
import { authRouter } from './auth/routes';
import { bookingRouter } from './bookings/routes';
const router = express.Router();

router.use('/event', eventRouter)
router.use('/book', bookingRouter)
router.use('/auth', authRouter)

export default router;
