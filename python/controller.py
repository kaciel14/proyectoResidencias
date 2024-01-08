import sys
from fordocx import ForDocx

class Controller:

    def __init__(self, data):
        self.data = data

    def doc(self):
        return self.data
    


data = sys.stdin.readline()

x = data.split('=')

#x = Controller(data = "lll")

doc = ForDocx(x[0], x[1], x[2])

print(doc.getRutaOut())