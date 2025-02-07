import express from 'express';
import { InitialiseEventController } from '../controllers';
import { validateEvent } from '../validations/eventValidator';
import { AuthMiddleware } from '../../../shared/middlewares/AuthMiddleware';
import { container } from 'tsyringe';

const eventRouter = express.Router();

eventRouter.post('/initialize', validateEvent, AuthMiddleware.requireAuth, container.resolve(InitialiseEventController).initialize);

export { eventRouter };
