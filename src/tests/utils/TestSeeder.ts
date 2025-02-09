import bcrypt from 'bcryptjs';
import { User } from '../../modules/auth/models/entity/User';
import { EventModel } from '../../modules/events/models/entity/EventModel';
import { AppDataSource } from '../../config/Database.config';
import { Booking } from '../../modules/bookings/models/entity/Booking';
import { WaitList } from '../../modules/events/models/entity/Waitlist';
import { Repository } from 'typeorm';

class TestSeeder {
  private userRepository: Repository<User>;
  private eventRepository: Repository<EventModel>;
  private bookingRepository: Repository<Booking>;
  private waitlistRepository: Repository<WaitList>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.eventRepository = AppDataSource.getRepository(EventModel);

    this.bookingRepository = AppDataSource.getRepository(Booking);
    this.waitlistRepository = AppDataSource.getRepository(WaitList);
  }
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async seedTestData() {
    const password = 'Test12@';
    const hashedPassword = await this.hashPassword(password);

    const user1 = {
      email: 'test@gmail.com',
      password: hashedPassword,
      fullName: 'Test Test',
    };

    const user2 = {
      email: 'testuser2@gmail.com',
      password: hashedPassword,
      fullName: 'Test User 2',
    };

    const users = await this.userRepository.save([this.userRepository.create(user1), this.userRepository.create(user2)]);

    const event1 = {
      eventName: 'Tech Conference 2025',
      description: 'A conference for tech enthusiasts',
      totalTicketSlot: 1,
    };

    const event2 = {
      eventName: 'Music Festival',
      description: 'A large-scale music event',
      totalTicketSlot: 40,
    };

    const events = await this.eventRepository.save([this.eventRepository.create(event1), this.eventRepository.create(event2)]);
    user1.password = password;
    user2.password = password;

    const bookings = await this.bookingRepository.save([
      this.bookingRepository.create({ event: events[0], user: users[0] }),
      this.bookingRepository.create({ event: events[1], user: users[0] }),
    ]);

    return { users: [user1, user2], events, bookings };
  }

  public async cleanDatabase() {
    await this.bookingRepository.delete({});
    await this.waitlistRepository.delete({});
    await this.eventRepository.delete({});
    await this.userRepository.delete({});
  }
}

export const testSeeder = new TestSeeder();
