import express from 'express';
import { GetEventController, InitialiseEventController } from '../controllers';
import { getEventParam, validateAuth, validateEventInit, validateEventStatus } from '../validations';
import { AuthMiddleware } from '../../../shared/middlewares/AuthMiddleware';
import { container } from 'tsyringe';

const eventRouter = express.Router();

eventRouter.post('/initialize', validateEventInit, AuthMiddleware.requireAuth, container.resolve(InitialiseEventController).initialize);

eventRouter.get(
  '/status/:eventId',
  validateEventStatus,
  AuthMiddleware.requireAuth,
  container.resolve(InitialiseEventController).eventStatus
);

eventRouter.get('/fetch/:id', getEventParam, AuthMiddleware.requireAuth, container.resolve(GetEventController).fetchEvent);
eventRouter.get('/all', validateAuth, AuthMiddleware.requireAuth, container.resolve(GetEventController).fetchEvents);

export { eventRouter };
