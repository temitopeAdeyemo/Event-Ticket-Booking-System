import { celebrate, Joi, Segments } from 'celebrate';

export const validateBooking = celebrate({
  [Segments.BODY]: Joi.object({
    eventId: Joi.string().required()
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }),
});
