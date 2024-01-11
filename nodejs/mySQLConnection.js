const mysql = require('mysql2')

class Connection{
    constructor(rhost, ruser, rpassword, rdatabase, rport){
        this.pool = mysql.createPool ({
            host: rhost,
            user: ruser,
            password: rpassword,
            database: rdatabase,
            port: rport,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        })

        
        /*this.pool.connect((err) => {
            if(err){
                console.log('ERROR AL CONECTAR LA BASE DE DATOS', err)
            }else{
                console.log('CONEXION A LA BASE DE DATOS EXITOSA')
            }
        })*/

    }

    async getConnection() {
        return this.pool.getConnection();
    }

    async getParams(name){
        return new Promise((resolve, reject) =>{
            this.pool.query('SELECT parametros FROM documentos WHERE nombre = ?;', [name], (err, result, fields) => {
                if(err){
                    reject(err)
                }else{
                    console.log('RESULTADO:' + result[0].parametros)
                    resolve(result[0].parametros)
                }
            })
        })
        
    }

    async getRuta(name){
        return new Promise((resolve, reject) =>{
            this.pool.query('SELECT ruta FROM documentos WHERE nombre = ?;', [name], (err, result, fields) => {
                if(err){
                    reject(err)
                }else{
                    console.log('RESULTADO:' + result[0].ruta)
                    resolve(result[0].ruta)
                }
            })
        }) 
    }

    async getDocumentos(){
        return new Promise((resolve, reject) =>{
            this.pool.query('SELECT nombre FROM documentos;', (err, result, fields) => {
                if(err){
                    reject(err)
                }else{
                    console.log('RESULTADO:' + result)
                    resolve(result)
                }
            })
        }) 
    }

    async newDocument(nombre, ruta){
        return new Promise((resolve, reject) =>{
            this.pool.query('INSERT INTO documentos (nombre, ruta) VALUES (?, ?);',[nombre, ruta] ,(err, result, fields) => {
                if(err){
                    reject(err)
                }else{
                    console.log('RESULTADO:' + result)
                    resolve(result)
                }
            })
        }) 
    }

    async updateParametros(parametros){
        return new Promise((resolve, reject) =>{
            this.pool.query('UPDATE documentos SET parametros = ? WHERE id = LAST_INSERT_ID();',[parametros] ,(err, result, fields) => {
                if(err){
                    reject(err)
                }else{
                    console.log('RESULTADO:' + result)
                    resolve(result)
                }
            })
        })
    }
}



module.exports = Connection;