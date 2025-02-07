import express from 'express';
import { CreateBookingController } from '../controllers';
import { validateBooking } from '../../validations/BookingValidator';
import { AuthMiddleware } from '../../../shared/middlewares/AuthMiddleware';
import { container } from 'tsyringe';

const bookingRouter = express.Router();

bookingRouter.post('/book', validateBooking, AuthMiddleware.requireAuth, container.resolve(CreateBookingController).bookEvent);

export { bookingRouter };
