const spawn = require('child_process').spawn

//pythonResponse = ""

//const resp = msg.text;

class PythonSpawner{

    constructor(){

        this.pythonResponse = ""

        this.pythonProcess = spawn("python", ["./../python/controller.py"])

        this.pythonProcess.stdout.on("data", function(data){
            pythonResponse += data.toString()
        })
        
        this.pythonProcess.stdout.on("end", function(){
             this.pythonOutput()
        })
    }

    pythonInput(msgText){
        pythonProcess.stdin.write(msgText)
        pythonProcess.stdin.end()
    }

    pythonOutput(){
        console.log(pythonResponse)
        const resp = pythonResponse
        return this.pythonResponse   
    }
}

module.exports = PythonSpawner;
