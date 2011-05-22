/**
 * @author Bernhard Snizek
 * 
 * view-source:http://www.ekelschot.eu/demo/maps/enableEditing.html
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

var GOOD_COUNTER = 0;
var BAD_COUNTER = 0;
var MAX_GOOD_AND_BADS = 3;

var colorIndex_ = 0;
 
var COLORS = [["red", "#ff0000"], ["orange", "#ff8800"], ["green","#008000"],
              ["blue", "#000080"], ["purple", "#800080"]];

var markerCounter_ = 0;
var myEventListener = null;

var GOOD_markers = [];
var BAD_markers = [];
var GOOD_marker_html = [];
var GOOD_texts = ["","",""];
var html = "";
var path = "";

var polyLine = null;
var tmpPolyLine = null;
var markers = [];
var vmarkers = [];
var g = null;

 
// =============================================
 function mapLeftClick(event) {
	if (event.latLng) {
		var marker = createMarker(event.latLng);
		markers.push(marker);
		if (markers.length != 1) {
			var vmarker = createVMarker(event.latLng);
			vmarkers.push(vmarker);
			vmarker = null;
		}
		var path = polyLine.getPath();
		path.push(event.latLng);
		marker = null;
	}
	event = null;
};
			
	function createMarker(point) {
				var imageNormal = new g.MarkerImage(
					"square.png",
					new g.Size(11, 11),
					new g.Point(0, 0),
					new g.Point(6, 6)
				);
				var imageHover = new g.MarkerImage(
					"square_over.png",
					new g.Size(11, 11),
					new g.Point(0, 0),
					new g.Point(6, 6)
				);
				var marker = new g.Marker({
					position: point,
					map: map,
					icon: imageNormal,
					draggable: true
				});
				g.event.addListener(marker, "mouseover", function() {
					marker.setIcon(imageHover);
				});
				g.event.addListener(marker, "mouseout", function() {
					marker.setIcon(imageNormal);
				});
				g.event.addListener(marker, "drag", function() {
					for (var m = 0; m < markers.length; m++) {
						if (markers[m] == marker) {
							polyLine.getPath().setAt(m, marker.getPosition());
							moveVMarker(m);
							break;
						}
					}
					m = null;
				});
				g.event.addListener(marker, "click", function() {
					for (var m = 0; m < markers.length; m++) {
						if (markers[m] == marker) {
							marker.setMap(null);
							markers.splice(m, 1);
							polyLine.getPath().removeAt(m);
							removeVMarkers(m);
							updatePolyLineField();
							break;
						}
					}
					m = null;
				});
				updatePolyLineField();
				return marker;
			};
			
	function createVMarker(point) {
				var prevpoint = markers[markers.length-2].getPosition();
				var imageNormal = new g.MarkerImage(
					"square_transparent.png",
					new g.Size(11, 11),
					new g.Point(0, 0),
					new g.Point(6, 6)
				);
				var imageHover = new g.MarkerImage(
					"square_transparent_over.png",
					new g.Size(11, 11),
					new g.Point(0, 0),
					new g.Point(6, 6)
				);
				var marker = new g.Marker({
					position: new g.LatLng(
						point.lat() - (0.5 * (point.lat() - prevpoint.lat())),
						point.lng() - (0.5 * (point.lng() - prevpoint.lng()))
					),
					map: map,
					icon: imageNormal,
					draggable: true
				});
				g.event.addListener(marker, "mouseover", function() {
					marker.setIcon(imageHover);
				});
				g.event.addListener(marker, "mouseout", function() {
					marker.setIcon(imageNormal);
				});
				g.event.addListener(marker, "dragstart", function() {
					for (var m = 0; m < vmarkers.length; m++) {
						if (vmarkers[m] == marker) {
							var tmpPath = tmpPolyLine.getPath();
							tmpPath.push(markers[m].getPosition());
							tmpPath.push(vmarkers[m].getPosition());
							tmpPath.push(markers[m+1].getPosition());
							break;
						}
					}
					m = null;
				});
				g.event.addListener(marker, "drag", function() {
					for (var m = 0; m < vmarkers.length; m++) {
						if (vmarkers[m] == marker) {
							tmpPolyLine.getPath().setAt(1, marker.getPosition());
							break;
						}
					}
					m = null;
				});
				g.event.addListener(marker, "dragend", function() {
					for (var m = 0; m < vmarkers.length; m++) {
						if (vmarkers[m] == marker) {
							var newpos = marker.getPosition();
							var startMarkerPos = markers[m].getPosition();
							var firstVPos = new g.LatLng(
								newpos.lat() - (0.5 * (newpos.lat() - startMarkerPos.lat())),
								newpos.lng() - (0.5 * (newpos.lng() - startMarkerPos.lng()))
							);
							var endMarkerPos = markers[m+1].getPosition();
							var secondVPos = new g.LatLng(
								newpos.lat() - (0.5 * (newpos.lat() - endMarkerPos.lat())),
								newpos.lng() - (0.5 * (newpos.lng() - endMarkerPos.lng()))
							);
							var newVMarker = createVMarker(secondVPos);
							newVMarker.setPosition(secondVPos);//apply the correct position to the vmarker
							var newMarker = createMarker(newpos);
							markers.splice(m+1, 0, newMarker);
							polyLine.getPath().insertAt(m+1, newpos);
							marker.setPosition(firstVPos);
							vmarkers.splice(m+1, 0, newVMarker);
							tmpPolyLine.getPath().removeAt(2);
							tmpPolyLine.getPath().removeAt(1);
							tmpPolyLine.getPath().removeAt(0);
							newpos = null;
							startMarkerPos = null;
							firstVPos = null;
							endMarkerPos = null;
							secondVPos = null;
							newVMarker = null;
							newMarker = null;
							break;
						}
					}
				});
				return marker;
			};
			
function moveVMarker(index) {
				var newpos = markers[index].getPosition();
				if (index != 0) {
					var prevpos = markers[index-1].getPosition();
					vmarkers[index-1].setPosition(new g.LatLng(
						newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
						newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
					));
					prevpos = null;
				}
				if (index != markers.length - 1) {
					var nextpos = markers[index+1].getPosition();
					vmarkers[index].setPosition(new g.LatLng(
						newpos.lat() - (0.5 * (newpos.lat() - nextpos.lat())), 
						newpos.lng() - (0.5 * (newpos.lng() - nextpos.lng()))
					));
					nextpos = null;
				}
				newpos = null;
				index = null;
				updatePolyLineField();
			};
			
	function removeVMarkers(index) {
				if (markers.length > 0) {//clicked marker has already been deleted
					if (index != markers.length) {
						vmarkers[index].setMap(null);
						vmarkers.splice(index, 1);
					} else {
						vmarkers[index-1].setMap(null);
						vmarkers.splice(index-1, 1);
					}
				}
				if (index != 0 && index != markers.length) {
					var prevpos = markers[index-1].getPosition();
					var newpos = markers[index].getPosition();
					vmarkers[index-1].setPosition(new g.LatLng(
						newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
						newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
					));
					prevpos = null;
					newpos = null;
				}
				index = null;
			};
// ==================

 
function updatePolyLineField() {
	jq(##)
}
 
 

function initializeNoMarkerSetDlg() {
	jq("#no-marker-set").dialog({ autoOpen: false });		
}



function initializeGoogleMap() {
	
	jq("button").button();
	
	path = new google.maps.MVCArray;
	
	//if (GBrowserIsCompatible()) {
		
		g = google.maps;
		
		var mapcenter = new google.maps.LatLng(55.684166, 12.544606);
		var mapOptions = {zoom: 13,
      					  mapTypeId: google.maps.MapTypeId.ROADMAP,
      					  center: mapcenter
      					  };
		
	    // map = new GMap2(document.getElementById("map"));
	    // map.setCenter(new GLatLng( ), 13);
	    map = new google.maps.Map(document.getElementById("map"), mapOptions);

		activateOne();
	
		polyLine = new google.maps.Polyline({'strokecolor':"#ff0000"});
		
		
		polyLine.setMap(map);
		
		// poly.setPaths(new google.maps.MVCArray([path]));
		
		addListener = google.maps.event.addListener(map, 'click', mapLeftClick);
		mapHolder = null;
		mapOptions = null;
	
	}
	
	/*	
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
		});*/ 
	//}

//}
 
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
	
}

function _saveData() {
	
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
		// jq('<div class="inserted-option-box" id="gc-' + GOOD_COUNTER + '"><div class="addbox-label">Type: </div><div class="addbox">' + getGoodDropBox(GOOD_COUNTER) + '</div><div><div class="addbox-label"> Kommentar:</div><textarea rows="3" cols="20"></textarea> <div id="ok-2-1"> ' + buildOKButton(GOOD_COUNTER) + '</div><div id="clear-' + GOOD_COUNTER + '" style="clear:both"></div>').insertBefore(x);
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
	//GEvent.clearListeners(poly, "endline");
	//poly.disableEditing();
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



function switchOffMarker() {
	GEvent.removeListener(myEventListener);
}

/*
 * placeGoodMarkers()
 * 
 * Switches on the place marker functionality by setting a click event on the map
 */
 
function placeGoodMarkers() {
	google.maps.event.addListener(map, 'click', function(event) {
    	 placeMarker(event.latLng);
  });
}
  
function placeMarker(location) {
  var marker = new google.maps.Marker({
      position: location, 
      map: map
  });
  
  var curr_id = GOOD_COUNTER; 
  var title = "" + curr_id;
  // alert("setting" + title);
  marker.setTitle(title);
  map.setCenter(location);
  var iwc1 = '<form id="f' + GOOD_COUNTER + '"> <textarea name="ta" id="ta' + curr_id + '"></textarea><form> ok';
  // var iwopts = new google.maps.InfoWindowOptions();
  var iw1 = new google.maps.InfoWindow({content : iwc1});
  iw1.open(map, marker);
  
  google.maps.event.addListener(iw1, "closeclick", function(event) {
  	GOOD_texts.push(jq("#ta" + curr_id).val());
  });
  
  google.maps.event.addListener(marker, "click", function() {
  	var v = Number(marker.getTitle());
  	// alert(v);
  	var tb = '<form id="f' + GOOD_COUNTER + '"> <textarea name="ta" id="ta' + v + '">' + GOOD_texts[v-1]  + '</textarea><form> ok';
  	var iw = new google.maps.InfoWindow({content : tb});
  	iw .open(map, marker);
  });
  
  GOOD_COUNTER = GOOD_COUNTER +1;
  
}
 
function _placeGoodMarker() {
  jq("#map img").css("cursor","crosshair");
  if (GOOD_markers.length < GOOD_COUNTER) {
	  myEventListener = GEvent.addListener(map, "click", function(overlay, latlng) {
	  if (latlng) {
	  	  if (GOOD_markers.length < GOOD_COUNTER-1) {
		      GEvent.removeListener(myEventListener);
		      myEventListener = null;
		      var color = getColor(true);
		      var marker = new Marker(latlng, {icon: getIcon(color), draggable: true});
		      
		      html = '<textarea rows="3" cols="20" name="gta-' + GOOD_COUNTER +  '"></textarea>';
		      
		      map.addOverlay(marker);
		      
		      marker.openInfoWindowHtml("<p>---</p>");
		      // marker.openInfoWindowHtml("<div>xxx</div>");
		      // alert(html);
		      
		      GOOD_markers.push(marker);
		      saveData();
		      var cells = addFeatureEntry("Placemark " + (++markerCounter_), color);
		      updateMarker(marker, cells);
		      GEvent.addListener(marker, "dragend", function() {
		        updateMarker(marker, cells);
		      });
		      GEvent.addListener(marker, "click", function() {
		        // updateMarker(marker, cells, true);
		        marker.openInfoWindowHtml("<div>test</div>");
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

function xxx() {
	GOOD_markers[0].openInfoWindowHtml(html + "<div>test</div>");
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