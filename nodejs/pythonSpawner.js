const spawn = require('child_process').spawn

//pythonResponse = ""

//const resp = msg.text;

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

    pythonInput(msgText){
        console.log(msgText)
        this.pythonProcess.stdin.write(msgText)
        this.pythonProcess.stdin.end()
    }

    pythonOutput(){
        console.log(this.pythonResponse)
        const resp = this.pythonResponse
        this.bot.sendMessage(this.chatId, this.pythonResponse)  
    }
}

module.exports = PythonSpawner;
