import express from 'express';
import bodyParser from 'body-parser';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import customerRouter from './routes/customer';
import dotenv from 'dotenv';
import {AppDataSource} from './db/dataSource';
dotenv.config(); // .env dosyasını yükle
const app = express();

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))


// JSON verilerini işlemek için body-parser kullanalım
app.use(bodyParser.json());


// Rotalar
app.use(productRouter);
app.use(customerRouter);
app.use(orderRouter);


// Sunucuyu başlatma
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
