import { celebrate, Joi, Segments } from 'celebrate';

export const validateBookingTicket = celebrate({
  [Segments.BODY]: Joi.object({
    eventId: Joi.string()
      .pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      .message('Invalid event Id.')
      .required(),
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
});

export const validateCancelBooking = celebrate({
  [Segments.BODY]: Joi.object({
    bookingId: Joi.string()
      .pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      .message('Invalid booking Id.')
      .required(),
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
});

export const getBookingParam = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      .message('Invalid event Id.')
      .required(),
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
});

export const validateAuth = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
});
