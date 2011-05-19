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
from sl.geodialogues.interfaces import IGEOTool
from Products.PageTemplates.PageTemplateFile import PageTemplateFile
from Products.CMFCore.permissions import ManagePortal

class GEOTool(UniqueObject, SimpleItem):
    """The GEO Tool
    """

    id  = 'geo_tool'
    title = 'GEO Tool'
    meta_type = 'GEO Tool'

    implements(IGEOTool)

    security = ClassSecurityInfo()
    
    manage_options=(
        ({ 'label'  : 'GEOToolConfig',
           'action' : 'manage_configForm',
           },
         ) + SimpleItem.manage_options
        )
    
    manage_configForm = PageTemplateFile('www/geo_tool_config', globals())
    
    ## The attributes come her 
    canoncial_story_of_the_day_UID = ""
    
    
    security.declareProtected(ManagePortal, 'manage_setGEOToolSettings')
    def manage_setGEOToolSettings(self, canoncial_story_of_the_day_UID,
                              REQUEST=None):
        """Stores the tool settings."""
        
        self.canoncial_story_of_the_day_UID = canoncial_story_of_the_day_UID
        
        if REQUEST:
            REQUEST.RESPONSE.redirect(REQUEST['HTTP_REFERER'])
    
    def __init__(self):
        self.id = 'geo_tool'
        
        
InitializeClass(GEOTool)