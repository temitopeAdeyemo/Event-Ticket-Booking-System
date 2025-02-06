import { AuthModel } from '../entity/User';
import { AppRepository } from '../../../../shared/Helpers/AppRepository';

export default class UserRepository extends AppRepository<AuthModel> {
  constructor() {
    super(AuthModel);
  }
}
