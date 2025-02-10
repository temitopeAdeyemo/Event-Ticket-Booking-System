import request from 'supertest';
import { global } from './config/jest.setup';

class BookingTest {
  private accessToken: string;

  constructor() {
    beforeAll(async () => {
      this.accessToken = await global.loginUser();
    });

    this.testBookTicket();
  }

  async testBookTicket() {
    describe('Book Ticket', () => {
      it('should successfully book a ticket', async () => {
        const res = await request(global.app)
          .post('/api/v1/booking/book')
          .set('Authorization', `Bearer ${this.accessToken}`)
          .send({ eventId: global.testData.events[0].id });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('bookingId');
        expect(res.body.data).toHaveProperty('waitListId');
      });

      it('should add user to waitlist when tickets are sold out', async () => {
        await request(global.app)
          .post('/api/v1/booking/book')
          .set('Authorization', `Bearer ${this.accessToken}`)
          .send({ eventId: global.testData.events[0].id });

        const res = await request(global.app)
          .post('/api/v1/booking/book')
          .set('Authorization', `Bearer ${this.accessToken}`)
          .send({ eventId: global.testData.events[0].id });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.bookingId).toBeNull();
        expect(res.body.data).toHaveProperty('waitListId');
      });

      it('should return 400 when an event does not exists', async () => {
        const res = await request(global.app)
          .post('/api/v1/booking/book')
          .set('Authorization', `Bearer ${this.accessToken}`)
          .send({ eventId: 'non-existing-id' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should return 400 when eventId is missing', async () => {
        const res = await request(global.app).post('/api/v1/booking/book').set('Authorization', `Bearer ${this.accessToken}`).send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });

    describe('Get Booked Ticket', () => {
      it('should successfully fetch a ticket', async () => {
        const res = await request(global.app)
          .get('/api/v1/booking/fetch/' + global.testData.bookings[0].id)
          .set('Authorization', `Bearer ${this.accessToken}`)
          .send();

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id');
      });

      it('should successfully fetch all tickets', async () => {
        const res = await request(global.app).get('/api/v1/booking/all').set('Authorization', `Bearer ${this.accessToken}`).send();

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeInstanceOf(Array);
      });

      it('should return 400 for non existing booking', async () => {
        const res = await request(global.app)
          .get('/api/v1/booking/fetch/invalid-booking')
          .set('Authorization', `Bearer ${this.accessToken}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });

    describe('Cancel Booked Ticket', () => {
      it('should successfully cancel a booked ticket', async () => {
        const bookRes = await request(global.app)
          .post('/api/v1/booking/book')
          .set('Authorization', `Bearer ${this.accessToken}`)
          .send({ eventId: global.testData.events[1].id });

        expect(bookRes.status).toBe(201);
        expect(bookRes.body.success).toBe(true);
        expect(bookRes.body.data).toHaveProperty('bookingId');

        const bookingId = bookRes.body.data.bookingId;

        const cancelRes = await request(global.app)
          .post('/api/v1/booking/cancel')
          .set('Authorization', `Bearer ${this.accessToken}`)
          .send({ bookingId });

        expect(cancelRes.status).toBe(200);
        expect(cancelRes.body.success).toBe(true);
      });

      it('should return 400 for when a booking id does not exists', async () => {
        const res = await request(global.app)
          .post('/api/v1/booking/cancel')
          .set('Authorization', `Bearer ${this.accessToken}`)
          .send({ bookingId: 'bad-id' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should return 400 when bookingId is missing in the payload', async () => {
        const res = await request(global.app).post('/api/v1/booking/cancel').set('Authorization', `Bearer ${this.accessToken}`).send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });
  }
}

new BookingTest();
