const {dbConfig} = require('./dbConfig');

//Funcion que detiene el flujo del sistema hasta obtener respuesta de la consulta a la base de datos (parametros y ruta del documento seleccionado)
function getDocumentData(name){
    return new Promise(async(resolve, reject) =>{
        
      try{
        const paramsResult =  await dbConfig.getParams(name)
        const routeResult =  await dbConfig.getRuta(name)
        resolve([paramsResult, routeResult])
        
      }catch(err){
        reject(err)
      }
    })
}

module.exports={getDocumentData}