import { celebrate, Joi, Segments } from 'celebrate';

export const validateEvent = celebrate({
  [Segments.BODY]: Joi.object({
    totalTicket: Joi.number().integer().min(1).message('Total ticket cannot be less than 1.').required(),
    eventName: Joi.string().min(3).max(100).message('Event name must be provided and must be between 3 to 100 characters.').required(),
    description: Joi.string().max(250).message('Description cannot be above 250 characters.').required(),
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
});
