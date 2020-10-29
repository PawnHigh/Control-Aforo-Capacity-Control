# python people_counter.py --prototxt mobilenet_ssd/MobileNetSSD_deploy.prototxt \
#	--model mobilenet_ssd/MobileNetSSD_deploy.caffemodel --input videos/example_01.mp4 \
#	--output output/output_01.avi
#
# To read from webcam and write back out to disk:
# python people_counter.py --prototxt mobilenet_ssd/MobileNetSSD_deploy.prototxt \
#	--model mobilenet_ssd/MobileNetSSD_deploy.caffemodel \
#	--output output/webcam_output.avi

# import the necessary packages
from pyimagesearch.centroidtracker import CentroidTracker
from pyimagesearch.trackableobject import TrackableObject
from imutils.video import VideoStream
from imutils.video import FPS
import numpy as np
import argparse
import imutils
import time
import dlib
import cv2

inp = 'videos/example_01.mp4'
out = "output/output_01.avi"
prototxt = "mobilenet_ssd/MobileNetSSD_deploy.prototxt"
model = "mobilenet_ssd/MobileNetSSD_deploy.caffemodel"
skipF = 30
conf = 0.4

# inicializar la lista de etiquetas de clase para las que se entrenó MobileNet SSD
CLASSES = ["background", "aeroplane", "bicycle", "bird", "boat",
	"bottle", "bus", "car", "cat", "chair", "cow", "diningtable",
	"dog", "horse", "motorbike", "person", "pottedplant", "sheep",
	"sofa", "train", "tvmonitor"]

# cargar nuestro modelo serializado desde el disco
print("[INFO] loading model...")
net = cv2.dnn.readNetFromCaffe(prototxt, model)

if len(inp) is 0:
	print("[INFO] starting video stream...")
	#Captura de video por medio de celular con Droidcam
	vs = VideoStream(src='http://192.168.137.19:4747/mjpegfeed').start()
	#Captura de video por defecto webcam
	#vs = VideoStream(src=0).start()
	time.sleep(2.0)

# Captura de video local
else:
	print("[INFO] opening video file...")
	vs = cv2.VideoCapture(inp)

# inicializar el escritor de video (crearemos una instancia más adelante si es necesario)
writer = None

# inicializar las dimensiones del marco (las configuraremos tan pronto como leamos
# el primer fotograma del video)
W = None
H = None

# instancia nuestro rastreador de centroide, luego inicializa una lista para almacenar
# cada uno de nuestros trackers de correlación dlib, seguido de un diccionario para
# mapear cada ID de objeto único a un TrackableObject
ct = CentroidTracker(maxDisappeared=40, maxDistance=50)
trackers = []
trackableObjects = {}

# inicializar el número total de fotogramas procesados hasta el momento, junto
# con el número total de objetos que se han movido hacia arriba o hacia abajo
totalFrames = 0
totalDown = 0
totalUp = 0

# iniciar el estimador de rendimiento de fotogramas por segundo
fps = FPS().start()

# recorrer los fotogramas de la transmisión de video
while True:
	# agarre el siguiente frame y maneje si estamos leyendo desde cualquiera
	# VideoCapture o VideoStream
	frame = vs.read()
	frame = frame[1] if inp else frame

	# si estamos viendo un video y no tomamos un frame, entonces
	# han llegado al final del video
	if inp and frame is None:
		break

	# cambiar el tamaño del frame para que tenga un ancho máximo de 500 píxeles (el
	# menos datos tenemos, más rápido podemos procesarlos), luego convertir
	# el marco de BGR a RGB para dlib
	frame = imutils.resize(frame, width=500)

	rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

	# si las dimensiones del marco están vacías, configúrelas
	if W is None or H is None:
		(H, W) = frame.shape[:2]

	# si debemos escribir un video en el disco, inicialice
	# el escritor
	if out and writer is None:
		fourcc = cv2.VideoWriter_fourcc(*"MJPG")
		writer = cv2.VideoWriter(out, fourcc, 30,
			(W, H), True)

	# inicializar el estado actual junto con nuestra lista de límites
	# rectángulos de caja devueltos por (1) nuestro detector de objetos o
	# (2) los rastreadores de correlación
	status = "Waiting"
	rects = []

	# compruebe si deberíamos ejecutar un cálculo más costoso
	# método de detección de objetos para ayudar a nuestro rastreador
	if totalFrames % skipF == 0:
		# establecer el estado e inicializar nuestro nuevo conjunto de tracked objects
		status = "Detecting"
		trackers = []

		# convertir el frame en un blob y pasar el blob a través de la
		# net y obtener las detecciones
		blob = cv2.dnn.blobFromImage(frame, 0.007843, (W, H), 127.5)
		net.setInput(blob)
		detections = net.forward()

		# recorrer las detecciones
		for i in np.arange(0, detections.shape[2]):
			# extraer la confianza (es decir, probabilidad) asociada
			# con la predicción
			confidence = detections[0, 0, i, 2]

			# filtrar las detecciones débiles requiriendo un mínimo de
			# confianza
			if confidence > conf:
				# extraer el índice de la etiqueta de clase de la
				# lista de detecciones
				idx = int(detections[0, 0, i, 1])

				# si la etiqueta de la clase no es una persona, ignórela
				if CLASSES[idx] != "person":
					continue

				# calcular las coordenadas (x, y) del cuadro delimitador
				# para el objeto
				box = detections[0, 0, i, 3:7] * np.array([W, H, W, H])
				(startX, startY, endX, endY) = box.astype("int")

				# construye un objeto rectangle dlib a partir del límite de
				# coordenadas del cuadro y luego inicie la correlación dlib
				# rastreador
				tracker = dlib.correlation_tracker()
				rect = dlib.rectangle(startX, startY, endX, endY)
				tracker.start_track(rgb, rect)

				# agregue el tracker a nuestra lista de trackers para que podamos
				# utilízar durante los frames saltados
				trackers.append(tracker)

	# de lo contrario, deberíamos utilizar nuestros objetos *trackers* en lugar de
	# objetos *detectors* para obtener un mayor rendimiento de procesamiento de tramas
	else:
		# bucle sobre los trackers
		for tracker in trackers:
			# establecer el status de nuestro sistema en 'tracking' en lugar de
			# 'waiting' o 'detecting'
			status = "Tracking"

			# actualiza el tracker y toma la posición actualizada
			tracker.update(rgb)
			pos = tracker.get_position()

			# desempaquetar el objeto de position
			startX = int(pos.left())
			startY = int(pos.top())
			endX = int(pos.right())
			endY = int(pos.bottom())

			# agregue las coordenadas del cuadro delimitador a la lista de rects
			rects.append((startX, startY, endX, endY))

	# dibuje una línea horizontal en el centro del frame, una vez que un 
	# objeto cruza esta línea determinaremos si fueron
	# moviéndose 'up' o 'down'
	cv2.line(frame, (0, H // 2), (W, H // 2), (0, 255, 255), 2)

	# use el centroide tracker para asociar el (1) objeto antiguo
	# centroids con (2) los centroids de objeto recién calculados
	objects = ct.update(rects)

	# recorrer los objetos rastreados
	for (objectID, centroid) in objects.items():
		# compruebe si existe un tracket object para el actual
		# ID de objeto
		to = trackableObjects.get(objectID, None)

		# si no hay un trackable object existente, cree uno
		if to is None:
			to = TrackableObject(objectID, centroid)

		# de lo contrario, hay un trackable object para que podamos utilizarlo
		# para determinar la dirección
		else:
			# la diferencia entre la coordenada y del *actual*
			# centroide y la media de centroides *anteriores* dirán
			# en qué dirección se mueve el objeto (negativo para
			# 'arriba' y positivo para 'abajo')
			y = [c[1] for c in to.centroids]
			direction = centroid[1] - np.mean(y)
			to.centroids.append(centroid)

			# comprobar si el objeto ha sido contado o no
			if not to.counted:
				# si la dirección es negativa (indicando el objeto
				# se mueve hacia arriba) Y el centroide está por encima de la linea
				# central, cuenta el objeto
				if direction < 0 and centroid[1] < H // 2:
					totalUp += 1
					to.counted = True

				# si la dirección es positiva (indicando el objeto
				# se mueve hacia abajo) Y el centroide está debajo de la
				# línea central, cuenta el objeto
				elif direction > 0 and centroid[1] > H // 2:
					totalDown += 1
					to.counted = True

		# almacenar el trackable object en nuestro diccionario
		trackableObjects[objectID] = to

		# dibuja tanto el ID del objeto como el centroide del
		# objeto en el frame de salida
		text = "ID {}".format(objectID)
		cv2.putText(frame, text, (centroid[0] - 10, centroid[1] - 10),
			cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
		cv2.circle(frame, (centroid[0], centroid[1]), 4, (0, 255, 0), -1)

	# construir una tupla de información que mostraremos en el
	# cuadro
	info = [
		("Up", totalUp),
		("Down", totalDown),
		("Status", status),
	]

	# recorrer las tuplas de información y dibujarlas en nuestro frame
	for (i, (k, v)) in enumerate(info):
		text = "{}: {}".format(k, v)
		cv2.putText(frame, text, (10, H - ((i * 20) + 20)),
			cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

	# verifique si debemos escribir el frame en el disco
	if writer is not None:
		writer.write(frame)

	# muestra el frame de salida
	cv2.imshow("Frame", frame)
	key = cv2.waitKey(1) & 0xFF

	# si se presiona la tecla 'q', salga del bucle
	if key == ord("q"):
		break

	# Incrementar el número total de fotogramas procesados hasta ahora y
	# luego actualice el contador de FPS
	totalFrames += 1
	fps.update()

# detener el temporizador y mostrar información de FPS
fps.stop()
print("[INFO] elapsed time: {:.2f}".format(fps.elapsed()))
print("[INFO] approx. FPS: {:.2f}".format(fps.fps()))

# comprobar para ver si necesitamos soltar video writer pointer
if writer is not None:
	writer.release()

# si no estamos usando un archivo de video, detenga la transmisión de video de la cámara
if len(inp) is 0:
	vs.stop()

# de lo contrario, suelte el puntero del archivo de video
else:
	vs.release()

# cierra las ventanas abiertas
cv2.destroyAllWindows()