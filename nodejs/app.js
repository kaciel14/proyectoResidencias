//Paquete para crear un servidor.
var express = require('express');
const date = require('date-and-time')
const myConnection = require('express-myconnection')
const mysql = require('mysql')

const PythonSpawner = require('./pythonSpawner')
const Connection = require('./mySQLConnection')

//Crear bot con el token
const TelegramBot = require('node-telegram-bot-api');
const connection = require('express-myconnection');
const token = '6566505922:AAFLnqVIM9Y25rn3xqHtpzZdRtZWsoEBCfU';

const bot = new TelegramBot(token, { polling: true, filepath: true });

//Se inicia el servidor. Puerto 3000.
var app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log('Esperando mensajes...')
});

let modo = 0

const dbConfig = new Connection(
  'localhost',
  'kaciel',
  '12345',
  'proyectodb',
  '3306'
);

app.use(myConnection(mysql, dbConfig.pool, 'pool'))


bot.onText(/\/echo (.+)/, (msg, match) => {

  if(modo === 0){
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
  
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
  
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  }

});

bot.onText(/\/start/, async(msg) => {

  const chatId = msg.chat.id;

  if(modo === 0){
    modo = 1
  }

});

let count = 0;
let mensajes = []

function miPromesa(){
  return new Promise(async(resolve, reject) =>{
      
    try{
      const p =  await dbConfig.getParams()
      const r =  await dbConfig.getRuta()
      resolve([p, r])
      
    }catch(err){
      reject(err)
    }
  })
} 
    

bot.on("message", async(msg)=>{

  const chatId = msg.chat.id;

  if(modo === 1){
    mensajes.push(msg.text)
    count = count +1

    if(count < 1){

      
      

    }else{
      
      const pySpawner = new PythonSpawner(bot, msg.chat.id)

      try{
        const result = await miPromesa()
        pySpawner.pythonInput(msg.text, result[0], result[1])


      }catch(err){
        console.log('Error al esperar resultados1')
      }
      
      count = 0
      mensajes = []
    }
    }else{
      if(msg.text == '/start'){
        modo = 1

        nombres = await dbConfig.getDocumentos()

        lista = nombres.map(doc => doc.nombre)

        struc = lista.map(doc => [{text: doc, callback_data: doc}])
        

        const replyMarkup = {
          inline_keyboard: struc
      }

        bot.sendMessage(chatId, 'Documentos:', {reply_markup: replyMarkup})

      }else{
        bot.sendMessage(chatId, 'Para iniciar escriba el comando /start');
      }
      
    }
  
});

bot.onText(RegExp('message'), (msg) => {
    //console.log(msg);
    //console.log(msg.chat.id);
});
  