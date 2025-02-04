import cors from 'cors';

export default cors({
  origin: 'test.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
});