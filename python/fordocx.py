from docx import Document


class ForDocx:

    def __init__(self, data):
        self.rutaIn = './../archivos/plantilla.docx'
        self.rutaOut = './../archivos/resultado.docx'

        self.rutaPrueba =  './../archivos/res_reporte1.docx'

        self.document = Document(self.rutaPrueba)

        #paragraph = document.add_paragraph('KACIEL BENITEZ')

        #PARAMETROS QUE SE OBTENDRAN DE LA BASE DE DATOS DEPENDIENDO DE LA PLANTILLA SELECCIONADA
        #params = ['NOMBRE', 'TITULO', 'NUMCONTROL', 'COLONIA', 'CIUDAD', 'TELEFONO']

        self.params = ['NOMBRE']

        #cambios2


        #VALORES DE ENTRADA RECIBIDOS DEL SERVIDOR PASADOS POR EL BOT (CORRESPONDEN A LOS PARAMETROS DE LA BASE DE DATOS) (EL ORDEN IMPORTA)
        #inputs = ['Kaciel Alejandro Benitez Ferral', 'PRIMER REPORTE', '19071482', 'Col. Los Mangos', 'Tampico, Tamaulipas', '833-357-48-20']

        #inputs = []
        self.inputs = [data]

        text = self.document.paragraphs

        for para in text:
            for param, input in zip(self.params, self.inputs):
                if('['+ param +']' in para.text):
                    for run in para.runs:
                        run.text = run.text.replace('['+ param +']', input)
                    #para.text = para.text.replace('['+ param +']', input)


        self.document.save(self.rutaOut)

    def falso():
        print("holaaaas")