import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import productRouter from './routes/product';
import dotenv from 'dotenv';
import { createTableIfNotExists } from './db/createtable'; // createTableIfNotExists fonksiyonunu import edin

dotenv.config(); // .env dosyasını yükle
const app = express();
console.log(process.env.PORT);
console.log(process.env.POSTGRES_PASSWORD);
// Uygulama başlamadan önce createTableIfNotExists fonksiyonunu çağır
// Call createTableIfNotExists before starting the server to create the table if it doesn't exist
createTableIfNotExists()
  .then(() => {
    console.log('Table check completed.');
  })
  .catch((error) => {
    console.error('Error checking table:', error);
  });


// JSON verilerini işlemek için body-parser kullanalım
app.use(bodyParser.json());


// Rotalar
app.use(productRouter);

// Sunucuyu başlatma
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
