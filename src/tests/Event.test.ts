import request from 'supertest';
import { global } from './config/jest.setup';

class EventTest {
  private accessToken: string;

  constructor() {
    beforeAll(async () => {
      this.accessToken = await global.loginUser();
    });

    this.testCreateEvent();
    this.testEventStatus();
    this.getEvent();
  }

  async testCreateEvent() {
    describe('Create Event', () => {
      it('should create an event successfully', async () => {
        const res = await request(global.app).post('/api/v1/event/initialize').set('Authorization', `Bearer ${this.accessToken}`).send({
          totalTicketSlot: 20,
          eventName: 'Test Event One',
          description: 'A new event',
          eventDate: '2025-09-09',
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.success).toBe(true);
      });

      it('should fail to create an event without authorization', async () => {
        const res = await request(global.app).post('/api/v1/event/initialize').send({
          totalTicketSlot: 20,
          eventName: 'Unauthorized Event',
          description: 'An event without token',
          eventDate: '2025-09-09',
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should fail to create an event with bad token', async () => {
        const res = await request(global.app).post('/api/v1/event/initialize').set('Authorization', `Bearer i`).send({
          totalTicketSlot: 20,
          eventName: 'Unauthorized Event',
          description: 'An event without token',
          eventDate: '2025-09-09',
        });

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
      });

      it('should fail to create an event with missing fields', async () => {
        const res = await request(global.app).post('/api/v1/event/initialize').set('Authorization', `Bearer ${this.accessToken}`).send({
          eventName: 'Event Two',
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });
  }

  public async getEvent() {
    describe('Get Event/Events', () => {
      it('should successfully fetch an event', async () => {
        const res = await request(global.app)
          .get('/api/v1/event/fetch/' + global.testData.events[0].id)
          .set('Authorization', `Bearer ${this.accessToken}`)
          .send();

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id');
      });

      it('should successfully fetch all event', async () => {
        const res = await request(global.app).get('/api/v1/event/all').set('Authorization', `Bearer ${this.accessToken}`).send();

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeInstanceOf(Array);
      });

      it('should return 400 when event an event id is invalid', async () => {
        const res = await request(global.app).get('/api/v1/event/fetch/invalid-event').set('Authorization', `Bearer ${this.accessToken}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });
  }

  async testEventStatus() {
    describe('Check Event Status', () => {
      it('should retrieve the event status successfully', async () => {
        const res = await request(global.app)
          .get(`/api/v1/event/status/${global.testData.events[0].id}`)
          .set('Authorization', `Bearer ${this.accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('availableTickets');
        expect(res.body.data).toHaveProperty('waitingListCount');
        expect(res.body.success).toBe(true);
      });

      it('should return 400 for a non existing event', async () => {
        const res = await request(global.app)
          .get('/api/v1/event/status/invalid-event-id')
          .set('Authorization', `Bearer ${this.accessToken}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });
  }
}
new EventTest();
