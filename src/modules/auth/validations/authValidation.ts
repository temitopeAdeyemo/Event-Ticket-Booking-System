import { celebrate, Joi, Segments } from 'celebrate';

export const validateAuth = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
      .max(100)
      .message('Invalid email format or too long'),
      
    password: Joi.string()
      .required()
      .min(6)
      .max(16)
      .message('Password must be between 6 and 24 characters'),
  }),
});