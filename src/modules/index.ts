import express from 'express';
import { eventRouter } from './events/routes';
import { authRouter } from './auth/routes';
import { bookingRouter } from './bookings/routes';
const router = express.Router();

router.use('/event', eventRouter);
router.use('/booking', bookingRouter);
router.use('/auth', authRouter);

router.get('/health-check', (req, res, next) => {
  res.send({ message: 'Alive.' });
});

export default router;
