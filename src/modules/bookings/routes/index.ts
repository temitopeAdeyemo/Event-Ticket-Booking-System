import express from 'express';
import { CreateBookingController } from '../controllers';
import { validateBooking } from '../../validations/BookingValidator';
import { AuthMiddleware } from '../../../shared/middlewares/AuthMiddleware';

const bookingRouter = express.Router();

bookingRouter.post('/book', validateBooking, AuthMiddleware.requireAuth, CreateBookingController.bookEvent);

export { bookingRouter };
