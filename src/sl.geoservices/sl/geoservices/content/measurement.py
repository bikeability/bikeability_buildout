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
from AccessControl import ClassSecurityInfo
from Products.ATContentTypes.interface import IATFolder
from Products.Archetypes import atapi
from Products.Archetypes.public import BaseContent, registerType, BaseSchema, \
    Schema, ImageField, ImageWidget, StringField, StringWidget, TextField, \
    TextAreaWidget
from Products.CMFCore import permissions
from sl.geoservices.config import PROJECTNAME
from sl.geoservices.content.interfaces import IMeasurement

try:
    from Products.LinguaPlone.I18NBaseObject import I18NBaseObject
    print "Linguaplone found !!"
except:
    class I18NBaseObject(object):
        """A dummy class if Linguaplone is not here
        """
            
        __implements__ = ()
             
        def manage_beforeDelete(self, item, container):
            pass


measurementschema = BaseSchema +  Schema((
                    
                    StringField('respondentid',
                                index='FieldIndex:Schema',
                                
                                widget=StringWidget(label='The respondentid',
                                                  label_msgid='respondentid',
                                                  description='The respondentid',
                                                  description_msgid='desc_respondentid',
                                                  i18n_domain='sl.geoservices'),),   
                    
                    StringField('measurement',
                                index='FieldIndex:Schema',
                                
                                widget=StringWidget(label='The measurement',
                                                  label_msgid='measurement',
                                                  description='The measurement',
                                                  description_msgid='desc_measurement',
                                                  i18n_domain='sl.geoservices'),),   
                              ))

class Measurement(I18NBaseObject, BaseContent):
    """The measurement
    """
    
    I18NBaseObject
    
    schema = measurementschema
    meta_type = 'Measurement'
    archetype_name = 'Measurement'
    _at_rename_after_creation = True    
    content_icon = 'measurement_icon.png'
    immediate_view = 'base_edit'
    default_view   = 'measurement_view'
    global_allow = False
    
    actions = ({
        'id': 'view',
        'name': 'View',
        'action': 'string:${object_url}',
        'permissions': (permissions.View,)
        },)
    aliases = {
        '(Default)'  : 'spotlight_view',
        'view'       : 'spotlight_view',
        'index.html' : '',
        'edit'       : 'base_edit',
        'properties' : 'base_metadata',
        'sharing'    : 'folder_localrole_form',
        'gethtml'    : '',
        'mkdir'      : '',
        }

registerType(Measurement, PROJECTNAME)