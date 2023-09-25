import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer'; // Мидлвар для файлов

import { writeFile, unlink } from 'fs/promises'; // Запись файла, удалением файла
import path from 'path'; // Библиотека для работы с путем файла
import crypto from 'crypto'; // Библиотека для рандомного генерирования UUID (универсальный уникальный индификатор)
import prodShema from './modeles/product.model.js'; // Подгружаем схему

const app = express();
const upload = multer();
app.use(cors());
app.use(bodyParser.json());
app.use('/download', express.static(path.join(path.resolve(), 'uploads'))); // объявляем путь к папкам для загрузки и выгрузки файлов

const port = 3000;
const host = `http://localhost:${port}`;


app.get('/files', async (request, response) => {
  response.status(200).send(JSON.stringify({ files })).end();
});

app.get('/files/:id', async (request, response) => {                                        //Поиск товара в БД по наименованию
  const { id } = request.params;
  const file = files.find((file) => file.id === id);
  if (!file) {
    return response
      .status(404)
      .send(JSON.stringify({ message: 'Товар не найден!' }))
      .end();
  }
  response.status(200).send(JSON.stringify({ file })).end();
});

app.post('/form', upload.single('file'), async (request, response) => {                     // Создание нового товара
  try {
    const {name, type_product, subtype, product_unit, price} = request.body;
    const file = request.file;
    const fileName = `${Date.now().toString(36)}-${file.originalname}`; // ?? Разобраться
    const fileSavePath = path.join(path.resolve(), 'uploads', fileName); // ?? Разобраться
    await writeFile(fileSavePath, file.buffer);

    const productDocument = {
      fileName: fileName,
      name,
      type_product,
      subtype,
      product_unit, 
      price: Number(price), 
      path: `${host}/download/${fileName}`,
    };

    const productDoc = new prodShema(productDocument);
    if (await productDoc.save()) {
      console.log('Данные записаны в БД')}
      else {('Ошибка записи данных в БД')};

    response // response сделан через синтаксис цепочки вызовов
      .status(201)
      .send(JSON.stringify(productDoc))
      .end();
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: error.message });
  }
});

app.delete('/files/:id', async (request, response) => {                                          // Удаление выбранного товара
  try {
    const { id } = request.params;
    const file = files.find((file) => file.id === id);
    console.log(file);

    if (!file) {
      return response
        .status(404)
        .send(JSON.stringify({ message: 'File not found' }))
        .end();
    }
    files = files.filter((file) => file.id !== id);
    const filePath = path.join(path.resolve(), 'uploads', file.filename);
    await unlink(filePath);
    response.status(204).end();
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: error.message });
  }
});

app.get('/getAllProducts', async(req,res) => {   
  const products = await prodShema.find();                        // Находит ВСЕ товары в БД
  res.send(JSON.stringify(products));
  res.end();
});

const start = async() => {  //Подключение к БД и запуск сервера
    await mongoose.connect('mongodb+srv://lonskoy0304:QeV6cIoPj2x5Y3K6@cluster0.lb8c1lp.mongodb.net/products?retryWrites=true&w=majority'); //Подключение к БД MongoDB, сама строка генерируется в админке MongoDB
      app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
      })
}

start();