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
from Products.Archetypes.public import BaseSchema, Schema
from Products.Archetypes.public import StringField, StringWidget
from Products.Archetypes.public import TextField, TextAreaWidget
from Products.Archetypes.public import ImageField, ImageWidget
from Products.Archetypes.public import BaseContent, registerType
from Products.CMFCore import permissions
from config import PROJECTNAME

measurementschema = BaseSchema +  Schema((
                    
                    StringField('respondentid',
                                index='FieldIndex:Schema',
                                
                                widget=StringWidget(label='The respondentid',
                                                  label_msgid='respondentid',
                                                  description='The respondentid',
                                                  description_msgid='desc_respondentid',
                                                  i18n_domain='sl.geodialogues'),),   
                    
                    StringField('measurement',
                                index='FieldIndex:Schema',
                                
                                widget=StringWidget(label='The measurement',
                                                  label_msgid='measurement',
                                                  description='The measurement',
                                                  description_msgid='desc_measurement',
                                                  i18n_domain='sl.geodialogues'),),   
                              ))

class Measurement(BaseContent):
    """The measurement
    """
    schema = measurementschema
    meta_type = 'Link'
    archetype_name = 'Measurement'
    _at_rename_after_creation = True    
    # content_icon = 'spotlight_icon.png'
    immediate_view = 'base_edit'
    # default_view   = 'spotlight_view'
    global_allow = True
    
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