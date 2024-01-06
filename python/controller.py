import sys
from fordocx import ForDocx

class Controller:

    def __init__(self, data):
        self.data = data

    def doc(self):
        return self.data
    


data = sys.stdin.readline()

x = Controller(data = "lll")

doc = ForDocx(data)

print(doc.getRutaOut())