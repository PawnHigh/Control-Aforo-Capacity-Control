import pymongo
from bson.objectid import ObjectId
from threading import Thread, Semaphore

#################
# BASE DE DATOS #
#################

class Data_Base:
    def __init__(self):
        # Inicializacion de semaforo
        self.semaforo = Semaphore(1)
        self.cliente = pymongo.MongoClient(URI)
        self.baseDatos = self.cliente[DATA_BASE_NAME]
        self.coleccion = self.baseDatos[DATA_BASE_COLLECTION]
        self.ID_doc = ID_DOC
        self.idBuscar = {"_id":ObjectId(self.ID_doc)}
        self.documento = self.coleccion.find(self.idBuscar)

    def añadir(self):
        hilo = Thread(target=self.add)
        hilo.start()

    def restar(self):
        hilo = Thread(target=self.subtract)
        hilo.start()

    def add(self):
        global semaforo
        self.semaforo.acquire()
        valor = self.documento[0]["Cantidad"]+1
        self.coleccion.update_one({"_id":ObjectId(self.ID_doc)}, {"$set": {"Cantidad": valor }})
        self.semaforo.release()

    def subtract(self):
        global semaforo
        self.semaforo.acquire()
        valor = self.documento[0]["Cantidad"]-1
        self.coleccion.update_one({"_id":ObjectId(self.ID_doc)}, {"$set": {"Cantidad": valor }})
        self.semaforo.release()
