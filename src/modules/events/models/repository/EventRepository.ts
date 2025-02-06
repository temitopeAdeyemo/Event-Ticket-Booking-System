import { Event } from '../entity/Event';
import { AppRepository } from '../../../../shared/Helpers/AppRepository';

export default class EventRepository extends AppRepository<Event> {
  constructor() {
    super(Event);
  }
}
