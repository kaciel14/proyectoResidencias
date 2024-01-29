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

        //Invocar una terminal con el comando py para el script controller.py
        this.pythonProcess = spawn("py", ["./../python/controller.py"], {encoding: 'utf-8'})

        //Cuando el script imprime informacion, este metodo recoge esos datos
        this.pythonProcess.stdout.on("data", (data) => {
            console.log("SCRIPT SAYS: " + data.toString())
            this.pythonResponse = data.toString()
        })
        
        //Al finalizar el script:
        this.pythonProcess.stdout.on("end", () =>  {
            this.pythonOutput()
        })
    }

    //Metodo para darle datos de entrada al script
    pythonInput(msgs, params, ruta){

        console.log(msgs + " " + params + " " + ruta)
        this.pythonProcess.stdin.write(msgs+'='+params+'='+ruta)
        this.pythonProcess.stdin.end()
        
    }

    //Metodo para enviar el documento generado por el script
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

    }
}

module.exports = PythonSpawner;
