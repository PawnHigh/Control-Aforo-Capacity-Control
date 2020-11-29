import cv2
from tkinter import ttk
from tkinter import *
from PIL import Image, ImageTk
import datetime

# My Classes
import MyPerson
import MyFrameFeatures
import MyDataBase

# ------funciones para las interfaces
def inicializar_frame(size_x, size_y):
    frame_t = LabelFrame(bg="#314781", width=size_x, height=size_y,fg="blue")
    return frame_t

def inicializar_label(frame_t, size_x, size_y):
    label_t = Label(frame_t, bg="#4b79c3", width=size_x, height=size_y,fg="blue")
    return label_t

def iniciar(a,b,c):
    cap = cv2.VideoCapture(a)
    cap_1 = cv2.VideoCapture(b)
    cap_2 = cv2.VideoCapture(c)
    return cap, cap_1, cap_2

# ---------------funciones de acciones
def callback(event): 
    global changeC1
    changeC1 = True
    lista[0], lista[2] = lista[2], lista[0]
    print('clicked', lista[2], "swap with ", lista[0])

def callback1(event):
    global changeC2
    changeC2 = True
    lista[1], lista[2] = lista[2], lista[1]
    print('clicked', lista[2], "swap with ", lista[1])

def lineas():
    global allow, urlImaOn, photo
    urlImaOn = "invisibleOn.png" if urlImaOn == "invisible2.png" else "invisible2.png"
    photo = PhotoImage(file=urlImaOn)
    a = Button(miFrame, command=lineas,image = photo).grid(row=0,column=2, padx=6)
    print("\n\nButton Pressed\n\n")
    if allow:
        allow = False                      
    else:
        allow = True

def camera():
    global flag    
    print("\n\nButton camera Pressed\n\n")
    if flag:
        flag = False                         
    else:
        flag = True

def encender():
    global TurnOn
    if TurnOn:
        TurnOn = False                         
    else:
        TurnOn = True         
           
def show_tiny_frame(frame_t, int_x, int_y):
    frame_t = cv2.resize(frame_t, (int_x, int_y))
    frame_t = cv2.cvtColor(frame_t, cv2.COLOR_BGR2RGB)
    frame_t = ImageTk.PhotoImage(Image.fromarray(frame_t))
    return frame_t

# Falta arreglar que los videos no comiencen de nuevo cuando se presion un callback
def detection(fr, nameCAM, frFts, persons, pid, int_x, int_y):
    global aforo_total, allow, anothertotal, numeroPantalla
    
    frame = fr

    for i in persons:
        i.age_one()

    frame = cv2.resize(frame, (640,480)) # Cambiar el tamaño de cada cuadro (fotograma) ancho y alto, resize every frame, width and height
    #print(frame.shape) # row (height), column (width) and channels (if the image is color)

    datet = str(datetime.datetime.now())
    cv2.putText(frame, datet[0:21], (420, 460), font, .5, (0,0,0), 1, cv2.LINE_AA)
    
    #########################
    #   PRE-PROCESAMIENTO   #
    #########################
    
    # Aplica sustraccion de fondo (Apply background subtraction)
    fgmask = fgbg.apply(frame)

    # Binarizacion para eliminar sombras (color gris), Binarization to eliminate shadows (gray color)
    ret , imBin= cv2.threshold(fgmask,200,255,cv2.THRESH_BINARY)
    mask = cv2.morphologyEx(imBin, cv2.MORPH_OPEN, frFts.kernelOp()) # Quitar ruido (Remove noise)
    mask = cv2.morphologyEx(mask , cv2.MORPH_CLOSE, frFts.kernelCl()) # Juntar las regiones blancas (join white regions)
    
    #################
    #   CONTORNOS   #
    #################
    
    # hierarchy = return (next contour in same hierarchy, previous contour in same hierarchy, child, parent)
    # contours = return edge matrix (just the parent contour, child contour is left behind)
    # Contours es una lista de Opencv de todos los contornos de la imagen
    contours, hierarchy = cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    
    for cnt in contours:
        area = cv2.contourArea(cnt)

        if area > frFts.area_Minimum_Human():
            print(nameCAM,'Area Detectada: ',area, ', Area minima de humano: ', frFts.area_Minimum_Human())

            #################
            #   TRACKING    #
            #################

            # Caracteristicas del objeto como centro de masa o area (Features of the object as center of mass or area)
            M = cv2.moments(cnt)
            # (cx, cy) is the Centroid (the arithmetic mean position)
            cx = int(M['m10']/M['m00'])
            cy = int(M['m01']/M['m00'])

            (x, y, w, h) = cv2.boundingRect(cnt) # (x , y) = coordinates, (w, h) = width and height
            #cv2.circle(frame,(x,y), 12, (255,0,255), -1)

            new = True

            if cy in range(frFts.up_limit(), frFts.down_limit()): 

                for i in persons:
                    # Si el objeto no esta cerca de uno que ya se detecto antes
                    if abs(x-i.getX()) <= w and abs(y-i.getY()) <= h:
                        
                        new = False
                        i.updateCoords(cx,cy) # Actualiza coordenadas en el objeto and resets age

                        if i.going_UP(frFts.line_down(),frFts.line_up()) == True:
                            aforo_total += 1
                            anothertotal += 1                            
                            db.añadir()
                            print(nameCAM,'AFORO TOTAL:', aforo_total)
                                
                        elif i.going_DOWN(frFts.line_down(),frFts.line_up()) == True:
                            aforo_total -= 1
                            db.restar()
                            print(nameCAM, 'AFORO TOTAL:', aforo_total)

                        numeroPantalla.set("Aforo "+str(aforo_total))
                        break

                    #print("Personas antes: ",len(persons))

                    if i.getState() == '1':
                        #print("COMPROBACION BORRAR")

                        if i.getDir() == 'down' and i.getY() > frFts.down_limit():
                            i.setDone()
                        elif i.getDir() == 'up' and i.getY() < frFts.up_limit():
                            i.setDone()

                    if i.timedOut():
                        # Sacar i de la lista persons
                        index = persons.index(i)
                        persons.pop(index)
                        del i # Liberar memoria (Release memory

                    #print("Personas despues: ",len(persons))

                if new == True:
                    p = MyPerson.Person(pid, cx, cy, max_p_age)
                    persons.append(p)
                    pid += 1

            #################
            #    DIBUJOS    #
            #################

            if allow:
                cv2.circle(frame,(cx,cy), 6, (0,0,255), -1)
                img = cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)
            
    #END for cnt in contours
            
    #########################
    # DIBUJAR TRAYECTORIAS  #
    #########################

    for i in persons:
        if allow:
            cv2.putText(frame, str(i.getId()),(i.getX(),i.getY()),font,0.4,i.getRGB(),1,cv2.LINE_AA)
    
    #################
    #      Lines    #
    #################
    if allow:
        #cv2.putText(frame, 'Aforo Total: '+str(aforo_total), (30, 50), font, .8, (0,185,255), 1, cv2.LINE_AA)
        frame = cv2.polylines(frame,[frFts.coord_redl()],False,(0,0,255),thickness=1)
        frame = cv2.polylines(frame,[frFts.coord_bluel()],False,(255,0,0),thickness=1)
        frame = cv2.polylines(frame,[frFts.coord_fwl()],False,(255,255,255),thickness=1)
        frame = cv2.polylines(frame,[frFts.coord_lwl()],False,(255,255,255),thickness=1)
    
    return frame


if __name__ == '__main__':

    # Contador de entrada y salida (In and out counter)
    aforo_total = 20

    # Empezar captura de tiempo de ejecución (Start runtime capture)
    tiempo_ini = datetime.datetime.now()
    
    # Object for a data base features
    db = MyDataBase.Data_Base()

    # valores de entrada
    lista = ['input.mp4','input.mp4', 'input.mp4']

	# creacion de los objetos cap
    cap, cap_1, cap_2 = iniciar(lista[0],lista[1],lista[2])

    # Object for a frame and video features
    frFtrs = MyFrameFeatures.Frame_Features(cap)
    frFtrs2 = MyFrameFeatures.Frame_Features(cap_1)
    frFtrs3 = MyFrameFeatures.Frame_Features(cap_2)

    # Variables
    font = cv2.FONT_HERSHEY_SIMPLEX
    persons = []
    persons2 = []
    persons3 = []
    max_p_age = 5
    pid = 1 # Identificacion de persona (Person ID)   
    pid1 = 1 # Identificacion de persona (Person ID)   
    pid2 = 1 # Identificacion de persona (Person ID)   
    allow = True
    flag  = False
    TurnOn = True

    changeC1 = False # change camera 1
    changeC2 = False # change camera 2
    anothertotal = 0
    
    # --------------- iniciar la creacion de interfaz
    window = Tk()
    window.title("Camaras")
    #window.geometry('1220x572')
    window.geometry('1217x614')
    window.configure(background="#4b79c3")
    window.resizable(0, 0)

    ventana01 = inicializar_frame(400, 280)
    ventana01.place(x=0, y=47)
    L1 = inicializar_label(ventana01, 400, 280)
    L1.pack()

    ventana02 = inicializar_frame(400, 280)
    ventana02.place(x=0, y=327)
    L2 = inicializar_label(ventana02, 400, 280)
    L2.pack()

    ventana03 = inicializar_frame(800, 560)
    ventana03.place(x=410, y=47)
    L3 = inicializar_label(ventana03, 800, 560) 
    L3.pack()

    # Show Aforo
    miFrame = Frame(window,bg="#202020",padx=100,pady=3) # padx = width and pady = height of miFrame
    miFrame.pack()

    numeroPantalla=StringVar()
    numeroPantalla.set("Aforo "+str(aforo_total))

    pantalla=Entry(miFrame,font=('Helvetica 22'),justify="center",textvariable=numeroPantalla,width=7)
    pantalla.grid(row=0,column=1, padx=6)
    pantalla.config(background="black",fg="white")

    # Imagenes botones 
    urlImaOn = "invisible2.png"
    urlIma1On = "video-camera2.png"
    urlImaExit = "power-off2.png"
    urlImaCam = "diafragma (1).png"

    photo = PhotoImage(file=urlImaOn)
    photo1 = PhotoImage(file=urlIma1On)
    photo2 = PhotoImage(file=urlImaExit)
    photo3 = PhotoImage(file=urlImaCam)

    # botones
    a = Button(miFrame, command=lineas,image = photo).grid(row=0,column=2, padx=6)
    b = Button(miFrame, command=camera,image = photo1).grid(row=0,column=3, padx=6)
    c = Button(miFrame, command=encender,image = photo2).grid(row=0,column=4, padx=6)

    # ----------------fin de funciones de acciones
    L1.bind("<Button-1>", callback)
    L2.bind("<Button-1>", callback1)
    
    # Sustractor de fondo (Background sustractor)
    fgbg = cv2.createBackgroundSubtractorMOG2(detectShadows = True) # Mixture of Gaussian (MOG)

    while (TurnOn):
        if cap.isOpened() != False:           
            if changeC1:
                cap, cap_2 = cap_2, cap
                changeC1 = False
               
            if (flag == True):
                    ret,frame =  cap.read()
                    frame = detection(frame, 'frame1', frFtrs, persons, pid, 400, 280)
                    frame = show_tiny_frame(frame, 400, 280)
            if flag:
                L1['image'] = frame                  
            else:
                L1['image'] = photo3

        if cap_1.isOpened() != False:

            if changeC2:
                cap_1, cap_2 = cap_2, cap_1
                changeC2 = False
            
            if (flag == True):
                    ret_1,frame_1 = cap_1.read()            
                    frame_1 = detection(frame_1, 'frame2', frFtrs2 , persons2, pid1, 400, 280)
                    frame_1 = show_tiny_frame(frame_1, 400, 280) 
            if flag:
                L2['image'] = frame_1                  
            else:
                L2['image'] = photo3


        if cap_2.isOpened() != False:
 
            if (flag == True):
                    ret_3,frame_2 = cap_2.read()
                    frame_2 = detection(frame_2, 'frame3', frFtrs3,  persons3, pid2, 800, 560)
                    frame_2 = show_tiny_frame(frame_2,800,560)   
            if flag:
                L3['image'] = frame_2                  
            else:
                L3['image'] = photo3

        if (cap.isOpened() == False or cap_1.isOpened() == False or cap_2.isOpened() == False):
            print('Video no pudo ser capturado')

        if cv2.waitKey(30) & 0xFF == ord('q'):
            break

        window.update()

    for hilo in db.threads:	        
	    # El programa esperará a que este hilo finalice:
	    hilo.join() 

	# Terminar captura de tiempo de ejecución (Terminate runtime capture)
    tiempo_fin = datetime.datetime.now()

    # Calculo de personas que ingresaron al establecimiento / tiempo de ejecucion
    rep = db.tiempoHoras(anothertotal,tiempo_fin.hour-tiempo_ini.hour)
    db.terminar(rep)
        
    #################
    #   LIMPIEZA    #
    #################

    cap.release()
    cap_1.release()
    cap_2.release()
    cv2.destroyAllWindows()