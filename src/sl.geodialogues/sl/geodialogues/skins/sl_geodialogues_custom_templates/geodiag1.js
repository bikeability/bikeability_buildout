/**
 * @author Bernhard Snizek
 * 
 * view-source:http://gmaps-samples.googlecode.com/svn/trunk/poly/mymapstoolbar.html
 * http://gmaps-samples.googlecode.com/svn/trunk/poly/mymapstoolbar.html
 * 
 * view-source:file://localhost/Users/bsnizek/Downloads/poly2csv%20(1).htm
 * http://apitricks.blogspot.com/2008/10/polyline-editor-csv-output.html
 * 
 * 
 */

var map = null;
var poly = null;
var options = {};

var googleListener = null;
var googleListener2 = null;
var ONE_ACTIVE = false;
var TWO_ACTIVE = false; 
var THREE_ACTIVE = false;
var FOUR_ACTIVE = false;

var GOOD_COUNTER = 1;
var BAD_COUNTER = 1;
var MAX_GOOD_AND_BADS = 3;

var colorIndex_ = 0;
 
var COLORS = [["red", "#ff0000"], ["orange", "#ff8800"], ["green","#008000"],
              ["blue", "#000080"], ["purple", "#800080"]];

var markerCounter_ = 0;
var myEventListener = null;

var GOOD_markers = [];
var BAD_markers = [];

function addFeatureEntry(name, color) {
/*  currentRow_ = document.createElement("tr");
  var colorCell = document.createElement("td");
  currentRow_.appendChild(colorCell);
  colorCell.style.backgroundColor = color;
  colorCell.style.width = "1em";
  var nameCell = document.createElement("td");
  currentRow_.appendChild(nameCell);
  nameCell.innerHTML = name;
  var descriptionCell = document.createElement("td");
  currentRow_.appendChild(descriptionCell);
  featureTable_.appendChild(currentRow_);
  return {desc: descriptionCell, color: colorCell};
  */
  activateTwo();
  return null;
}
 

function initializeNoMarkerSetDlg() {
	jq("#no-marker-set").dialog({ autoOpen: false });		
}


function updateMarker(marker, cells, opt_changeColor) {
  if (opt_changeColor) {
    var color = getColor(true);
    marker.setImage(getIcon(color).image);
    // cells.color.style.backgroundColor = color;
  }
	/* var latlng = marker.getPoint();
	 	cells.desc.innerHTML = "(" + Math.round(latlng.y * 100) / 100 + ", " +
		Math.round(latlng.x * 100) / 100 + ")";
	*/
}

function initializeGoogleMap() {
	
	jq("button").button();
	
	
	if (GBrowserIsCompatible()) {
	    map = new GMap2(document.getElementById("map"));
	    map.setCenter(new GLatLng(55.684166, 12.544606 ), 13);
	    map.addControl(new GSmallMapControl());
	    map.addControl(new GMapTypeControl());
	    map.clearOverlays();
	    gdir = new GDirections();
		
		var color = "#ff0000";
		options = {};
	
		
		poly = new GPolyline([], color);
		map.addOverlay(poly);
		
		poly.enableDrawing(options);
		poly.enableEditing({onEvent: "mouseover"});
		poly.disableEditing({onEvent: "mouseout"});
		
		googleListener = GEvent.addListener(poly, "endline", function() {
			var cells = addFeatureEntry(name, color);
			
			// GEvent.bind(poly, "lineupdated", cells.desc, onUpdate);
			googleListener2 = GEvent.addListener(poly, "click", function(latlng, index) {
				if (typeof index === "number") {
					poly.deleteVertex(index);
		        } else {
					var newColor = getColor(false);
					cells.color.style.backgroundColor = newColor;
					poly.setStrokeStyle({color: newColor, weight: 4});
				}
			});
		}); 
	}
	activateOne();
}
 
 /*
  * daw
  */
function drawRoute(){
  map.clearOverlays();
  updateListener = null;
  poly = gdir.getPolyline();
  var vert = poly.getVertexCount();
  var permission = true;
  if(vert>100) {permission = confirm(vert + " points are not editable but I can draw it.");}
  if(!permission) {return; }
  if(vert>1000) {permission = confirm(vert + " points is much. Are you really serious?");}
  if(!permission) {return; }
  if(vert>10000) {permission = confirm(vert + " points. This is your last change. Proceed?");}
  if(permission){
    map.addOverlay(poly);
    setListener(poly);
    map.fit(poly.getBounds(), true);
    listPoly();
  }
}

function select(x) {
	//alert(x);
}


 /*
  * buildAddGoodHTML(x)
  * 
  * x : a JQ node
  * 
  */
  
function buildOKButton(ID) {
	if (ID<=(MAX_GOOD_AND_BADS-1)) {
		return '<button id="ok-' + ID +  '"></button>';
	}
	else {
		return "Ikke flere steder, tak.";
	}
}

/*
 * saveData() 
 * 
 * Saves the data to the webservice. 
 * 
 */

function saveData() {
	
	jq("#wheel").css("background-image",'url(ajax-wheel.gif)');
	
	var number_of_verteces = poly.getVertexCount();
	var i=0;
	var POLY_SERIALIZED = "";
	
	for (i=0;i<=number_of_verteces-1;i++) {
		var node = poly.getVertex(i);
		POLY_SERIALIZED = POLY_SERIALIZED + node.lat() + "," + node.lng() + ";"; 
		
	}
	jq("#polygon").val(POLY_SERIALIZED);
	
	var GOOD_MARKERS_SERIALIZED ='';
	var j=0;
	for (j=0;j<=(GOOD_markers.length-1);j++) {
		var ltlng = GOOD_markers[j].getLatLng();
		GOOD_MARKERS_SERIALIZED = GOOD_MARKERS_SERIALIZED + ltlng.lat() + "," + ltlng.lng() + ";";
	}
	
	jq("#good_markers").val(GOOD_MARKERS_SERIALIZED);
	
	var BAD_MARKERS_SERIALIZED ='';
	var j=0;
	for (j=0;j<=(BAD_markers.length-1);j++) {
		var ltlng = BAD_markers[j].getLatLng();
		BAD_MARKERS_SERIALIZED = BAD_MARKERS_SERIALIZED + ltlng.lat() + "," + ltlng.lng() + ";";
	}
	
	jq("#bad_markers").val(BAD_MARKERS_SERIALIZED);
	
	var serialized = jq("form").serialize();
	var URL = PORTAL_URL + "dlg1_save?" + serialized + "&respondentid=" + RESPONDENTID; 
	
	jq.ajax({
		url: URL,
		context: document.body,
		success: function(){
			jq("#wheel").css("background-image",'');
			// alert("saved");
			}
	});
	
}	
  
function buildAddGoodHTML(x) {
	if (GOOD_COUNTER<= MAX_GOOD_AND_BADS) {
		jq('<div class="inserted-option-box" id="gc-' + GOOD_COUNTER + '"><div class="addbox-label">Type: </div><div class="addbox"><div class="">' + getGoodDropBox(GOOD_COUNTER) + '</div></div><div><div class="addbox-label"> Kommentar:</div><textarea rows="3" cols="20"></textarea> <div id="ok-2-1"> ' + buildOKButton(GOOD_COUNTER) + '</div><div id="clear-' + GOOD_COUNTER + '" style="clear:both"></div>').insertBefore(x);
		var b_id = "#ok-" + GOOD_COUNTER;
		var xx = "#clear-" + String(GOOD_COUNTER); 
		jq(b_id).button({icons: {primary:'ui-icon-circle-check'}, text: false});
		jq(b_id).click(function() {
			// alert("!xxxx");	
			// alert(markers.length +"/" + GOOD_COUNTER-1);
			if (GOOD_markers.length === GOOD_COUNTER-1) {
				buildAddGoodHTML(xx);
				jq(xx).css("border-bottom","1px dotted");
				return false; 
			} else {
				/* DU MANGLER AT SAETTE PUNKTET PAA KORTET */
				jq("#no-marker-set").dialog("open");
				return false;
			}
		});
		GOOD_COUNTER = GOOD_COUNTER + 1;
	}
}

function buildAddBadHTML(x) {
	if (BAD_COUNTER<= MAX_GOOD_AND_BADS) {
		jq('<div class="inserted-option-box" id="gc-' + BAD_COUNTER + '"><div class="addbox-label">Type: </div><div class="addbox"><div class="">' + getBadDropBox(BAD_COUNTER) + '</div></div><div><div class="addbox-label"> Kommentar:</div><textarea rows="3" cols="20"></textarea> <div id="ok-3-1"> ' + buildOKButton(BAD_COUNTER) + '</div><div id="clear-' + BAD_COUNTER + '" style="clear:both"></div>').insertBefore(x);
		var b_id = "#ok-" + BAD_COUNTER;
		var xx = "#clear-" + String(BAD_COUNTER); 
		jq(b_id).button({icons: {primary:'ui-icon-circle-check'}, text: false});
		jq(b_id).click(function() {
			// alert("!xxxx");	
			// alert(markers.length +"/" + BAD_COUNTER-1);
			if (BAD_markers.length === BAD_COUNTER-1) {
				buildAddBadHTML(xx);
				jq(xx).css("border-bottom","1px dotted");
				return false; 
			} else {
				/* DU MANGLER AT SAETTE PUNKTET PAA KORTET */
				jq("#no-marker-set").dialog("open");
				return false;
			}
		});
		BAD_COUNTER = BAD_COUNTER + 1;
	}
}
 
function OkClicked(ok_id) {
	// alert(ok_id);	
}
 
function getGoodDropBox(c) {
	/* get Options dynamically */
	return '<select name="go-' + c + '"><option value="option1">Option 1</option><option value="option2">Option 2</option></select>';
}

function getBadDropBox(c) {
	/* get Options dynamically */
	return '<select name="bo-' + c + '"><option value="option1">Option 1</option><option value="option2">Option 2</option></select>';
}
 
function activateOne() {
	ONE_ACTIVE = true;
	deactivateTwo();
	deactivateThree();
	jq("#b1").css("background-image",'url(dot-red.png)');
	jq("#wrapper-1").css("background-color","red");

} 
 
function deactivateOne() {
	ONE_ACTIVE = false;
	GEvent.clearListeners(poly, "endline");
	poly.disableEditing();
	jq("#wrapper-1").css("background-color","grey");	
	jq("#b1").css("background-image",'url(dot-grey.png)');
}
 
function activateTwo() {
	TWO_ACTIVE = true;
	deactivateThree();
	deactivateOne();
	jq("#wrapper-2").css("background-color","#FF0000");
	jq("#button-2").unbind();
 	buildAddGoodHTML("#injector-area-2"); 
 	saveData();
	placeGoodMarker();
}
 
 
function deactivateTwo() {
	TWO_ACTIVE = false;
	jq("#wrapper-2").css("background-color","grey");	
	// jq("#b2").css("background-image",'url(dot-grey.png)');
}

function activateThree() {
	THREE_ACTIVE = true;
	deactivateTwo();
	deactivateOne();
	jq("#wrapper-3").css("background-color","#FF0000");
	buildAddBadHTML("#injector-area-3");
	saveData()
	placeBadMarker();
}

function deactivateThree() {
	THREE_ACTIVE = false;
} 
 
function getColor(named) {
	return COLORS[(colorIndex_++) % COLORS.length][named ? 0 : 1];
}

 
function getIcon(color) {
	var icon = new GIcon();
	icon.image = "http://google.com/mapfiles/ms/micons/" + color + ".png";
	icon.iconSize = new GSize(32, 32);
	icon.iconAnchor = new GPoint(15, 32);
	return icon;
}

function stopEditing() {
	select("hand_b");
}

function initializeButtons() {
 	
	jq("button").button({ icons: {primary:'ui-icon-circle-check'},text: false });
 	
 	jq("#button-1").bind("click", function() {
 		
 		jq("#button-1").unbind();
 		jq("#b1-ok").bind("click", function() {
 			// alert("ok clicked");
 			jq("#text1").css("background-color","grey");	
 		});
 	});
 	
 	
 	jq("#button-2").bind("click", function() {
 		jq("#button-2").unbind();
 		activateTwo();
 		
 				
 	});

 	jq("#button-3").bind("click", function() {
 		jq("#button-3").unbind();
	 	activateThree();
	});
}

function switchOffMarker() {
	GEvent.removeListener(myEventListener);
}

/*
 * placeMarker()
 * 
 * Switches on the place marker functionality
 */
function placeGoodMarker() {
  jq("#map img").css("cursor","crosshair");
  if (GOOD_markers.length < GOOD_COUNTER) {
	  myEventListener = GEvent.addListener(map, "click", function(overlay, latlng) {
	  if (latlng) {
	  	  if (GOOD_markers.length < GOOD_COUNTER-1) {
		      GEvent.removeListener(myEventListener);
		      myEventListener = null;
		      var color = getColor(true);
		      var marker = new GMarker(latlng, {icon: getIcon(color), draggable: true});
		      map.addOverlay(marker);
		      GOOD_markers.push(marker);
		      saveData();
		      var cells = addFeatureEntry("Placemark " + (++markerCounter_), color);
		      updateMarker(marker, cells);
		      GEvent.addListener(marker, "dragend", function() {
		        updateMarker(marker, cells);
		      });
		      GEvent.addListener(marker, "click", function() {
		        updateMarker(marker, cells, true);
		      });
		    } else {
		    	jq("#map image").css('cursor' , 'wait');
			}
	  	} 
	  });
  } else {
  	// alert("[TODO] klik paa plus t.h.");
  }
}


/*
 * placeBadMarker()
 * 
 * Switches on the place marker functionality
 */
function placeBadMarker() {
  jq("#map img").css("cursor","crosshair");
  if (BAD_markers.length < BAD_COUNTER) {
	  myEventListener = GEvent.addListener(map, "click", function(overlay, latlng) {
	  if (latlng) {
	  	  if (BAD_markers.length < BAD_COUNTER-1) {
		      GEvent.removeListener(myEventListener);
		      myEventListener = null;
		      var color = getColor(true);
		      var marker = new GMarker(latlng, {icon: getIcon(color), draggable: true});
		      map.addOverlay(marker);
		      BAD_markers.push(marker);
		      saveData();
		      var cells = addFeatureEntry("Placemark " + (++markerCounter_), color);
		      updateMarker(marker, cells);
		      GEvent.addListener(marker, "dragend", function() {
		        updateMarker(marker, cells);
		      });
		      GEvent.addListener(marker, "click", function() {
		        updateMarker(marker, cells, true);
		      });
		    } else {
		    	jq("#map image").css('cursor' , 'wait');
			}
	  	} 
	  });
  } else {
  	// alert("[TODO] klik paa plus t.h.");
  }
}