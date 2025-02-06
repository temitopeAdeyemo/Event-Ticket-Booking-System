import { UserRepository } from "../modules/auth/models/repository";

export class Seedings {
    static userRepository = new UserRepository();
    static async exec(){
        // Seedings.userRepository.create({})
    }
}