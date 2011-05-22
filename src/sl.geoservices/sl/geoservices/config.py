from Products.CMFCore import permissions
from Products.Archetypes.public import DisplayList

ADD_CONTENT_PERMISSION = permissions.AddPortalContent
VIEW_CONTENTS_PERMISSION = permissions.View
PROJECTNAME = "sl.geoservices"
SKINS_DIR = 'skins'
ADD_PERMISSIONS = {
                  "Measurement"   : "sl.geoservices:Measurement",
                  "Investigation" : "sl.geoservices:Investigation"}

VIEWLETS = []

LINK_TYPES = []

GLOBALS = globals()


