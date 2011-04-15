var map = null;
var polyLine;
var tmpPolyLine;
var markers = [];
var vmarkers = [];
var STATE = 1;
var polyLineListener = null;
var GOOD_COUNTER = 0;
var BAD_COUNTER = 0;
var GOOD_GROUP_VALUES = [['0','Vaelg gruppe'],['sikker','God sikkerhed'],['stoej','Ikke for meget stoej'],['v3','Value 3']];
var BAD_GROUP_VALUES = [['0','Vaelg gruppe'], ['usikker','Daarlig sikkerhed'],['stoej','Meget stoej'],['v3','Value 3']];
var GOOD_markers = [];
var BAD_markers = [];


var markers = [];

var singlequote = "'";


function initMap(mapHolder) {
	markers = [];
	vmarkers = [];
	var mapOptions = {
		zoom: 7,
		center: new google.maps.LatLng(52.092, 5.121),
		mapTypeId: google.maps.MapTypeId.HYBRID,
		draggableCursor: 'auto',
		draggingCursor: 'move',
		disableDoubleClickZoom: true
	};
	map = new google.maps.Map(document.getElementById(mapHolder), mapOptions);
	polyLineListener = google.maps.event.addListener(map, "click", mapLeftClick);
	mapHolder = null;
	mapOptions = null;
};

function initPolyline() {
	var polyOptions = {
		strokeColor: "#3355FF",
		strokeOpacity: 0.8,
		strokeWeight: 4
	};
	var tmpPolyOptions = {
		strokeColor: "#3355FF",
		strokeOpacity: 0.4,
		strokeWeight: 4
	};
	polyLine = new google.maps.Polyline(polyOptions);
	polyLine.setMap(map);
	tmpPolyLine = new google.maps.Polyline(tmpPolyOptions);
	tmpPolyLine.setMap(map);
	
	
	
};

function polyClick(event) {
	alert(x);
}

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
	var imageNormal = new google.maps.MarkerImage(
	"square.png",
	new google.maps.Size(11, 11),
	new google.maps.Point(0, 0),
	new google.maps.Point(6, 6)
	);
	var imageHover = new google.maps.MarkerImage(
	"square_over.png",
	new google.maps.Size(11, 11),
	new google.maps.Point(0, 0),
	new google.maps.Point(6, 6)
	);
	var marker = new google.maps.Marker({
		position: point,
		map: map,
		icon: imageNormal,
		draggable: true
	});
	google.maps.event.addListener(marker, "mouseover", function() {
		marker.setIcon(imageHover);
	});
	google.maps.event.addListener(marker, "mouseout", function() {
		marker.setIcon(imageNormal);
	});
	google.maps.event.addListener(marker, "drag", function() {
		for (var m = 0; m < markers.length; m++) {
			if (markers[m] == marker) {
				polyLine.getPath().setAt(m, marker.getPosition());
				moveVMarker(m);
				break;
			}
		}
		m = null;
	});
	google.maps.event.addListener(marker, "click", function() {
		for (var m = 0; m < markers.length; m++) {
			if (markers[m] == marker) {
				marker.setMap(null);
				markers.splice(m, 1);
				polyLine.getPath().removeAt(m);
				removeVMarkers(m);
				break;
			}
		}
		m = null;
	});
	return marker;
};
function createVMarker(point) {
	var prevpoint = markers[markers.length-2].getPosition();
	var imageNormal = new google.maps.MarkerImage(
	"square_transparent.png",
	new google.maps.Size(11, 11),
	new google.maps.Point(0, 0),
	new google.maps.Point(6, 6)
	);
	var imageHover = new google.maps.MarkerImage(
	"square_transparent_over.png",
	new google.maps.Size(11, 11),
	new google.maps.Point(0, 0),
	new google.maps.Point(6, 6)
	);
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(
		point.lat() - (0.5 * (point.lat() - prevpoint.lat())),
		point.lng() - (0.5 * (point.lng() - prevpoint.lng()))
		),
		map: map,
		icon: imageNormal,
		draggable: true
	});
	google.maps.event.addListener(marker, "mouseover", function() {
		marker.setIcon(imageHover);
	});
	google.maps.event.addListener(marker, "mouseout", function() {
		marker.setIcon(imageNormal);
	});
	google.maps.event.addListener(marker, "dragstart", function() {
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
	google.maps.event.addListener(marker, "drag", function() {
		for (var m = 0; m < vmarkers.length; m++) {
			if (vmarkers[m] == marker) {
				tmpPolyLine.getPath().setAt(1, marker.getPosition());
				break;
			}
		}
		m = null;
	});
	google.maps.event.addListener(marker, "dragend", function() {
		for (var m = 0; m < vmarkers.length; m++) {
			if (vmarkers[m] == marker) {
				var newpos = marker.getPosition();
				var startMarkerPos = markers[m].getPosition();
				var firstVPos = new google.maps.LatLng(
				newpos.lat() - (0.5 * (newpos.lat() - startMarkerPos.lat())),
				newpos.lng() - (0.5 * (newpos.lng() - startMarkerPos.lng()))
				);
				var endMarkerPos = markers[m+1].getPosition();
				var secondVPos = new google.maps.LatLng(
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
		vmarkers[index-1].setPosition(new google.maps.LatLng(
		newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
		newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
		));
		prevpos = null;
	}
	if (index != markers.length - 1) {
		var nextpos = markers[index+1].getPosition();
		vmarkers[index].setPosition(new google.maps.LatLng(
		newpos.lat() - (0.5 * (newpos.lat() - nextpos.lat())),
		newpos.lng() - (0.5 * (newpos.lng() - nextpos.lng()))
		));
		nextpos = null;
	}
	newpos = null;
	index = null;
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
		vmarkers[index-1].setPosition(new google.maps.LatLng(
		newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
		newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
		));
		prevpos = null;
		newpos = null;
	}
	index = null;
};
//---------------------------------------------------------------------------------------
// here the button functions


function initializeButtons() {
	
	// jq("instruction").hide();
 	
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

function activateOne() {
	if (STATE==2) {
		deactivateTwo();
	}
	
	if (STATE==3) {
		deactivateThree();
	}
	
	polyLineListener = google.maps.event.addListener(map, "click", mapLeftClick);
	
	STATE=1;
	
	jq("#wrapper-1").css("background-color","red");

} 
 
function deactivateOne() {
	google.maps.event.clearListeners(map,"click");
	//GEvent.clearListeners(poly, "endline");
	//poly.disableEditing();
	jq("#wrapper-1").css("background-color","grey");	
	jq("#b1").css("background-image",'url(dot-grey.png)');
}
 
function activateTwo() {
	if (STATE==1) {
		deactivateOne();
	}
	if (STATE==3) {
		deactivateThree();
	}
	STATE=2;
	jq("#wrapper-2").css("background-color","#FF0000");
	jq("#button-2").unbind();
 	// showGoodHtmlInstructionText("#injector-area-2"); 
 	saveData();
 	google.maps.event.addListener(polyLine, "click", function(event) {
 		placeGoodMarker(event.latLng);
 	});
	placeGoodMarkers();
}
 
 
function deactivateTwo() {
	try {
		google.maps.clearListeners(map, "click");
		google.maps.clearListeners(polyLine, "click");
	} catch(err) {
	}
	jq("#wrapper-2").css("background-color","grey");	
	
}

function activateThree() {
	if (STATE==2) {
		deactivateTwo();	
	}
	if (STATE==1) {
		deactivateOne();
	}
	STATE = 3;
	jq("#wrapper-3").css("background-color","#FF0000");
	placeBadMarkers();
}

function deactivateThree() {
	try {
		google.maps.clearListeners(map, "click");
		google.maps.clearListeners(polyLine, "click");
	} catch(err) {
	}
	jq("#wrapper-3").css("background-color","grey");
} 

function showGoodHtmlInstructionText(node) {
	
}

/*
 * placeGoodMarkers()
 * 
 * Switches on the place marker functionality by setting a click event on the map
 */
 
function placeGoodMarkers() {
	google.maps.event.addListener(map, 'click', function(event) {
    	 placeGoodMarker(event.latLng);
  });
}

/*
 * placeBadMarkers()
 * 
 * Switches on the place marker functionality by setting a click event on the map
 */
 
function placeBadMarkers() {
	google.maps.event.addListener(map, 'click', function(event) {
		placeBadMarker(event.latLng);
  });
}



function createDropdown(id, type_) {
	alert("cD" + type_);
	if (type_=="good") {
		var GROUP_VALUES = GOOD_GROUP_VALUES;
	} else {
		alert("bad");
		var GROUP_VALUES = BAD_GROUP_VALUES;
	}
	
	var html = '<select id="s' + id + '" onchange="updateDropDown(' + singlequote + type_ + singlequote + ',' + id + ')">';
	for (var i=0; i<GROUP_VALUES.length;i++) {
		html = html + '<option value="' + GROUP_VALUES[i][0] + '">' + GROUP_VALUES[i][1] + '</option>';
	}
	html = html + "</select>";
	return html;
}

function createDropdownSelected(id, type, s) {
	if (type=="good") {
		var GROUP_VALUES = GOOD_GROUP_VALUES;
	} else {
		var GROUP_VALUES = BAD_GROUP_VALUES;
	}
	var html = '<select id="s' + id + '" onchange="updateDropDown(' + singlequote + type + singlequote + ',' + id + ')">';
	for (var i=0; i<GROUP_VALUES.length;i++) {
		if (s==GROUP_VALUES[i][0]) {
			html = html + '<option value="' + GROUP_VALUES[i][0] + '" selected="selected"' + GROUP_VALUES[i][1] + '</option>';
		} else {
			html = html + '<option value="' + GROUP_VALUES[i][0] + '">' + GROUP_VALUES[i][1] + '</option>';
		}
	}
	html = html + "</select>";
	return html;
}

function updateText(type, id) {
	var content = jq("#t" + type + id).val();
	jq("#" + type + "-text" + id).val(content);
}


function updateDropDown(type,id) {
	var content = jq("#s" + id).val();
	jq("#" + type + "-drop" + id).val(content);
}


/*
 * placeGoodMarker() places a good marker and opens its bubble.
 * 
 */
function placeGoodMarker(location) {

	if (GOOD_markers.length<3) {

		var marker = new google.maps.Marker({
			position: location,
			map: map
		});
		
		var curr_id = GOOD_COUNTER;
		
		marker.set("id", curr_id);
		map.setCenter(location);
		
		
		var iwc1 = '<form id="f' + curr_id + '"> '+ createDropdown(curr_id, 'good') +'<br/><textarea name="ta" id="t' + 'good' + curr_id + '" onkeyup="updateText(' + singlequote + 'good' + singlequote + ',' +
		curr_id + ');"></textarea><form>';

		var iw1 = new google.maps.InfoWindow({content : iwc1});
		iw1.open(map, marker);

		google.maps.event.addListener(iw1, "closeclick", function(event) {
			marker.set("text", jq("#ta" + curr_id).val());
			marker.set("group",jq("#s" + curr_id).val());
			marker.set("type", "good");
		});
		google.maps.event.addListener(marker, "click", function() {
			var v = marker.get("id");
			var g = marker.get("group");
			var tb = '<form id="f' + curr_id + '">' + createDropdownSelected(curr_id, 'good', g) + '<br/><textarea name="ta" id="ta' + v + '">' + marker.get("text")  + '</textarea><form> ok';
			var iw = new google.maps.InfoWindow({content : tb});
			iw .open(map, marker);
			google.maps.event.addListener(iw, "closeclick", function(event) {
				marker.set("text", jq("#ta" + curr_id).val());
				marker.set("group",jq("#s" + curr_id).val());
			});
		});
		
		GOOD_COUNTER = GOOD_COUNTER + 1;
		GOOD_markers.push(marker);
		

	}
}

/*
 * placeGoodMarker() places a good marker and opens its bubble.
 * 
 */
function placeBadMarker(location) {

	if (BAD_markers.length<3) {

		var marker = new google.maps.Marker({
			position: location,
			map: map
		});

		var curr_id = BAD_COUNTER;

		
		marker.set("id", curr_id);
		map.setCenter(location);
		
		
		var iwc1 = '<form id="f' + curr_id + '"> '+ createDropdown(curr_id, 'bad') +'<br/><textarea name="ta" id="tbad' + curr_id + '" onkeyup="updateText(' + singlequote + 'bad' + singlequote + ',' +
		curr_id + ');"></textarea><form> <a onclick="">gem<a>';

		// alert(iwc1);

		// var iwopts = new google.maps.InfoWindowOptions();
		var iw1 = new google.maps.InfoWindow({content : iwc1});
		iw1.open(map, marker);

		google.maps.event.addListener(iw1, "closeclick", function(event) {
			marker.set("text", jq("#ta" + curr_id).val());
			marker.set("group",jq("#s" + curr_id).val());
			marker.set("type", 'bad');
		});
		google.maps.event.addListener(marker, "click", function() {
			var v = marker.get("id");
			var g = marker.get("group");
			var tb = '<form id="f' + curr_id + '">' + createDropdownSelected(curr_id, 'bad', g) + '<br/><textarea name="ta" id="ta' + v + '">' + marker.get("text")  + '</textarea><form>';
			var iw = new google.maps.InfoWindow({content : tb});
			iw.open(map, marker);
			google.maps.event.addListener(iw, "closeclick", function(event) {
				marker.set("text", jq("#ta" + curr_id).val());
				marker.set("group",jq("#s" + curr_id).val());
			});
		});
		
			BAD_COUNTER = BAD_COUNTER + 1;
			BAD_markers.push(marker);

	} else {
		alert("bad > 3");
	}
}


function saveData() {
	
}


