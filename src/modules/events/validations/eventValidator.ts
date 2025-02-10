import { celebrate, Joi, Segments } from 'celebrate';

export const validateEventInit = celebrate({
  [Segments.BODY]: Joi.object({
    totalTicketSlot: Joi.number().integer().min(1).message('Total ticket cannot be less than 1.').required(),
    eventName: Joi.string().min(3).max(100).message('Event name must be provided and must be between 3 to 100 characters.').required(),
    description: Joi.string().max(250).message('Description cannot be above 250 characters.').required(),
    eventDate: Joi.date().iso().required().messages({
      'any.required': 'Event date is required',
      'date.base': 'Event date must be a valid date',
      'date.format': 'Event date must be in ISO 8601 format (YYYY-MM-DD)',
    }),
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
});

export const validateEventStatus = celebrate({
  [Segments.PARAMS]: Joi.object({
    eventId: Joi.string()
      .pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      .message('Invalid event Id.')
      .required(),
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
});

export const getEventParam = celebrate({
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
