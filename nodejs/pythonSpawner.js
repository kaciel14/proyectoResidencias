const spawn = require('child_process').spawn

const fs = require('fs')
const path = require('path')
const { fileURLToPath, pathToFileURL } = require('url')

//pythonResponse = ""

//const resp = msgs.text;

class PythonSpawner{

    constructor(bot, chatId){

        this.pythonResponse = ""
        this.bot = bot
        this.chatId = chatId

        this.pythonProcess = spawn("python", ["./../python/controller.py"])

        this.pythonProcess.stdout.on("data", (data) => {
            this.pythonResponse += data.toString()
        })
        
        this.pythonProcess.stdout.on("end", () =>  {
            this.pythonOutput()
        })
    }

    pythonInput(msgs, params, ruta){

        console.log(msgs + " " + params + " " + ruta)
        this.pythonProcess.stdin.write(msgs+'='+params+"="+ruta)
        this.pythonProcess.stdin.end()
        
    }

    pythonOutput(){
        console.log(this.pythonResponse)
        const resp = this.pythonResponse
        //this.bot.sendMessage(this.chatId, this.pythonResponse)
        let filePath = path.join(__dirname, resp.substring(0, resp.length-2))
        let hpath = pathToFileURL(filePath)
        //hpath.host = 'localhost'
        //console.log(hpath)
        this.bot.sendDocument(this.chatId, fileURLToPath(hpath))
            .then(()=>{
                console.log("Successfull")
            })
            .catch(error => {
                console.error('Error sending document:', error.message);

                // Handle the error as needed
                // For example, you can send an error message to the user
                this.bot.sendMessage(this.chatId, 'Error sending document. Please try again.');
            })
        
        const replyMarkup = {
            keyboard: [
                ['Opción 1', 'Opcion 2'],
                ['Opción 3', 'Opcion 4']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }

        /*const replyMarkup = {
            inline_keyboard: [
                [{text: 'Opción 1', callback_data: 'opcion2'}],
                [{text: 'Opción 3', callback_data: 'opcion4'}]
            ]
            //resize_keyboard: true,
            //one_time_keyboard: true
        }*/

        this.bot.sendMessage(this.chatId, 'Elige', {reply_markup: JSON.stringify(replyMarkup)})
    }
}

module.exports = PythonSpawner;
