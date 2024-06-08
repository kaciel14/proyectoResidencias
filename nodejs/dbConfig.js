const Connection = require('./mySQLConnection')

//Configuracion de la base de datos (host, usuario, contraseña, nombre de la DB y puerto)
const dbConfig = new Connection(
    'localhost',
    'kaciel',
    '12345',
    'proyectodb',
    '3306'
);

module.exports= {dbConfig}