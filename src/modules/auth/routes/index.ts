import express from 'express';
import { RegisterUserController, AuthController } from '../controllers';
import { validateAuth } from '../validations';
import { container } from 'tsyringe';
import { validateRegistration } from '../validations/registerValidation';

const authRouter = express.Router();

authRouter.post('/register', validateRegistration, container.resolve(RegisterUserController).exec);
authRouter.post('/login', validateAuth, container.resolve(AuthController).exec);

export { authRouter };
