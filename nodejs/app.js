//Paquete para crear un servidor.
var express = require('express');
const date = require('date-and-time')

const PythonSpawner = require('./pythonSpawner')

//Crear bot con el token
const TelegramBot = require('node-telegram-bot-api');
const token = '6566505922:AAFLnqVIM9Y25rn3xqHtpzZdRtZWsoEBCfU';

const bot = new TelegramBot(token, { polling: true, filepath: true });


//Se inicia el servidor. Puerto 3000.
var app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log('Wuu!')
});

bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
  
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
  
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });

bot.on("message", (msg)=>{
  const pySpawner = new PythonSpawner(bot, msg.chat.id)
  const chatId = msg.chat.id;

  pySpawner.pythonInput(msg.text)
});

bot.onText(RegExp('message'), (msg) => {
    //console.log(msg);
    //console.log(msg.chat.id);
});
  