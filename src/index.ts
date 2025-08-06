import express from 'express';
import ordersRouter from './routes/orders';
import { pool } from './config/db';

pool.connect()
  .then(() => console.log('🟢 Connected to PostgreSQL'))
  .catch(err => console.error('🔴 Connection error:', err));

const app = express();
app.use(express.json());
app.use('/orders', ordersRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});