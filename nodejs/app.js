//Paquete para crear un servidor.
var express = require('express');
const date = require('date-and-time')
const myConnection = require('express-myconnection')
const mysql = require('mysql')

const path = require('path')
const fs = require('fs')
const { fileURLToPath, pathToFileURL } = require('url')

const PythonSpawner = require('./pythonSpawner')
const Connection = require('./mySQLConnection')

//Crear bot con el token
const TelegramBot = require('node-telegram-bot-api');
const connection = require('express-myconnection');
const token = '6566505922:AAFLnqVIM9Y25rn3xqHtpzZdRtZWsoEBCfU';

const bot = new TelegramBot(token, {polling: {params: {limit: 1, timeout: 100}}, filepath: true });

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

/*bot.onText(/\/start/, async(msg) => {

  const chatId = msg.chat.id;

  if(modo === 0){
    modo = 1
  }

});*/

let count = 0;
let mensajes = []

let eleInicio = 0
let eleFin = 5

let defname = ''

function miPromesa(name){
  return new Promise(async(resolve, reject) =>{
      
    try{
      const p =  await dbConfig.getParams(name)
      const r =  await dbConfig.getRuta(name)
      resolve([p, r])
      
    }catch(err){
      reject(err)
    }
  })
} 
    

bot.on("message", async(msg)=>{

  if(msg.document){
    return;
  }

  const chatId = msg.chat.id;

  if(modo === 2){
    mensajes.push(msg.text)
    count = count +1

    const result = await miPromesa(defname)

    num = result[0].split(', ').length

    if(count < num){

      
      

    }else{
      
      const pySpawner = new PythonSpawner(bot, msg.chat.id)

      try{
        pySpawner.pythonInput(mensajes, result[0], result[1])
        modo = 1

      }catch(err){
        console.log('Error al esperar resultados1')
      }
      
      count = 0
      mensajes = []
    }
    }else if(modo === 5){

      await dbConfig.updateParametros(msg.text.toUpperCase())

      bot.sendMessage(chatId, 'Documento agregado correctamente, parametros: '+ msg.text.toUpperCase())
      modo = 1

    }
    else{
      if(msg.text == '/start'){
        modo = 1

        nombres = await dbConfig.getDocumentos()


        eleInicio = 0
        eleFin = 5
        lista = nombres.slice(eleInicio, eleFin)
        lista = lista.map(doc => doc.nombre)

        struc = lista.map(doc => [{text: doc, callback_data: doc}])
        
        struc.push([{text: 'Siguiente ▶', callback_data: 'sig'}])

        const replyMarkup = {
          inline_keyboard: struc
        }

        bot.sendMessage(chatId, 'Documentos:', {reply_markup: replyMarkup})

      }else{
        if(modo === 0)
          bot.sendMessage(chatId, 'Para iniciar escriba el comando /start');
        else
          (modo != 5) ? bot.sendMessage(chatId, 'Por favor selecciona un documento de la lista o use el comando /start para volver a ver la lista') : console.log('Esperando parametros');
      }
      
    }
  
}, );

bot.onText(RegExp('message'), (msg) => {
    //console.log(msg);
    //console.log(msg.chat.id);
});
  

bot.on('callback_query', async(callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  let bottom = [{text: '◀ Anterior', callback_data: 'ant'}, {text: 'Siguiente ▶', callback_data: 'sig'}]

  if(modo > 0){
    switch(data){
      case 'sig': 
        eleInicio = eleFin 
  
        if(eleFin*2 > nombres.length-1){
          eleFin = nombres.length
          bottom = [{text: '◀ Anterior', callback_data: 'ant'}]
        }else{
          eleFin = eleFin *2
        }
  
        lista = nombres.slice(eleInicio, eleFin)
        console.log(lista)
        lista = lista.map(doc => doc.nombre)
        struc = lista.map(doc => [{text: doc, callback_data: doc}])
  
        struc.push(bottom)
  
        replyMarkup = {
          inline_keyboard: struc
        }
  
        bot.editMessageReplyMarkup(replyMarkup, {chat_id: chatId, message_id: callbackQuery.message.message_id})
        break;
      case 'ant':
  
        eleInicio = eleInicio - 5
  
        if(eleInicio <= 0){
          eleInicio = 0
          eleFin = 5
          bottom = [{text: 'Siguiente ▶', callback_data: 'sig'}]
        }else{
          eleFin = eleInicio + 5
        }
  
        lista = nombres.slice(eleInicio, eleFin)
        console.log(lista)
        lista = lista.map(doc => doc.nombre)
        struc = lista.map(doc => [{text: doc, callback_data: doc}])
  
        struc.push(bottom)
  
        replyMarkup = {
          inline_keyboard: struc
        }
  
        bot.editMessageReplyMarkup(replyMarkup, {chat_id: chatId, message_id: callbackQuery.message.message_id})
        break;
  
      case 'preview':
  
        defRuta = await miPromesa(defname)
        bot.sendDocument(chatId, defRuta[1])
        
        break;
      default: params = await miPromesa(data)
        defname = data
  
        replyMarkup = {
          inline_keyboard: [
            [{text: 'Vista previa del documento', callback_data: 'preview'}]
          ]
        }
    
        bot.sendMessage(chatId, 'Debe ingresar por mensajes separados los siguientes parametros en el siguiente orden: ' + params[0], {reply_markup: JSON.stringify(replyMarkup)});
    
        modo = 2; break;
    }
  }

})

bot.on("document", async(msg) => {
  const chatId = msg.chat.id
  const docId = msg.document.file_id

  const fileInfo = await bot.getFile(docId)
  const fileLink = await bot.getFileLink(docId)

  const filePath = './../archivos/'

  //console.log(filePath2)
  const filePath2 = await bot.downloadFile(docId, filePath)

  fs.renameSync(filePath2, filePath + msg.document.file_name)

  res = await dbConfig.newDocument(msg.document.file_name, filePath + msg.document.file_name)

  bot.sendMessage(chatId, "Creando documento...\nPor favor escribe los parametros del documento.\nRecuerda separarlos por comas.")

  console.log(res)
  modo = 5
})