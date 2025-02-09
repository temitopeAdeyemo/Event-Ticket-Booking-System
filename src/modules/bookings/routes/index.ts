import express from 'express';
import { CancelBookingController, CreateBookingController, GetBookingController } from '../controllers';
import { getBookingParam, validateAuth, validateBookingTicket, validateCancelBooking } from '../validations';
import { AuthMiddleware } from '../../../shared/middlewares/AuthMiddleware';
import { container } from 'tsyringe';

const bookingRouter = express.Router();

bookingRouter.post('/book', validateBookingTicket, AuthMiddleware.requireAuth, container.resolve(CreateBookingController).bookEvent);
bookingRouter.post('/cancel', validateCancelBooking, AuthMiddleware.requireAuth, container.resolve(CancelBookingController).cancelBooking);

bookingRouter.get('/fetch/:id', getBookingParam, AuthMiddleware.requireAuth, container.resolve(GetBookingController).fetchBooking);
bookingRouter.get('/all', validateAuth, AuthMiddleware.requireAuth, container.resolve(GetBookingController).fetchBookings);

export { bookingRouter };
