from docx import Document
from datetime import datetime

class ForDocx:

    def __init__(self, data, params, ruta):
        #self.rutaIn = './../archivos/plantilla.docx'

        now = datetime.now()
        self.rutaOut = './../archivos/' + str(now.time()).replace(':', '-') + '.docx'

        #self.rutaPrueba =  './../archivos/res_reporte1.docx'

        self.rutaPrueba = ruta.strip()

        self.document = Document(self.rutaPrueba)

        self.document.save(self.rutaPrueba)

        self.document = Document(self.rutaPrueba)

        #paragraph = document.add_paragraph('KACIEL BENITEZ')

        #PARAMETROS QUE SE OBTENDRAN DE LA BASE DE DATOS DEPENDIENDO DE LA PLANTILLA SELECCIONADA
        #params = ['NOMBRE', 'TITULO', 'NUMCONTROL', 'COLONIA', 'CIUDAD', 'TELEFONO']

        #self.params = ['NOMBRE']

        self.params = []

        params = params.split(', ')
        
        self.params = params

        #self.params.append(params)
        

        #cambios2


        #VALORES DE ENTRADA RECIBIDOS DEL SERVIDOR PASADOS POR EL BOT (CORRESPONDEN A LOS PARAMETROS DE LA BASE DE DATOS) (EL ORDEN IMPORTA)
        #inputs = ['Kaciel Alejandro Benitez Ferral', 'PRIMER REPORTE', '19071482', 'Col. Los Mangos', 'Tampico, Tamaulipas', '833-357-48-20']

        #inputs = []

        data = data.split(',')

        self.inputs = data

        text = self.document.paragraphs

        for para in text:
            for param, input in zip(self.params, self.inputs):
                #print(param)
                if('['+ param +']' in para.text):
                    
                    for run in para.runs:
                        if '[' + param + ']' in run.text:
                            #print('A: ' + run.text)
                            run.text = run.text.replace('['+ param +']', input)
                        #else:
                            #print('B: '+run.text)        
                    

                            

                        #print("remplazado: " + '[['+param+']]'+ " por: " + run.text)
                    #para.text = para.text.replace('['+ param +']', input)


        self.document.save(self.rutaOut)

    def getRutaOut(self):
        return self.rutaOut[2:]
    