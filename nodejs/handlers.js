const {dbConfig} = require('./dbConfig')
const {bot} = require('./telegramBot')
const PythonSpawner = require('./pythonSpawner')
const {getDocumentData} = require('./getDocuments');
const fs = require('fs');

//Variable para controlar el flujo de la interaccion con el bot
let step = 0

//Variables para almacenar varios mensajes antes de procesarlos
let msgStack = 0;
let mensajes = []

//Indices para moverse en la lista de documentos
let listaInicio = 0
let listaFin = 5

//Variable que toma nombre cuando el usuario elije un documento de la lista (RECORDATORIO: CAMBIAR A ID EN LUGAR DE NOMBRE)
let documentName = ''

async function handleMessage(msg){
    if(msg.document){
        return;
      }
    
      const chatId = msg.chat.id;
    
      //Step 2: Espera a recibir n mensajes para n parametros y pasarle los mensajes al script de python para insertarlos en el documento
      switch(step){
        case 2:{
            mensajes.push(msg.text)
            msgStack = msgStack +1
    
            const documentData = await getDocumentData(documentName)
    
            paramsNum = documentData[0].split(', ').length
    
            if(msgStack < paramsNum){
          
    
            }else{
          
                const pySpawner = new PythonSpawner(bot, msg.chat.id)
    
                try{
                    //Pasar los mensajes al script de python para que cree un nuevo documento con ellos
                    pySpawner.pythonInput(mensajes, documentData[0], documentData[1])
                    step = 1
    
                }catch(err){
                    console.log('Error al esperar resultados')
                }
          
                msgStack = 0
                mensajes = []
            }break
        }
        //STEP 5: Se está en el proceso de insercion de un nuevo documento a la base de datos
        case 5:{
            //Se agregan los parametros del documento a la base de datos
            await dbConfig.updateParametros(msg.text.toUpperCase())
    
            bot.sendMessage(chatId, 'Documento agregado correctamente, parametros: '+ msg.text.toUpperCase())
            step = 1
            break
        }
        default:{
            if(msg.text == '/start'){
                step = 1
        
                //Se obtiene la lista de documento de la base de datos
                nombres = await dbConfig.getDocumentos()
        
        
                listaInicio = 0
                listaFin = 5
                lista = nombres.slice(listaInicio, listaFin)
                lista = lista.map(doc => doc.nombre)
        
                //Se crea un botón por cada elemento de la lista
                struc = lista.map(doc => [{text: doc, callback_data: doc}])
                //Se agrega el boton para avanzar en la lista ya que al inicio solo se nos muestran los primeros 5
                struc.push([{text: 'Siguiente ▶', callback_data: 'sig'}])
        
                const replyMarkup = {
                  inline_keyboard: struc
                }
        
                bot.sendMessage(chatId, 'Documentos:', {reply_markup: replyMarkup})
        
              }else{
                if(step === 0)
                  bot.sendMessage(chatId, 'Para iniciar escriba el comando /start');
                else
                  (step != 5) ? bot.sendMessage(chatId, 'Por favor selecciona un documento de la lista o use el comando /start para volver a ver la lista') : console.log('Esperando parametros');
              }
        }

      }

}

async function handleCallbackQuery(callbackQuery){
    const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  let bottom = [{text: '◀ Anterior', callback_data: 'ant'}, {text: 'Siguiente ▶', callback_data: 'sig'}]

  if(step > 0){
    switch(data){
      //En caso de avanzar en la lista:
      case 'sig': 
        listaInicio = listaFin 
  
        if(listaFin*2 > nombres.length-1){
          listaFin = nombres.length
          bottom = [{text: '◀ Anterior', callback_data: 'ant'}]
        }else{
          listaFin = listaFin *2
        }
  
        lista = nombres.slice(listaInicio, listaFin)
        console.log(lista)
        lista = lista.map(doc => doc.nombre)
        struc = lista.map(doc => [{text: doc, callback_data: doc}])
  
        struc.push(bottom)
  
        replyMarkup = {
          inline_keyboard: struc
        }
  
        bot.editMessageReplyMarkup(replyMarkup, {chat_id: chatId, message_id: callbackQuery.message.message_id})
        break;
      //En caso de retroceder en la lista:
      case 'ant':
  
        listaInicio = listaInicio - 5
  
        if(listaInicio <= 0){
          listaInicio = 0
          listaFin = 5
          bottom = [{text: 'Siguiente ▶', callback_data: 'sig'}]
        }else{
          listaFin = listaInicio + 5
        }
  
        lista = nombres.slice(listaInicio, listaFin)
        console.log(lista)
        lista = lista.map(doc => doc.nombre)
        struc = lista.map(doc => [{text: doc, callback_data: doc}])
  
        struc.push(bottom)
  
        replyMarkup = {
          inline_keyboard: struc
        }
  
        bot.editMessageReplyMarkup(replyMarkup, {chat_id: chatId, message_id: callbackQuery.message.message_id})
        break;
      //En caso de querer ver una vista previa del documento que se quiere editar:
      case 'preview':
  
        defRuta = await getDocumentData(documentName)
        bot.sendDocument(chatId, defRuta[1])
        
        break;
      //Por defecto se considera que el usuario seleccionó un documento de la lista:
      default: params = await getDocumentData(data)
        documentName = data
  
        replyMarkup = {
          inline_keyboard: [
            [{text: 'Vista previa del documento', callback_data: 'preview'}]
          ]
        }
        //Mensaje para indicar que se pasó al STEP 2, y ahora se deben escribir n mensajes que corresponden a los n parametros del documento
        bot.sendMessage(chatId, 'Debe ingresar por mensajes separados los siguientes parametros en el siguiente orden: ' + params[0], {reply_markup: JSON.stringify(replyMarkup)});
    
        step = 2; break;
    }
  }

}

async function handleDocument(msg){
  const chatId = msg.chat.id
  const docId = msg.document.file_id

  const filePath = './../archivos/'

  //console.log(filePath2)
  const filePath2 = await bot.downloadFile(docId, filePath)

  fs.renameSync(filePath2, filePath + msg.document.file_name)

  res = await dbConfig.newDocument(msg.document.file_name, filePath + msg.document.file_name)

  bot.sendMessage(chatId, "Creando documento...\nPor favor escribe los parametros del documento.\nRecuerda separarlos por comas.")

  console.log(res)
  step = 5
}


module.exports = {handleMessage, handleCallbackQuery, handleDocument}