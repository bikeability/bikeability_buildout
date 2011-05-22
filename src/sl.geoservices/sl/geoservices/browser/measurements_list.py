from Products.Five import BrowserView
from plone.memoize.view import memoize
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from zope.app.component.hooks import getSite
from config import BATCH_SIZE, BATCH_PAGERANGE
     
class MeasurementView(BrowserView):
    """
    """  

    template = ViewPageTemplateFile('templates/measurements_list.pt')
    
    def __call__(self):
        """
        """    
        # super(BrowserView, self).__call__()
        return self.template()

    
    def __init__(self, context, request):
        super(BrowserView, self).__init__(context, request)
        self.context = context
        self.request = request


    def batch(self):
        return Batch(self.results(), BATCH_SIZE, int(self.b_start), orphan=1, pagerange=BATCH_PAGERANGE)
        
    def results(self):
        query = {'portal_type':['Measurement'],
                'Language' : self.lang,
                'sort_on' : 'heritage_since',
                'sort_order' :   'ascending',
                }
        return getToolByName(getSite(),'portal_catalog')(query)