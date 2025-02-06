import { User } from '../../auth/models/entity/User';
import { EventModel } from '../models/entity/EventModel';

export class IWaitListDTO {
  event?: EventModel;

  user?: User;
}
