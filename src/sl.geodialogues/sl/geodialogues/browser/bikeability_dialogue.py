from Products.Five import BrowserView
from plone.memoize.view import memoize
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from zope.app.component.hooks import getSite
import transaction

class BikeabilityDialogue1(BrowserView):
    """
    """
    
    template = ViewPageTemplateFile('templates/dlg1.pt')
    
    def __call__(self):
        """
        """    
        print "xxx"   
        # super(BrowserView, self).__call__()
        return self.template()
        
    def __init__(self, context, request):
        """
        """
        super(BrowserView, self).__init__(context, request)
        
        
class BikeabilityDialogue1Save(BrowserView):
    """
    """  
    
    def __init__(self, context, request):
        self.context = context
        self.request = request

    
    def __call__(self):
        self.request.response.setHeader('Content-Type', 'application/json; charset=utf-8')
        form = self.request.form
        print form
        
        site = getSite()
        
        respondentid = form.get("respondentid","NULL")
        
        values = {'respondentid':respondentid, 
                  'measurement' : str(form)}
        
        
        if respondentid in getSite().keys():
            print "updating " + respondentid
            new_object = getSite()[respondentid]
        else:
            print "New object"
            objid = site.invokeFactory("Measurement", respondentid)
            new_object = site[objid]
        
        new_object.processForm(metadata=1, values=values)
        transaction.commit()