import { User } from '../../auth/models/entity/User';
import { EventModel } from '../../events/models/entity/EventModel';

export interface IBookDTO {
  event?: EventModel;
  user?: User;
}
