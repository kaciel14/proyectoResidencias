from pdf2docx import Converter

rutaIn = './../archivos/pdf.pdf'
rutaOut = './../archivos/newDocxFromPDF.docx'

cv = Converter(rutaIn)

cv.convert(rutaOut)

cv.close()