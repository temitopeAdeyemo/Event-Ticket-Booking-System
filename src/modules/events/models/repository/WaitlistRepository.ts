import { WaitList } from '../entity/Waitlist';
import { AppRepository } from '../../../../shared/Helpers/AppRepository';

export default class WaitListRepository extends AppRepository<WaitList> {
  constructor() {
    super(WaitList);
  }
}
