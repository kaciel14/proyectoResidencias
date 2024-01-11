import sys
from fordocx import ForDocx

class Controller:

    def __init__(self, data):
        self.data = data

    def doc(self):
        return self.data
    

sys.stdin.reconfigure(encoding = 'utf-8')
data = sys.stdin.readline()
#data = '01,01,2024,yo,ene - ago=DIA, MES, AÑO, PROFESOR, PERIODO=C:/Users/user/Desktop/proyecto_residencias/archivos/MCI-2023 Liberacion Academica.docx'

data = data

x = data.split('=')

#x = Controller(data = "lll")
doc = ForDocx(x[0], x[1], x[2])

print(doc.getRutaOut())