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
from Products.CMFCore.utils import UniqueObject
from OFS.SimpleItem import SimpleItem
from Globals import InitializeClass
from AccessControl import ClassSecurityInfo
from zope.component import getUtility
from zope.interface import implements
from sl.geoservices.interfaces import IGEOTool
from Products.PageTemplates.PageTemplateFile import PageTemplateFile
from Products.CMFCore.permissions import ManagePortal
from sl.geoservices.content import Investigation 
from Products.CMFPlone.PloneBaseTool import PloneBaseTool
from OFS.Folder import Folder
from Products.CMFCore.utils import registerToolInterface

class GEOTool(PloneBaseTool, Folder, UniqueObject, SimpleItem):
    """The GEO Tool
    """

    id  = 'geo_tool'
    toolicon = 'skins/plone_images/topic_icon.png'  
    title = 'GEO Tool'
    meta_type = 'GEO Tool'
    meta_types = ((
        {'name': 'GEO Services Investigation',
         'action': 'manage_addInvestigationForm'},
        ))
    
    
    implements(IGEOTool)
        
    isPrincipiaFolderish = True # Show up in the ZMI
    
    security = ClassSecurityInfo()
    
    manage_options=(
        ({ 'label'  : 'GEOToolConfig',
           'action' : 'manage_configForm',
           },
         ) + SimpleItem.manage_options
        )
    
    
    manage_addInvestigationForm = PageTemplateFile('www/addInvestigation',
                                                   globals())

    security.declareProtected(ManagePortal, 'addInvestigation')
    def addInvestigation(self, id, title='', investigation=None):
        """ Add a new Investigation
        """
        o = Investigation(id, title)

        # copy the propertysheet values onto the new instance
        # if investigation is not None:
#            if not hasattr(investigation, 'propertyIds'):
#                raise TypeError, 'investigation needs to be a investigation'
#
#            for investigation in propertysheet.propertyMap():
#                pid=property.get('id')
#                ptype=property.get('type')
#                pvalue=propertysheet.getProperty(pid)
#                if not hasattr(o, pid):
#                    o._setProperty(pid, pvalue, ptype)

        self._setObject(id, o)
    
    
    security.declareProtected(ManagePortal, 'manage_addInvestigation')
    def manage_addInvestigation(self, id, title='',
                                investigation=None, REQUEST=None):
        """ Add a instance of a Property Sheet if handed a
        propertysheet put the properties into new propertysheet.
        """
        self.addInvestigation(id, title, investigation)

        if REQUEST is not None:
            return self.manage_main()
   
#    manage_configForm = PageTemplateFile('www/geo_tool_config', globals())
    
    ## The attributes come her 
    
    number_of_good = 3
    number_of_bad = 3
    
    def __init__(self):
        self.id = 'geo_tool'
    
    security.declareProtected(ManagePortal, 'manage_setGEOToolSettings')
    def manage_setGEOToolSettings(self, canoncial_story_of_the_day_UID,
                              REQUEST=None):
        """Stores the tool settings."""
        
        self.canoncial_story_of_the_day_UID = canoncial_story_of_the_day_UID
        
        if REQUEST:
            REQUEST.RESPONSE.redirect(REQUEST['HTTP_REFERER'])
    
    
        
    def getNumberOfGood(self):
        return self.number_of_good
        
    def getNumberOfBad(self):
        return self.number_of_bad
    
    GEOTool.__doc__ = BaseTool.__doc__
        
InitializeClass(GEOTool)
registerToolInterface('geo_tool', IGEOTool)