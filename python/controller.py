from fordocx import ForDocx

class Controller:

    def doc():
        return "hola Kaciel."
    


x = Controller

doc = ForDocx(data = "OFF")

print(x.doc())