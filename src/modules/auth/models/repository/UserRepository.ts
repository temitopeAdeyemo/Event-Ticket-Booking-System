import { User } from '../entity/User';
import { AppRepository } from '../../../../shared/Helpers/AppRepository';

export default class UserRepository extends AppRepository<User> {
  constructor() {
    super(User);
  }
}
