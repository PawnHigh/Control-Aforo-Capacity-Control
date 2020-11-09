import cv2
from tkinter import *
from tkinter import ttk
from PIL import Image, ImageTk
import datetime

# My Classes
import MyPerson
import MyFrameFeatures
import MyDataBase

# ------funciones para las interfaces
def inicializar_frame(size_x, size_y):
    frame_t = LabelFrame(tab1, bg="white", width=size_x, height=size_y)
    return frame_t


def inicializar_label(frame_t, size_x, size_y):
    label_t = Label(frame_t, bg="white", width=size_x, height=size_y)
    return label_t

def iniciar(a,b,c):
    cap = cv2.VideoCapture(a)
    cap_1 = cv2.VideoCapture(b)
    cap_2 = cv2.VideoCapture(c)
    return cap,cap_1,cap_2

# ---------------funciones de acciones
def callback(event):
    aux = lista[0]
    lista[0] = lista[2]
    lista[2] = aux
    lista_capturas[0] = cv2.VideoCapture(lista[0])
    lista_capturas[2] = cv2.VideoCapture(lista[2])
    print('clicked', lista[0], lista[2], 'cap hecho')

def callback1(event):
    aux = lista[1]
    lista[1] = lista[2]
    lista[2] = aux
    lista_capturas[1] = cv2.VideoCapture(lista[1])
    lista_capturas[2] = cv2.VideoCapture(lista[2])
    print('clicked', lista[1], lista[2], 'cap hecho')

def callback2(event):
    global allow
    print(event.x, event.y, "asdfdfsdf\n\n")
    if event.x > 735 and event.y < 55:
        print("\n\nHello\n\n")

    if allow:
        allow = False
    else:
        allow = True
        

def show_tiny_frame(frame_t, int_x, int_y):
    frame_t = cv2.resize(frame_t, (int_x, int_y))
    frame_t = cv2.cvtColor(frame_t, cv2.COLOR_BGR2RGB)
    frame_t = ImageTk.PhotoImage(Image.fromarray(frame_t))
    return frame_t

def detection(fr, nameCAM, frFts, db, persons, pid, int_x, int_y):
    global aforo_total, allow
    frame = fr
    for i in persons:
        i.age_one()

    frame = cv2.resize(frame, (640,480)) # Cambiar el tamaño de cada cuadro (fotograma) ancho y alto, resize every frame, width and height
    #print(frame.shape) # row (height), column (width) and channels (if the image is color)

    datet = str(datetime.datetime.now())
    cv2.putText(frame, datet[0:21], (430, 470), font, .5, (0,0,0), 1, cv2.LINE_AA)
    
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
                            db.semaforo.acquire()
                            aforo_total += 1
                            #db.añadir()
                            db.semaforo.release()
                            print(nameCAM,'AFORO TOTAL:', aforo_total)
                                
                        elif i.going_DOWN(frFts.line_down(),frFts.line_up()) == True:
                            db.semaforo.acquire()
                            aforo_total -= 1
                            #db.restar()
                            db.semaforo.release()
                            print(nameCAM, 'AFORO TOTAL:', aforo_total)
                        break
                    
                    if i.getState() == '1':
                        if i.getDir() == 'down' and i.getY() > frFts.down_limit():
                            i.setDone()
                        elif i.getDir() == 'up' and i.getY() < frFts.up_limit():
                            i.setDone()

                    if i.timedOut():
                        # Sacar i de la lista persons
                        index = persons.index(i)
                        persons.pop(index)
                        del i # Liberar memoria (Release memory
                    
                if new == True:
                    p = MyPerson.Person(pid, cx, cy, max_p_age)
                    persons.append(p)
                    pid += 1

            #################
            #   DIBUJOS     #
            #################

            if allow:
                cv2.circle(frame,(cx,cy), 6, (0,0,255), -1)
                img = cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)
            
    #END for cnt in contours
            
    #########################
    # DIBUJAR TRAYECTORIAS  #
    #########################

    for i in persons:
        cv2.putText(frame, str(i.getId()),(i.getX(),i.getY()),font,0.3,i.getRGB(),1,cv2.LINE_AA)
    
    #################
    #      Lines    #
    #################
    if allow:
        cv2.putText(frame, 'Aforo Total: '+str(aforo_total), (50, 50), font, 1, (0,185,255), 2, cv2.LINE_AA)
        frame = cv2.polylines(frame,[frFts.coord_redl()],False,(0,0,255),thickness=2)
        frame = cv2.polylines(frame,[frFts.coord_bluel()],False,(255,0,0),thickness=2)
        frame = cv2.polylines(frame,[frFts.coord_fwl()],False,(255,255,255),thickness=1)
        frame = cv2.polylines(frame,[frFts.coord_lwl()],False,(255,255,255),thickness=1)

    if int_x - 800 == 0 and int_y - 560 == 0:
        cv2.circle(frame,(600,30), 14, (255,90,90), -1)
        if allow:
            cv2.putText(frame, 'Desactivar Efectos', (500, 60), font, 0.4, (0,0,0), 1, cv2.LINE_AA)
        else:
            cv2.putText(frame, 'Activar', (540, 60), font, 0.5, (0,0,0), 1, cv2.LINE_AA)

    frame = cv2.resize(frame, (int_x, int_y))
    return frame


if __name__ == '__main__':

    # Contadores de entrada y salida (In and out counters)
    aforo_total = 20
    
    # Object for a data base features
    db = MyDataBase.Data_Base()

    # Sustractor de fondo (Background sustractor)
    fgbg = cv2.createBackgroundSubtractorMOG2(detectShadows = True) # Mixture of Gaussian (MOG)

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

    # valores de entrada
    lista = ['input.mp4', 'input.mp4', 'people_flow1.mp4']

    # creacion de los objetos cap
    global cap
    global cap_1
    global cap_2

    cap,cap_1,cap_2 = iniciar(lista[0],lista[1],lista[2])
    lista_capturas = [cap,cap_1,cap_2]

    # Object for a frame and video features
    frFtrs = MyFrameFeatures.Frame_Features(cap)
    frFtrs2 = MyFrameFeatures.Frame_Features(cap_1)
    frFtrs3 = MyFrameFeatures.Frame_Features(cap_2)
    # --------------- iniciar la creacion de interfaz
    window = Tk()
    window.title("Camaras")
    window.geometry('1200x620')
    window.resizable(0, 0)

    tab_control = ttk.Notebook(window)
    tab1 = ttk.Frame(tab_control)
    tab_control.add(tab1, text='Camaras piso 1')

    lbl1 = Label(tab1, text='label1')
    lbl1.pack()

    ventana01 = inicializar_frame(400, 280)
    ventana01.place(x=0, y=0)
    L1 = inicializar_label(ventana01, 400, 280)
    L1.pack()

    ventana02 = inicializar_frame(400, 280)
    ventana02.place(x=0, y=280)
    L2 = inicializar_label(ventana02, 400, 280)
    L2.pack()

    ventana03 = inicializar_frame(800, 560)
    ventana03.place(x=410, y=0)
    L3 = inicializar_label(ventana03, 800, 560)
    L3.pack()
    # ----------------fin de funciones de acciones
    L1.bind("<Button-1>", callback)
    L2.bind("<Button-1>", callback1)
    L3.bind("<Button-1>", callback2)

    tab_control.pack(expand=1, fill='both')
    # ----------------------- fin de interfaces


    if (lista_capturas[0].isOpened() == False or lista_capturas[1].isOpened() == False or lista_capturas[2].isOpened() == False):
        print('Video no pudo ser capturado')

    while (True):
        if lista_capturas[0].isOpened() != False:
            ret, frame = lista_capturas[0].read()
            if (ret == True):
                frame = detection(frame, 'frame1', frFtrs, db, persons, pid, 400, 280)
                frame = show_tiny_frame(frame,400,280)
                L1['image'] = frame
        if lista_capturas[1].isOpened() != False:
            ret_1, frame_1 = lista_capturas[1].read()
            if (ret_1 == True):
                frame_1 = detection(frame_1, 'frame2', frFtrs2, db, persons2, pid1, 400, 280)
                frame_1 = show_tiny_frame(frame_1,400,280)
                L2['image'] = frame_1
        if lista_capturas[2].isOpened() != False:
            ret_2, frame_2 = lista_capturas[2].read()
            if (ret_2 == True):
                frame_2 = detection(frame_2, 'frame3', frFtrs3, db, persons3, pid2, 800, 560)
                frame_2 = show_tiny_frame(frame_2,800,560)
                L3['image'] = frame_2

        if (lista_capturas[0].isOpened() == False or lista_capturas[1].isOpened() == False or lista_capturas[2].isOpened() == False):
            print('Video no pudo ser capturado')

        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

        window.update()
        
    #################
    #   LIMPIEZA    #
    #################

    cap.release()
    cap_1.release()
    cap_2.release()
    cv2.destroyAllWindows()
