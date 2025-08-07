import express from 'express';
import ordersRouter from './routes/orders';
import tokenRouter from './routes/token';
import userRouter from './routes/users';
import { producer } from './config/kafka';


const app = express();
app.use(express.json());
app.use('/orders', ordersRouter);
app.use('/token', tokenRouter);
app.use('/users', userRouter)

async function start() {
  await producer.connect();
  app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
  });
}

start();