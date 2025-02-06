import { EventModel } from '../entity/EventModel';
import { AppRepository } from '../../../../shared/Helpers/AppRepository';

export default class EventRepository extends AppRepository<EventModel> {
  constructor() {
    super(EventModel);
  }
}
