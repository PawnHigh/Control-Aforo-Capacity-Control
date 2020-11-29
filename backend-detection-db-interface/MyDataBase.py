import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from threading import Thread, Semaphore

class Data_Base:

	def __init__(self):
		self.semaforo = Semaphore(1);
		self.cred = credentials.Certificate("conect.json") #Conector
		firebase_admin.initialize_app(self.cred)
		self.db = firestore.client()
		self.transaction = self.db.transaction()
		self.documento = self.db.collection(u'aforodata').document(u'HIVRbsZvDPaf0Ostc9BV')
		self.threads = []

	#Transaccion para añadir 
	@firestore.transactional
	def update_in_transaction(t, documento):
	    snapshot = documento.get(transaction = t)
	    t.update(documento, {
	        u'actual': snapshot.get(u'actual') + 1
	    })

	#Transaccion para eliminar 
	@firestore.transactional
	def update_in_transaction2(t, documento):
	    snapshot = documento.get(transaction = t)
	    t.update(documento, {
	        u'actual': snapshot.get(u'actual') - 1
	    })

	def sum(self):
		self.semaforo.acquire()
		self.update_in_transaction(self.transaction, self.documento)
		self.semaforo.release()

	def rest(self):
		self.semaforo.acquire()
		self.update_in_transaction2(self.transaction, self.documento)
		self.semaforo.release()

	def añadir(self):
		hilo = Thread(target = self.sum)
		hilo.start()
		self.threads.append(hilo)

	def restar(self):
		hilo = Thread(target = self.rest)
		hilo.start()
		self.threads.append(hilo)

	def tiempoHoras(self,total,tiempo):
		valorTiempo = 0
		if tiempo == 0 :
			valorTiempo = 1
		else :
			valorTiempo = tiempo
		return total/valorTiempo

	def terminar(self,valor):
		arr = self.documento.get().get(u'reporte')
		leng = len(arr)
		arr.append(valor)
		self.documento.update({u'reporte': arr})
