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