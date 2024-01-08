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

    async getParams(){
        return new Promise((resolve, reject) =>{
            this.pool.query('SELECT parametros FROM documentos WHERE id = 1;', (err, result, fields) => {
                if(err){
                    reject(err)
                }else{
                    console.log('RESULTADO:' + result[0].parametros)
                    resolve(result[0].parametros)
                }
            })
        })
        
    }

    async getRuta(){
        return new Promise((resolve, reject) =>{
            this.pool.query('SELECT ruta FROM documentos WHERE id = 1;', (err, result, fields) => {
                if(err){
                    reject(err)
                }else{
                    console.log('RESULTADO:' + result[0].ruta)
                    resolve(result[0].ruta)
                }
            })
        }) 
    }
}



module.exports = Connection;