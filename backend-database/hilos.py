import threading
import pymongo
import random
import time
import datetime
from bson.objectid import ObjectId
#Funcion Añadir
def add():
	#Indicamos que la variable es global para que no cree una nueva sino use la global
	global estado
	#Añadimos 10 personas
	for i in range(10):
		v=0
		#Bucle en espera para usar la base de datos
		while v==0:
			#Verificamos si nadie esta usando la base de datos (0 == no | 1==si)
			if(estado==0):
				#Indicamos que la vamos a usar
				estado=1
				v=1
				print("Hilo 1 modificando")
				#Actualizamos el valor
				valor=documento[0]["Cantidad"]+1
				#Actualizamos en la base de datos
				coleccion.update_one({"_id":ObjectId(ID_doc)}, {"$set": {"Cantidad": valor }})	
			else:
				#Como alguien esta usando la base de datos esperamos 1 segundo
				#Para ver si se desocupa para volver a preguntar
				time.sleep(1)
		#Indicamos que ya no estamos usando la base de datos
		estado=0
		print("Hilo 1 descansando")
		#Dormimos unos segundos para dar posibilidad a otros hilos de usar la base de datos
		time.sleep(2)

#Funcion resta				
def rest():
	global estado
	for i in range(9):
		v=0
		while v==0:
			if(estado==0):
				print("Hilo 2 modificando")
				estado=1
				v=1				
				valor=documento[0]["Cantidad"]-1
				coleccion.update_one({"_id":ObjectId(ID_doc)}, {"$set": {"Cantidad": valor }})	
			else:
				time.sleep(1)
		estado=0
		print("Hilo 2 descansando")
		time.sleep(2)
						

tiempo_ini = datetime.datetime.now()
#Variables de apoyo
Mongo_baseDatos="ForoPrueba"
Mongo_coleccion="prueba"
estado=0;

try:
	#Conexion a mongoDb(Linea Obligatoria)
	cliente = pymongo.MongoClient("mongodb+srv://Cesar:1234@cluster0.ihcp8.mongodb.net/Foro?retryWrites=true&w=majority")
	print("conexion exitosa")
	#Obtenemos la base de datos a trabajar
	baseDatos=cliente[Mongo_baseDatos]
	#Obtenemos la coleccion a trabajar
	coleccion=baseDatos[Mongo_coleccion]
	#Id del documento en el cual modificaremos los datos
	ID_doc="5f931b16879144ec11b4446a"
	#Creamos el Objeto ID para que mongo lo reconozca
	idBuscar={"_id":ObjectId(ID_doc)}
	#Lo buscamos, lo devuelve como un arreglo de documento		
	documento=coleccion.find(idBuscar)
	#Creamos los hilos
	t1 = threading.Thread(name="hilo_1", target=add)
	t2 = threading.Thread(name="hilo_2", target=rest)
	#Iniciamos los hilos
	t1.start()
	t2.start()
	#Esperamos a que se terminen para seguir el progama
	t1.join()
	t2.join()
#Posibles errores	
except pymongo.errors.ServerSelectionTimeoutError as errorTiempo:
	print("Tiempo exedido"+errorTiempo)
except pymongo.errors.ConnectionFailure as errorConexion:
	print ("Fallo al conectarse a mongodb "+errorConexion)

tiempo_fin = datetime.datetime.now()
print("Tiempo transcurrido " + str(tiempo_fin.second - tiempo_ini.second))

#consultar(1)
#guardar(1, "¡Suscribete al canal Coder!")





