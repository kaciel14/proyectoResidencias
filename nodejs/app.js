//Paquete para crear un servidor.
var express = require('express');
const myConnection = require('express-myconnection')
const mysql = require('mysql')
const TelegramBot = require('node-telegram-bot-api');

const {dbConfig} = require('./dbConfig')
const {bot} = require('./telegramBot')
const {handleMessage, handleCallbackQuery, handleDocument} = require('./handlers')

const fs = require('fs')

//Se inicia el servidor. Puerto 3000.
var app = express();
app.use(express.json());

app.use(myConnection(mysql, dbConfig.pool, 'pool'))

//Funcion asincrona que se ejecuta al recibir un mensaje
bot.on("message", handleMessage);

//Este metodo recibe la informacion del boton que se pulsa en la lista de documentos
bot.on('callback_query', handleCallbackQuery)

//Metodo que se ejecuta al recibir un documento, enfocado en insertarlo en la base de datos y guardar el archivo en una ruta especifica, conservando su nombre original 
bot.on("document", handleDocument)

app.listen(3000, () => {
  console.log('Esperando mensajes...')
});