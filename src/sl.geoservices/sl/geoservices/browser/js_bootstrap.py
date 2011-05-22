# -*- coding: utf-8 -*-

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


     
class JSBootstrap(BrowserView):
    """
    """  

    template = ViewPageTemplateFile('templates/js_bootstrap.pt')
    
    def __call__(self):
        """
        """    
        return self.template()
    
    def getGOODString(self):
        """
        """
        atvm = self.getATVM()
        
        good = atvm.getVocabularyByName("good")
        vd = good.getVocabularyLines()
        vd.reverse()
        gs = ""
        for v in vd:
            s = "['%s','%s']" % (v[0],v[1])
            gs = gs + "%s," % s

        return "var GOOD_GROUP_VALUES = [%s];" % gs
        
    def getBADString(self):
        """
        """
        return "var BAD_GROUP_VALUES = [];"
    
    def getATVM(self):
        return getSite().get("portal_vocabularies")
    
    def getGeoTool(self):
        return getSite().get("geo_tool", None)
    
    def getGOODMarkers(self):
        nfg = self.getGeoTool().getNumberOfGood()
        s = "var GOOD_markers = ["
        for n in range(nfg):
            s = s + "null,"
        s = s + "];"
        return s
    
    def getBADMarkers(self):
        nfg = self.getGeoTool().getNumberOfBad()
        s = "var BAD_markers = ["
        for n in range(nfg):
            s = s + "null,"
        s = s + "];"
        return s
    
    def getMapCenterLAT(self):
        return "MAPCENTERLAT = 55.684166;"
    
    def getMapCenterLON(self):
        return "MAPCENTERLON = 12.544606;"
    
    def getMapZoomFactor(self):
        return "MAPZOOMFACTOR = 12;"
            
    def GetPolyLineColour(self):
        return """POLYLINECOLOUR = "#3355FF";"""
        
        