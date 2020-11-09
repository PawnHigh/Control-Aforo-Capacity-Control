import numpy as np

class Frame_Features:
    def __init__(self, cap):
        self.cap = cap
        self.h = 480
        self.w = 640

    # Setters
    def setH(self,h):
        self.h = h

    def setW(self,w):
        self.w = w

    # Sizes
    def height(self):
        return self.h

    def width(self):
        return self.w

    # Cálculo de estimación del área de una persona (Calculate an estimated human area )
    def area_Minimum_Human(self):
        frameArea = self.w*self.h #cap.get(3)*cap.get(4)
        return frameArea/250

    # Lineas de entrada/salida (Entry / exit lines)
    def up_limit(self):
        return int(1*(self.h/5)) # 96

    def line_up(self):
        return int(2*(self.h/5)) # 192

    def line_down(self):
        return int(3*(self.h/5)) # 288

    def down_limit(self):
        return int(4*(self.h/5)) # 384

    def coord_fwl(self): # Coordinates of First white line
        pt1 =  [0, self.up_limit()]
        pt2 =  [self.width(), self.up_limit()]
        pts_fwl = np.array([pt1,pt2], np.int32)
        pts_fwl = pts_fwl.reshape((2,1,2)) # ([0,96],[640,96]) 
        return pts_fwl

    def coord_lwl(self): # Coordinates of Last white line
        pt1 =  [0, self.down_limit()]
        pt2 =  [self.width(), self.down_limit()]
        pts_lwl = np.array([pt1,pt2], np.int32)
        pts_lwl = pts_lwl.reshape((2,1,2)) # ([0,384],[640,384]) 
        return pts_lwl

    def coord_redl(self): # Coordinates of the red line
        pt1 =  [0, self.line_up()]
        pt2 =  [self.width(), self.line_up()]
        pts_rl = np.array([pt1,pt2], np.int32)
        pts_rl = pts_rl.reshape((2,1,2)) # ([0,192],[640,192]) 
        return pts_rl

    def coord_bluel(self): # Coordinates of the blue line
        pt1 =  [0, self.line_down()]
        pt2 =  [self.width(), self.line_down()]
        pts_bl = np.array([pt1,pt2], np.int32)
        pts_bl = pts_bl.reshape((2,1,2)) # ([0,288],[640,288])
        return pts_bl

    # Elementos estructurantes para filtros morfologicos (Structuring elements for morphological filters)
    def kernelOp(self):
        return np.ones((3,3),np.uint8)

    def kernelCl(self):
        return np.ones((11,11),np.uint8)