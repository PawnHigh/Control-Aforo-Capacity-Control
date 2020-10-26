import numpy as np
import cv2 as cv
import datetime
from random import randint
import time

class MyPerson:
    tracks = []

    def __init__(self, i, xi, yi, max_age):
        self.i = i
        self.x = xi
        self.y = yi
        self.tracks = []
        self.R = randint(0,255)
        self.G = randint(0,255)
        self.B = randint(0,255)
        self.done = False
        self.state = '0'
        self.age = 0
        self.max_age = max_age
        self.dir = None

    def getRGB(self):
        return (self.R,self.G,self.B)

    def getTracks(self):
        return self.tracks

    def getId(self):
        return self.i

    def getState(self):
        return self.state

    def getDir(self):
        return self.dir

    def getX(self):
        return self.x

    def getY(self):
        return self.y

    def updateCoords(self, xn, yn):
        self.age = 0
        self.tracks.append([self.x,self.y])
        self.x = xn
        self.y = yn

    def setDone(self):
        self.done = True

    def timedOut(self):
        return self.done

    def going_UP(self,mid_start,mid_end):
        if len(self.tracks) >= 2:
            if self.state == '0':
                if self.tracks[-1][1] < mid_end and self.tracks[-2][1] >= mid_end: #cruzo la linea
                    state = '1'
                    self.dir = 'up'
                    return True
            else:
                return False
        else:
            return False

    def going_DOWN(self,mid_start,mid_end):
        if len(self.tracks) >= 2:
            if self.state == '0':
                if self.tracks[-1][1] > mid_start and self.tracks[-2][1] <= mid_start: #cruzo la linea
                    state = '1'
                    self.dir = 'down'
                    return True
            else:
                return False
        else:
            return False
            
    def age_one(self):
        self.age += 1
        if self.age > self.max_age:
            self.done = True
        return True

class MultiPerson:
    def __init__(self, persons, xi, yi):
        self.persons = persons
        self.x = xi
        self.y = yi
        self.tracks = []
        self.R = randint(0,255)
        self.G = randint(0,255)
        self.B = randint(0,255)
        self.done = False

try:
    log = open('log.txt',"w")
except:
    print( "No se puede abrir el archivo log")

# Contadores de entrada y salida (In and out counters)
cnt_up   = 0
cnt_down = 0

# Capturar video (Video Capture)
cap = cv.VideoCapture('people_flow1.mp4')

# Cálculo de estimación del area de una persona (Calculate an estimated human area )
h = 480
w = 640
frameArea = h*w
areaMinimumHuman = frameArea/250
print('Minimun Human Area', areaMinimumHuman)

# Lineas de entrada/salida
line_up = int(2*(h/5))
line_down = int(3*(h/5))
up_limit = int(1*(h/5))
down_limit = int(4*(h/5))

print( "Red line y:",str(line_down))
print( "Blue line y:", str(line_up))

pt1 =  [0, line_down]; 
pt2 =  [w, line_down]; 
pt3 =  [0, line_up];
pt4 =  [w, line_up];
pts_L1 = np.array([pt1,pt2], np.int32)
pts_L1 = pts_L1.reshape((2,1,2))
pts_L2 = np.array([pt3,pt4], np.int32)
pts_L2 = pts_L2.reshape((2,1,2))

pt5 =  [0, up_limit];
pt6 =  [w, up_limit];
pt7 =  [0, down_limit];
pt8 =  [w, down_limit];
pts_L3 = np.array([pt5,pt6], np.int32)
pts_L3 = pts_L3.reshape((2,1,2))
pts_L4 = np.array([pt7,pt8], np.int32)
pts_L4 = pts_L4.reshape((2,1,2))

# Subtractor de fondo (Background sustractor)
fgbg = cv.createBackgroundSubtractorMOG2(detectShadows = True) # Mixture of Gaussian (MOG)

# Elementos estructurantes para filtros morfologicos (Structuring elements for morphological filters)
kernelOp = np.ones((3,3),np.uint8)
kernelCl = np.ones((11,11),np.uint8)

# Variables
font = cv.FONT_HERSHEY_SIMPLEX
persons = []
max_p_age = 5
pid = 1

while(cap.isOpened()):
    
    ret, frame = cap.read()

    for i in persons:
        i.age_one()

    frame = cv.resize(frame, (640,480)) # Cambiar el tamaño de cada cuadro (fotograma) ancho y alto, resize every frame, width and height 
    #print(frame.shape) # row (height), column (width) and channels (if the image is color)

    datet = str(datetime.datetime.now())
    cv.putText(frame, datet[0:21], (430, 470), font, .5, (0,0,0), 1, cv.LINE_AA)
    
    #########################
    #   PRE-PROCESAMIENTO   #
    #########################
    
    # Aplica sustraccion de fondo (Apply background subtraction)
    fgmask = fgbg.apply(frame)

    # Binarizacion para eliminar sombras (color gris), (Binarization to eliminate shadows, (gray color))
    try:
        ret,imBin= cv.threshold(fgmask,200,255,cv.THRESH_BINARY)
        mask = cv.morphologyEx(imBin, cv.MORPH_OPEN, kernelOp) # Quitar ruido (Remove noise)
        mask = cv.morphologyEx(mask , cv.MORPH_CLOSE, kernelCl) # Juntar las regiones blancas (join white regions)
    except:
        print('EOF')
        print( 'UP:',cnt_up)
        print ('DOWN:',cnt_down)
        break

    #################
    #   CONTORNOS   #
    #################
    
    # hierarchy = return (next contour in same hierarchy, previous contour in same hierarchy, child, parent)
    # contours = return edge matrix (just the parent contour, child contour is left behind)
    contours, hierarchy = cv.findContours(mask,cv.RETR_EXTERNAL,cv.CHAIN_APPROX_SIMPLE)

    for cnt in contours:
        area = cv.contourArea(cnt)
        if area > areaMinimumHuman:
            print('Area Detectada: ',area, ', Area minima de humano: ', areaMinimumHuman)

            #################
            #   TRACKING    #
            #################
            
            M = cv.moments(cnt)
            cx = int(M['m10']/M['m00'])
            cy = int(M['m01']/M['m00'])
            x,y,w,h = cv.boundingRect(cnt)

            new = True
            if cy in range(up_limit,down_limit):
                for i in persons:
                    if abs(x-i.getX()) <= w and abs(y-i.getY()) <= h:
                        # El objeto esta cerca de uno que ya se detecto antes
                        new = False
                        i.updateCoords(cx,cy)   # Actualiza coordenadas en el objeto and resets age
                        if i.going_UP(line_down,line_up) == True:
                            cnt_up += 1;
                            print( "ID:",i.getId(),'crossed going up at',time.strftime("%c"))
                            log.write("ID: "+str(i.getId())+' crossed going up at ' + time.strftime("%c") + '\n')
                        elif i.going_DOWN(line_down,line_up) == True:
                            cnt_down += 1;
                            print( "ID:",i.getId(),'crossed going down at',time.strftime("%c"))
                            log.write("ID: " + str(i.getId()) + ' crossed going down at ' + time.strftime("%c") + '\n')
                        break
                    if i.getState() == '1':
                        if i.getDir() == 'down' and i.getY() > down_limit:
                            i.setDone()
                        elif i.getDir() == 'up' and i.getY() < up_limit:
                            i.setDone()
                    if i.timedOut():
                        # Sacar i de la lista persons
                        index = persons.index(i)
                        persons.pop(index)
                        del i # Liberar memoria (Release memory)
                if new == True:
                    p = MyPerson(pid,cx,cy, max_p_age)
                    persons.append(p)
                    pid += 1

            #################
            #   DIBUJOS     #
            #################
            cv.circle(frame,(cx,cy), 6, (0,0,255), -1)
            img = cv.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)            
            #cv.drawContours(frame, cnt, -1, (0,255,0), 3)
            
    #END for cnt in contours
            
    #########################
    # DIBUJAR TRAYECTORIAS  #
    #########################
    for i in persons:
        cv.putText(frame, str(i.getId()),(i.getX(),i.getY()),font,0.3,i.getRGB(),1,cv.LINE_AA)
        
    #################
    #   IMAGANES    #
    #################
    str_up = 'UP: '+ str(cnt_up)
    str_down = 'DOWN: '+ str(cnt_down)
    frame = cv.polylines(frame,[pts_L1],False,(255,0,0),thickness=2)
    frame = cv.polylines(frame,[pts_L2],False,(0,0,255),thickness=2)
    frame = cv.polylines(frame,[pts_L3],False,(255,255,255),thickness=1)
    frame = cv.polylines(frame,[pts_L4],False,(255,255,255),thickness=1)
    cv.putText(frame, str_up ,(10,40),font,0.5,(255,255,255),2,cv.LINE_AA)
    cv.putText(frame, str_up ,(10,40),font,0.5,(0,0,255),1,cv.LINE_AA)
    cv.putText(frame, str_down ,(10,90),font,0.5,(255,255,255),2,cv.LINE_AA)
    cv.putText(frame, str_down ,(10,90),font,0.5,(255,0,0),1,cv.LINE_AA)

    cv.imshow('Frame', frame)
    cv.imshow('Mask', mask)    
    
    if cv.waitKey(25) == ord('q'):
        break

#END 
    
#################
#   LIMPIEZA    #
#################

log.flush()
log.close()
cap.release()
cv.destroyAllWindows()