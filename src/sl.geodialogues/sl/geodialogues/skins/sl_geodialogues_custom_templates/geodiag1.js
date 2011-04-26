// view-source:http://www.ekelschot.eu/demo/maps/enableEditing.html

var map = null;
var polyLine;
var tmpPolyLine;
var markers = [];
var vmarkers = [];

var STATE = 1;


var polyLineListener = null;
var polyLineListenerMarker = null;
var GOOD_COUNTER = 0;
var BAD_COUNTER = 0;
var GOOD_GROUP_VALUES = [['0','Vaelg oplevelsestype'],['sikker','Sikkerhed'],['stoej','St&oslash;j'],['udsigt','Udsigt'],['groent','Gr&oslash;nne omgivelser'], ['belaeg','Bel&aelig;gning'], ['andrecyk','Andre cyklisters adf&aelig;rd'],['fremkom','Fremkommelighed']];
var BAD_GROUP_VALUES = [['0','Vaelg oplevelsestype'], ['sikker','Sikkerhed'],['stoej','St&oslash;j'],['udsigt','Udsigt'],['groent','Gr&oslash;nne omgivelser'], ['belaeg','Bel&aelig;gning'], ['andrecyk','Andre cyklisters adf&aelig;rd'],['fremkom','Fremkommelighed']];

var GOOD_markers = [];
var BAD_markers = [];

var GOOD_listener = null;
var BAD_listener = null;
var markerListeners = [];
var vMarkerListeners = [];

var markerMarkerListeners = [];

var singlequote = "'";

var appStart = true;

function initMap(mapHolder) {
	markers = [];
	vmarkers = [];
	var mapOptions = {
		zoom: 13,
		center: new google.maps.LatLng(55.684166, 12.544606),
		mapTypeId: google.maps.MapTypeId.HYBRID,
		draggableCursor: 'auto',
		draggingCursor: 'move',
		disableDoubleClickZoom: true
	};
	map = new google.maps.Map(document.getElementById(mapHolder), mapOptions);
	// polyLineListener = google.maps.event.addListener(map, "click", mapLeftClick);
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
		updatePolyLineField();
	}
	event = null;
};

function redrawPolyline() {
	var backupPoly = polyLine;
	var markersBackup = [];

	polyLine.setMap(null);

	for (var m=0;m<markers.length;m++) {
		var ma = markers[m];
		markersBackup.push(ma);
		ma.setMap(null);

	}
	for (var m=0;m<vmarkers.length;m++) {
		vmarkers[m].setMap(null);
	}

	markers = [];
	vmarkers = [];

	polyLine.setMap(null);
	polyLine = null;
	tmpPolyLine.setMap(null);
	tmpPolyLine = null;

	initPolyline();

	for (var m=0; m<markersBackup.length; m++) {
		var pos = markersBackup[m].getPosition();

		var marker = createMarker(pos);
		markers.push(marker);
		
		if (markers.length != 1) {
 			var vmarker = createVMarker(pos);
 			vmarkers.push(vmarker);
 			vmarker = null;
 		}
 		
		var path = polyLine.getPath();

		path.push(pos);
		marker = null;
		updatePolyLineField();
	
	}
}

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
	var marker_listener = google.maps.event.addListener(marker, "click", function() {
		for (var m = 0; m < markers.length; m++) {
			if (markers[m] == marker) {
				marker.setMap(null);
				markers.splice(m, 1);
				polyLine.getPath().removeAt(m);
				removeVMarkers(m);
				updatePolyLineField
				break;
			}
		}
		m = null;
	});
	markerListeners.push(marker_listener);
	return marker;
};

function deactivateMarkerListeners() {
	/*
	for (var m = 0; m < markerListeners.length; m++) {
		google.maps.event.removeListener(markerListeners[m]);
	}
	*/
	// markerListeners = [];
	
	for (var m = 0; m < markers.length; m++) {
		google.maps.event.clearListeners(markers[m]);
	}
	
	for (var m=0; m<markers.length; m++) {

		var mm = markers[m];
		var marker_listener = google.maps.event.addListener(mm, "click", function(event) {

			if (nextState==2) {
				// alert("ns=2");
				placeGoodMarker(event.latLng);
			}

			if (nextState==3) {
				// alert("ns=3");
				placeBadMarker(event.latLng);
			}
		});
		//markerListeners.push(marker_listener);
	}
}

function deactivateVMarkerListeners() {
	/*
	for (var m = 0; m < markerListeners.length; m++) {
		google.maps.event.removeListener(markerListeners[m]);
	}
	*/
	//vMarkerListeners = [];
	
	for (var m = 0; m < vmarkers.length; m++) {
		google.maps.event.clearListeners(vmarkers[m]);
	}
	
	for (var m=0; m<vmarkers.length; m++) {

		var mm = vmarkers[m];
		var marker_listener = google.maps.event.addListener(mm, "click", function(event) {

			if (nextState==2) {
				// alert("vns=2");
				placeGoodMarker(event.latLng);
			}

			if (nextState==3) {
				// alert("vns=3");
				placeBadMarker(event.latLng);
			}
		});
		//vMarkerListeners.push(marker_listener);
	}
}


function reactivateMarkerListeners() {

	for (var m=0; m<markerMarkerListeners.length;m++) {
		google.maps.event.removeListener(markerMarkerListeners[m])
	}

	markerMarkerListeners = [];
	markerListeners = [];

	/*for (var n = 0; n < markers.length; n++) {

		var marker = markers[n];

		var marker_listener = google.maps.event.addListener(marker, "click", function() {
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
		markerListeners.push(marker_listener);
	}*/
}

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
				updatePolyLineField();
				break;
			}
		}
	});
	
	var marker_listener = google.maps.event.addListener(marker, "click", function() {
			if (STATE==2) {
				// alert(x);
				placeGoodMarker(event.latLng);
			}

			if (STATE==3) {
				alert("S=3");
				placeBadMarker(event.latLng);
			}
	});
	vMarkerListeners.push(marker_listener);
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

/*
 * updates the hidden field, which contains the data for the polyline
 */
function updatePolyLineField() {
	path = polyLine.getPath();
	var nodes = "";
	for (var x=0;x<path.getLength();x++) {
		var node =  path.getAt(x);
		nodes = nodes + node.lat() + "," + node.lng() + ";";
	}
	jq("#polyline").val(nodes);
	saveData();
}

function initializeButtons() {

	// jq("instruction").hide();

	// jq("button").button({ icons: {primary:'ui-icon-circle-check'},text: false });

	jq("#button-1").bind("click", function() {
		jq("#button-1").unbind();
		activateOne();
	});
	jq("#button-2").bind("click", function() {
		jq("#button-2").unbind();
		activateTwo();

	});
	jq("#button-3").bind("click", function() {
		jq("#button-3").unbind();
		activateThree();
	});
	activateOne();
	
	jq("#ba1").button();
	jq("#ba2").button();
	jq("#ba3").button();
	
	jq("instruction2").hide();
	jq("instruction3").hide();
	jq("ba1").hide();

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

	jq("#instruction1").show();

	jq("#wrapper-1").css("background-color","red");
	if (appStart) {
		appStart = false;
	} else {
		// reactivateMarkerListeners();
		redrawPolyline();
	}
	jq("#instruction1").css("color","black");
	jq("#ba1").hide();
}

function deactivateOne() {
	google.maps.event.removeListener(polyLineListener);
	polyLineListener = null;
	
	google.maps.event.clearInstanceListeners(map);
	

	jq("#wrapper-1").css("background-color","lightgrey");
	jq("#b1").css("background-image",'url(dot-grey.png)');

	deactivateMarkerListeners();
	deactivateVMarkerListeners();

	jq("#button-1").bind("click", function() {
		jq("#button-1").unbind();
		activateOne();
	});
	jq("#instruction1").css("color","lightgray");
	jq("#ba1").show();
}

function activateTwo() {
	
	
	if (STATE==1) {
		nextState = 2;
		deactivateOne();
	}
	if (STATE==3) {
		nextState = 2;
		deactivateThree();
	}

	STATE=2;
	
	/*for (var v=0;v<vmarkers.length;v++) {
		var mm = vmarkers[v];
		google.maps.event.addListener(mm, 'click', function(event) {
			placeGoodMarker(event.latLng);
		});
	}*/
	
	jq("#wrapper-2").css("background-color","#FF0000");
	jq("#button-2").unbind();
	
	jq("#ba2").hide();
	if (GOOD_markers >2) {
		
	} 
	jq("instruction2").show();

	polyLineListenerMarker =  google.maps.event.addListener(polyLine, 'click', function(event) {
		placeGoodMarker(event.latLng);
	});
	
	placeGoodMarkers();
	jq("#instruction2").css("color","black");

}

function deactivateTwo() {

	google.maps.event.removeListener(GOOD_listener);
	google.maps.event.removeListener(polyLineListenerMarker);
	
	deactivateMarkerListeners();
	deactivateVMarkerListeners();

	jq("#wrapper-2").css("background-color","lightgrey");

	jq("#button-2").bind("click", function() {
		jq("#button-2").unbind();
		activateTwo();
	});

	if (GOOD_markers.length==3) {
		jq("ba2").show("Rediger gode steder");
	}
	
	jq("#ba2").show();
	jq("#instruction2").css("color","lightgray");
	
}

function activateThree() {
	
	if (STATE==2) {
		nextState=3;
		deactivateTwo();
	}
	if (STATE==1) {
		nextState=3;
		deactivateOne();
	}
	
	STATE = 3;
	/*for (var v=0;v<vmarkers.length;v++) {
		google.maps.event.addListener(vmarkers[v],'click', function(event) {
			placeBadMarker(event.latLng);
		});
	}*/
	
	jq("#wrapper-3").css("background-color","#FF0000");
	jq("#instruction3").css("color","black");
	
	polyLineListenerMarker =  google.maps.event.addListener(polyLine, 'click', function(event) {
		placeBadMarker(event.latLng);
	});
	
	placeBadMarkers();
	jq("#ba3").hide();
}

function deactivateThree() {

	google.maps.event.removeListener(BAD_listener);
	deactivateMarkerListeners();
	deactivateVMarkerListeners();

	jq("#wrapper-3").css("background-color","lightgrey");

	jq("#button-3").bind("click", function() {
		jq("#button-3").unbind();
		activateThree();
	});
	jq("#instruction3").css("color","lightgray");
	jq("#ba3").show();
}

/*
 * placeGoodMarkers()
 *
 * Switches on the place marker functionality by setting a click event on the map
 */

function placeGoodMarkers() {
	GOOD_listener = google.maps.event.addListener(map, 'click', function(event) {
		placeGoodMarker(event.latLng);
	});
}

/*
 * placeBadMarkers()
 *
 * Switches on the place marker functionality by setting a click event on the map
 */

function placeBadMarkers() {
	BAD_listener = google.maps.event.addListener(map, 'click', function(event) {
		placeBadMarker(event.latLng);
	});
}

function createDropdown(id, type_) {
	// alert("cD" + type_);
	if (type_=="good") {
		var GROUP_VALUES = GOOD_GROUP_VALUES;
	} else {
		// alert("bad");
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
			html = html + '<option value="' + GROUP_VALUES[i][0] + '" selected="selected">' + GROUP_VALUES[i][1] + '</option>';
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
	saveData();
	
}

function updateDropDown(type,id) {
	var content = jq("#s" + id).val();
	jq("#" + type + "-drop" + id).val(content);
	saveData();
}

/*
 * placeGoodMarker() places a good marker and opens its bubble.
 *
 */
function placeGoodMarker(location) {

	if (GOOD_markers.length<3) {

		var marker = new google.maps.Marker({
			position: location,
			map: map,
			icon :"green_icon.png",
			draggable : true
		});

		var curr_id = GOOD_COUNTER;

		marker.set("id", curr_id);
		map.setCenter(location);

		var iwc1 = '<form id="f' + curr_id + '"> '+ createDropdown(curr_id, 'good') +'<br/><textarea name="tgood' + curr_id + '" id="tgood' + curr_id + '" onkeyup="updateText(' + singlequote + 'good' + singlequote + ',' +
		curr_id + ');"></textarea><form>';

		var iw1 = new google.maps.InfoWindow({content : iwc1});
		iw1.open(map, marker);

		google.maps.event.addListener(iw1, "closeclick", function(event) {
			marker.set("text", jq("#tgood" + curr_id).val());
			marker.set("group",jq("#s" + curr_id).val());
			marker.set("type", "good");

			google.maps.event.addListener(marker, "click", function(event) {
				var v = marker.get("id");
				var g = marker.get("group");
				var mtext = marker.get("text");
				if (mtext == undefined) {
					mtext="";
				}
				var tb = '<form id="f' + curr_id + '">' + createDropdownSelected(curr_id, 'good', g) + '<br/><textarea name="tgood' + v + '" id="tgood' + v + '" onkeyup="updateText(' + singlequote + 'good' + singlequote + ',' + 
										 curr_id + ');">' + mtext  + '</textarea><form>';
				var iw = new google.maps.InfoWindow({content : tb});
				iw.open(map, marker);
				google.maps.event.addListener(iw, "closeclick", function(event) {
					marker.set("text", jq("#tgood" + curr_id).val());
					marker.set("group",jq("#s" + curr_id).val());
				});
				
				
				
			});
		});
		GOOD_COUNTER = GOOD_COUNTER + 1;
		
		jq("#good-coord" + curr_id).val(location.lat() + "," + location.lng());
		
		google.maps.event.addListener(marker, "dragend", function(event) {
			var lctn = marker.getPosition()
			jq("#good-coord" + curr_id).val(lctn.lat() + "," + lctn.lng());
			saveData();
		});
		
		GOOD_markers.push(marker);
		saveData();
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
			map: map,
			icon :"red_icon.png",
			draggable : true
		});

		var curr_id = BAD_COUNTER;

		marker.set("id", curr_id);
		map.setCenter(location);

		var iwc1 = '<form id="f' + curr_id + '"> '+ createDropdown(curr_id, 'bad') +'<br/><textarea name="tbad" id="tbad' + curr_id + '" onkeyup="updateText(' + singlequote + 'bad' + singlequote + ',' +
		curr_id + ');"></textarea><form>';

		var iw1 = new google.maps.InfoWindow({content : iwc1});
		iw1.open(map, marker);

		google.maps.event.addListener(iw1, "closeclick", function(event) {
			marker.set("text", jq("#tbad" + curr_id).val());
			marker.set("group",jq("#s" + curr_id).val());
			marker.set("type", 'bad');
			
			google.maps.event.addListener(marker, "click", function() {
				var v = marker.get("id");
				var g = marker.get("group");
				var mtext = marker.get("text");
				if (mtext == undefined) {
					mtext="";
				}
				var tb = '<form id="f' + curr_id + '">' + createDropdownSelected(curr_id, 'bad', g) + '<br/><textarea name="ta" id="tbad' + v + '" onkeyup="updateText(' + singlequote + 'bad' + singlequote + ',' +
										 curr_id + ');">' + mtext  + '</textarea><form>';
				var iw = new google.maps.InfoWindow({content : tb});
				iw.open(map, marker);
				google.maps.event.addListener(iw, "closeclick", function(event) {
					marker.set("text", jq("#tbad" + curr_id).val());
					marker.set("group",jq("#s" + curr_id).val());

				});
			});
		});
		BAD_COUNTER = BAD_COUNTER + 1;
		
		jq("#bad-coord" + curr_id).val(location.lat() + "," + location.lng())
		
		google.maps.event.addListener(marker, "dragend", function(event) {
			var lctn = marker.getPosition()
			jq("#bad-coord" + curr_id).val(lctn.lat() + "," + lctn.lng());
			saveData();
		});
		
		
		BAD_markers.push(marker);
		saveData();

	} else {
		alert("Du kan ikke beskrive flere end 3 oplevelser.");
	}
}

function saveData() {
	var serialized = jq("#mainform").serialize();
	var URL = PORTAL_URL + "dlg1_save?" + serialized; // + "&respondentid=" + RESPONDENTID;
	jq.ajax({
		url: URL,
		context: document.body,
		success: function() {
			jq("#wheel").css("background-image",'');
			// alert("saved");
		}
	});
}

function redrawRoute() {

}

//===================


function initMeasurementView() {
	
	var goods = DATA['good_markers'];
	
	for (var g=0; g<goods.length; g++) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(goods[g]['coord'][0], goods[g]['coord'][1]),
			map: map,
			icon :"green_icon.png"
		});
		tb = goods[g]['drop'] + "<br/>" + goods[g]['text'];
		var iw = new google.maps.InfoWindow({content : tb});
		iw.open(map, marker);
		
	}
	
	var bads = DATA['bad_markers'];
	
	for (var g=0; g<bads.length; g++) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(bads[g]['coord'][0], bads[g]['coord'][1]),
			map: map,
			icon :"red_icon.png"
		});
		tb = bads[g]['drop'] + "<br/>" + bads[g]['text'];
		var iw = new google.maps.InfoWindow({content : tb});
		iw.open(map, marker);
		
	}
	
	var polyOptions = {strokeColor: "#3355FF", strokeOpacity: 0.8, strokeWeight: 4 };
	
	var poly = new google.maps.Polyline(polyOptions);
	poly.setMap(map);
	
	
	var pl = DATA['polyline'];
	var path = poly.getPath();
	
	for (var p=0; p<pl.length; p++) {
		var pos = new google.maps.LatLng(pl[p][0],pl[p][1]);
		path.push(pos);	
	}
	
}