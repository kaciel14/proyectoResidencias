const TelegramBot = require('node-telegram-bot-api');

//Crear bot con el token
const token = '6566505922:AAFLnqVIM9Y25rn3xqHtpzZdRtZWsoEBCfU';
const bot = new TelegramBot(token, {polling: {params: {limit: 1, timeout: 100}}, filepath: true });

module.exports = {bot}