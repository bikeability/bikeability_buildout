from Products.Five import BrowserView
from plone.memoize.view import memoize
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from zope.app.component.hooks import getSite


     
class MeasurementView(BrowserView):
    """
    """  

    template = ViewPageTemplateFile('templates/measurement_view.pt')
    
    def __call__(self):
        """
        """    
        # super(BrowserView, self).__call__()
        return self.template()

    
    def __init__(self, context, request):
        super(BrowserView, self).__init__(context, request)
        self.context = context
        self.request = request
        
        
        try:
            self.data_dict = eval(self.getValues())
        except SyntaxError:
            self.data_dict = {}
    
    
    # def __call__(self):
    
    def getValues(self): 
        return self.context.getMeasurement()
    
    
    def getGoodText0(self):
        return self.data_dict.get("good-text0","")
    
    
    def getGoodText1(self):
        return self.data_dict.get("good-text1","")
    
    def getGoodText2(self):
        return self.data_dict.get("good-text2","")
    
    def getGoodDrop0(self):
        return self.data_dict.get("good-drop0","")
    
    def getGoodDrop1(self):
        return self.data_dict.get("good-drop1","")
    
    def getGoodDrop2(self):
        return self.data_dict.get("good-drop2","")
    
    def getGoodCoord0(self):
        return self.data_dict.get("good-coord0","")

    def getGoodCoord1(self):
        return self.data_dict.get("good-coord1","")
    
    def getGoodCoord2(self):
        return self.data_dict.get("good-coord2","")
    
    def getCoordinateJS(self):
        
        txt = """{'good_markers' : ["""
        
        if  self.data_dict.get("good-coord0","") != '':
            coords0 = self.data_dict.get("good-coord0","").split(",")
            txt = txt + "{'text' : '%s', 'drop': '%s', 'coord' : [%s,%s]}" % (self.data_dict.get("good-text0",""), self.data_dict.get("good-drop0",""), coords0[0], coords0[1])
            
        if  self.data_dict.get("good-coord1","") != '':
            coords1 = self.data_dict.get("good-coord1","").split(",")
            txt = txt + ",{'text' : '%s', 'drop': '%s', 'coord' : [%s,%s]}" % (self.data_dict.get("good-text1",""), self.data_dict.get("good-drop1",""), coords1[0], coords1[1])
        
        if  self.data_dict.get("good-coord2","") != '':
            coords2 = self.data_dict.get("good-coord2","").split(",")
            txt = txt + ",{'text' : '%s', 'drop': '%s', 'coord' : [%s,%s]}" % (self.data_dict.get("good-text2",""), self.data_dict.get("good-drop2",""), coords2[0], coords2[1])
        
        txt = txt + "],"
        
        
        txt = txt + """'bad_markers' : ["""
        
        if  self.data_dict.get("bad-coord0","") != '':
            coords0 = self.data_dict.get("bad-coord0","").split(",")
            txt = txt + "{'text' : '%s', 'drop': '%s', 'coord' : [%s,%s]}" % (self.data_dict.get("bad-text0",""), self.data_dict.get("bad-drop0",""), coords0[0], coords0[1])
            
        if  self.data_dict.get("bad-coord1","") != '':
            coords1 = self.data_dict.get("bad-coord1","").split(",")
            txt = txt + ",{'text' : '%s', 'drop': '%s', 'coord' : [%s,%s]}" % (self.data_dict.get("bad-text1",""), self.data_dict.get("bad-drop1",""), coords1[0], coords1[1])
        
        if  self.data_dict.get("bad-coord2","") != '':
            coords2 = self.data_dict.get("bad-coord2","").split(",")
            txt = txt + ",{'text' : '%s', 'drop': '%s', 'coord' : [%s,%s]}" % (self.data_dict.get("bad-text2",""), self.data_dict.get("bad-drop2",""), coords2[0], coords2[1])
        
        txt = txt + "],"
        
        raw_polyline = self.data_dict.get("polyline",'')
        
        if raw_polyline == '':
            txt = txt + "'polyline' : []"
        else:
            nodes = raw_polyline.split(";")
            txt = txt + "'polyline' : ["
            for node in nodes:
                node_arr = node.split(",")
                # import pdb;pdb.set_trace()
                if node_arr != ['']:
                    txt = txt + "[" + str(eval(node_arr[0])) + "," + str(eval(node_arr[1])) + "],"
        txt = txt[:-1] + "]}"
        
        # import pdb;pdb.set_trace()
        
        return txt
        
        
        
 