import { setupWorker, rest } from 'msw';

const worker = setupWorker(
  rest.post('http://localhost:8000/auth/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'fake-token' }));
  }),
  rest.post('http://localhost:8000/auth/register', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  // Add more mock handlers as needed
);

worker.start();
