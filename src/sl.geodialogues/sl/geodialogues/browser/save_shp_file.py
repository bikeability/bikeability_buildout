# -*- coding: UTF-8 -*-

######################################################################################
#
# bikeability.dk
#
# Copyright (c) 2010 Snizek & Skov-Pedersen
#
# This program is free software; you can redistribute it and/or modify it under 
# the terms of the GNU General Public License as published by the Free Software 
# Foundation; either version 3 of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but WITHOUT 
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
# FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along with 
# this program; if not, see <http://www.gnu.org/licenses/>.
#
######################################################################################

from Products.Five import BrowserView
from plone.memoize.view import memoize
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from zope.app.component.hooks import getSite
import transaction
from DateTime import DateTime
from random import random
from Products.CMFPlone.utils import _createObjectByType
import sys
from osgeo import ogr
import string


class SaveShpFile(BrowserView):
    """
    """
    
    template = ViewPageTemplateFile('templates/save_shp_file.pt')
    
    def __call__(self):
        """
        """    
        self.writePolylineShapeFile()
        self.writePointShapeFile();
        return self.template()
        
    def __init__(self, context, request):
        """
        """
        super(BrowserView, self).__init__(context, request)
        
        try:
            self.data_dict = eval(self.getValues())
        except SyntaxError:
            self.data_dict = {}
    
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
    
    
    
    def getCoord(self, n=0, type="good"):
        return self.data_dict.get("%s-coord%d" % (type,n),"")
    
    def getText(self, n=0, type="good"):
        return self.data_dict.get("%s-text%d" % (type,n),"")
    
    def getDrop(self, n=0, type="good"):
        return self.data_dict.get("%s-dropt%d" % (type,n),"")
    
        
    def writePolylineShapeFile(self):
        raw_polyline = self.data_dict.get("polyline",'')
        
        filename = "/Users/bsnizek/Desktop/%s-poly.shp" % self.context.id 
        
        driverName = "ESRI Shapefile"
        drv = ogr.GetDriverByName( driverName )
        drv.DeleteDataSource(filename)
        
        if drv is None:
            print "%s driver not available.\n" % driverName    
        ds = drv.CreateDataSource( filename)
        
        lyr = ds.CreateLayer( "point_out", None, ogr.wkbLineString )
        if lyr is None:
            print "Layer creation failed.\n"
        
        feat = ogr.Feature( feature_def=lyr.GetLayerDefn())
        
        coord_pairs = raw_polyline.split(";")
        
        coord_pairs = [f.split(",") for f in coord_pairs]
        
        line = ogr.Geometry(type=ogr.wkbLineString)
        
        for p in coord_pairs:
            
            try:
                x = string.atof(p[0])
                y = string.atof(p[1])
                
                line.AddPoint(x, y)
                print "point added"
            except:
                print "something went wrong"
        
        feat.SetGeometryDirectly(line)
        lyr.CreateFeature(feat)
        feat.Destroy()
           
        
    def writePointShapeFile(self):
        driverName = "ESRI Shapefile"
        drv = ogr.GetDriverByName( driverName )
        if drv is None:
            print "%s driver not available.\n" % driverName
        
        filename = "/Users/bsnizek/Desktop/%s-points.shp" % self.context.id 
        drv.DeleteDataSource(filename)
            
        ds = drv.CreateDataSource( filename)
        if ds is None:
            print "Creation of output file failed.\n"

        lyr = ds.CreateLayer( "point_out", None, ogr.wkbPoint )
        if lyr is None:
            print "Layer creation failed.\n"
            sys.exit( 1 )
        
        field_defn = ogr.FieldDefn( "type", ogr.OFTString )
        field_defn.SetWidth( 4)
        
        if lyr.CreateField ( field_defn ) != 0:
            print "Creating Name field failed.\n"

        field_defn = ogr.FieldDefn( "text", ogr.OFTString )
        field_defn.SetWidth( 128 )
        
        if lyr.CreateField ( field_defn ) != 0:
            print "Creating Name field failed.\n"            

        field_defn = ogr.FieldDefn( "dropdown", ogr.OFTString )
        field_defn.SetWidth( 32 )
        
        if lyr.CreateField ( field_defn ) != 0:
            print "Creating Name field failed.\n"
        
        for type in ["good","bad"]:
            for n in [0,1,2]:
                coords = self.getCoord(n=n, type=type)
                if coords != '':
                    
                    coords = coords.split(",")
                    coords = [string.atof(x) for x in coords]
                    x = coords[0]
                    y = coords[1]
                    pt = ogr.Geometry(ogr.wkbPoint)
                    feat = ogr.Feature( lyr.GetLayerDefn())
                    feat.SetField( "type" , type )
                    feat.SetField( "text" , self.getText(n=n, type=type))
                    feat.SetField( "dropdown", self.getDrop(n=n, type=type))
                    pt.SetPoint_2D(0, x, y)
                    feat.SetGeometryDirectly(pt)
                    lyr.CreateFeature(feat)
                    feat.Destroy()
           
            

        