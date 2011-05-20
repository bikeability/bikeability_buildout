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

from zope.app.component.hooks import getSite


GOODS = [("None", u"Vælg"),
         ('god_sti_bel',u"God cykelsti/bel&aelig;gning"),
         ('god_cykel_park',u'God cykelparkering'),
         ('smuk_groen_omgiv',u'Smukke, gr&oslash;nne omgivelser'),
         ('god_fremk',u'God fremkommelighed, f&aring; stops'),
         ('ned_bakke', u'Det g&aring;r ned ad bakke'),
         ('god_udsigt',u'God udsigt'),
         ('mulighed_koere_staerkt', u'Mulighed for at k&oslash;re st&aelig;rkt'),
         ('andre_cyklister',u'Andre cyklister'),
         ('andre_cyklister_smiler',u'Andre cyklister, der smiler'),
         ('andet',u'Andet'),]

BADS = [('0','V&aelig;lg'),
                        ('farligt_kryds','Farligt kryds'),
                        ('larm_forurening','Larm/forurening'),
                        ('vejarbejde','Vejarbejde'),
                        ('fordg_pa_cykelsti','Fodg&aelig;ngere p&aring; cykelstien/vejbanen'),
                        ('biler_taet_paa','Biler, busser og lastbiler t&aelig;t p&aring;'),
                        ('manglende_cykelpark','Manglende cykelparkering'),
                        ('daarlig_beleagn','D&aring;rlig bel&aelig;gning/huller i asfalten'),
                        ('biler_parkeret','Biler mm. parkeret p&aring; cykelstien'),
                        ('op_ad_bakke','Det g&aring;r op ad bakke'),
                        ('andre_cyk','Andre cyklister'),
                        ('andre_cyk_raaber','Andre cyklister, der r&aring;ber/sk&aeliglder ud'),
                        ('for_mange_andre','For mange andre cyklister'),
                        ('andet','Andet')
                        ];


def setupVarious(context):

    # Ordinarily, GenericSetup handlers check for the existence of XML files.
    # Here, we are not parsing an XML file, but we use this text file as a
    # flag to check that we actually meant for this import step to be run.
    # The file is found in profiles/default.

    if context.readDataFile('sl.geodialogues_various.txt') is None:
        return

    # Add additional setup code here
    
def setupVocabs(context):
    """"
    """
    atvm = getSite().get("portal_vocabularies", None)
    if atvm:
        if not atvm.get("good", None):
            atvm.invokeFactory('SimpleVocabulary','good')
            atvm.good.setTitle('The Good')    
            good = atvm.good
            for good_item in GOODS:
                good.addTerm(good_item[0], good_item[1])
        
        if not atvm.get("bad", None):    
            atvm.invokeFactory('SimpleVocabulary','bad')
            atvm.bad.setTitle('The Bad')    
            bad = atvm.bad
            for bad_item in BADS:
                bad.addTerm(bad_item[0], bad_item[1])