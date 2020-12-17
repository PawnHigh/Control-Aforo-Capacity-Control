import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from threading import Thread, Semaphore
import datetime

class Data_Base:

	def __init__(self):
		self.semaforo = Semaphore(1)
		self.cred = credentials.Certificate("conect.json") #Conector
		firebase_admin.initialize_app(self.cred)
		self.db = firestore.client()
		self.transaction = self.db.transaction()
		self.documento = self.db.collection(u'aforodata').document(u'HIVRbsZvDPaf0Ostc9BV')
		self.threads = []
		# Agregado
		self.today= datetime.date.today()
		self.reportName="reporte_"+format(self.today.year)
		self.month= self.today.month
		self.day= self.today.day
		self.inseguro=0
		self.maximo=0
		self.peligroso=0

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
		self.verificarCapacidad()
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

	def terminar(self, valor):
		diccionario = {
			"personas" : valor,
			"inseguro": self.inseguro,
			"maximo":  self.maximo,
			"peligroso":  self.peligroso
		}	
		try:
			arr = self.documento.get().get(self.reportName)				
		except Exception as e:
			arr=[]
			for i in range(12):
				dicc={}
				arr.append(dicc)

		dicc = {str(self.day) : diccionario}
		arr[self.month-1].update(dicc)	
		self.documento.update({self.reportName: arr})

	def verificarCapacidad(self):
		valor= self.documento.get().get(u'actual')

		inseguroReal = self.documento.get().get(u'inseguro')
		peligrosoReal = self.documento.get().get(u'peligroso')
		maximoReal = self.documento.get().get(u'maximo')
		
		if valor >= maximoReal:
			self.maximo = self.maximo+1
		elif valor >= peligrosoReal:
			self.peligroso = self.peligroso+1
		elif valor >= inseguroReal:
			self.inseguro = self.inseguro+1
