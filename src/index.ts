import express from 'express';
import ordersRouter from './routes/orders';
import { producer } from './config/kafka';


const app = express();
app.use(express.json());
app.use('/orders', ordersRouter);

async function start() {
  await producer.connect();
  app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
  });
}

start();