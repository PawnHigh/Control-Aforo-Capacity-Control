import pymongo
import random
import time
import datetime
from bson.objectid import ObjectId
#Variables de apoyo
Mongo_baseDatos="ForoPrueba"
Mongo_coleccion="prueba"
tiempo_ini = datetime.datetime.now()
try:
	#Conexion a mongoDb(Linea Obligatoria)
	#Aqui peguen la conexion
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

	for i in range(20):
		#Simulamos la entrada y salida
		entra=random.randint(0, 20)
		sale=random.randint(0, 20)
		#Calculamos el nuevo valor, del documento en la posicion 0 y el atributo Cantidad
		valor=documento[0]["Cantidad2"]+entra-sale
		print (f"Me actualize de {documento[0]['Cantidad2']} a : {valor} con entra: {entra} y sale: {sale}  ")
		#actualizamos indicando (documento a editar, $set indica que modificaremos solo un atributo y se lo indicamos)
		coleccion.update_one({"_id":ObjectId(ID_doc)}, {"$set": {"Cantidad2": valor }})
#Posibles errores
except pymongo.errors.ServerSelectionTimeoutError as errorTiempo:
	print("Tiempo exedido"+errorTiempo)
except pymongo.errors.ConnectionFailure as errorConexion:
	print ("Fallo al conectarse a mongodb "+errorConexion)	

tiempo_fin = datetime.datetime.now()
print("Tiempo transcurrido " + str(tiempo_fin.second - tiempo_ini.second))