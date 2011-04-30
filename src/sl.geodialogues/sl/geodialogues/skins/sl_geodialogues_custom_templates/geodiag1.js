// view-source:http://www.ekelschot.eu/demo/maps/enableEditing.html

var map = null;
var polyLine;
var tmpPolyLine;
var markers = [];
var vmarkers = [];

var STATE = 1;

var polyLineListener = null;
var polyLineListenerMarker = null;


var GOOD_GROUP_VALUES = [['0','V&aelig;lg'],
						 ['god_sti_bel','God cykelsti/bel&aelig;gning'],
						 ['god_cykel_park','God cykelparkering'],
						 ['smuk_groen_omgiv','Smukke, gr&oslash;nne omgivelser'],
						 ['god_fremk','God fremkommelighed, f&aring; stops'],
						 ['ned_bakke', 'Det g&aring;r ned ad bakke'],
						 ['god_udsigt','God udsigt'],
						 ['mulighed_koere_staerkt', 'Mulighed for at k&oslash;re st&aelig;rkt'],
						 ['andre_cyklister','Andre cyklister'],
						 ['andre_cyklister_smiler','Andre cyklister, der smiler'],
						 ['andet','Andet']
						 ];
						 

var BAD_GROUP_VALUES = [['0','V&aelig;lg'],
					    ['farligt_kryds','Farligt kryds'],
					    ['larm_forurening','Larm/forurening'],
					    ['vejarbejde','Vejarbejde'],
					    ['fordg_pa_cykelsti','Fodg&aelig;ngere p&aring; cykelstien/vejbanen'],
					    ['biler_taet_paa','Biler, busser og lastbiler t&aelig;t p&aring;'],
					    ['manglende_cykelpark','Manglende cykelparkering'],
					    ['daarlig_beleagn','D&aring;rlig bel&aelig;gning/huller i asfalten'],
					    ['biler_parkeret','Biler mm. parkeret p&aring; cykelstien'],
					    ['op_ad_bakke','Det g&aring;r op ad bakke'],
					    ['andre_cyk','Andre cyklister'],
					    ['andre_cyk_raaber','Andre cyklister, der r&aring;ber/sk&aeliglder ud'],
					    ['for_mange_andre','For mange andre cyklister'],
					    ['andet','Andet']
					    ];


var GOOD_markers = [null,null,null];
var BAD_markers = [null,null,null];

var GOOD_listener = null;
var BAD_listener = null;
var markerListeners = [];
var vMarkerListeners = [];

var markerMarkerListeners = [];

var singlequote = "'";

var appStart = true;


// Ajax activity indicator bound to ajax start/stop document events
$(document).ajaxStart(function(){ 
  $('#ajaxBusy').show(); 
}).ajaxStop(function(){ 
  $('#ajaxBusy').hide();
});



function initMap(mapHolder) {
	markers = [];
	vmarkers = [];
	var mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(55.684166, 12.544606),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
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
	}
	updatePolyLineField();
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
				break;
			}
		}
		m = null;
		updatePolyLineField();
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
				// alert("S=3");
				placeBadMarker(event.latLng);
			}
	});
	vMarkerListeners.push(marker_listener);
	updatePolyLineField();
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
	
	
	jq("#button-4").bind("click", function() {
		jq("#button-4").unbind();
		activateFour();
		alert("Tak for oplysningerne om dine oplevelser. Din rute samt alle oplevelser er gemt, og du kan nu lukke vinduet og gå tilbage for at afslutte spørgeskemaet.");
	});
	
	
	jq("instruction2").hide();
	jq("instruction3").hide();
	jq("ba1").hide();
	
	jq("#instruction4").css("color", "grey");

}

function activateOne() {
	
	if (STATE==2) {
		deactivateTwo();
	}

	if (STATE==3) {
		deactivateThree();
	}
	if (STATE==4) {
		nextState=1;
		deactivateFour();
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
	

	jq("#wrapper-1").css("background-color","#d3d3d3");
	jq("#b1").css("background-image",'url(dot-grey.png)');

	deactivateMarkerListeners();
	deactivateVMarkerListeners();

	jq("#button-1").bind("click", function() {
		jq("#button-1").unbind();
		activateOne();
	});
	jq("#instruction1").css("color","#d3d3d3");
	
	$("#wrapper-1").hover( function(){
     	$(this).css('background-color', '#ffc354');
	}, 
	function(){
     	$(this).css('background-color', '#d3d3d3');
	});
	
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
	if (STATE==4) {
		nextState=2;
		deactivateFour();
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

	jq("#wrapper-2").css("background-color","#d3d3d3");

	jq("#button-2").bind("click", function() {
		jq("#button-2").unbind();
		activateTwo();
	});

	if (GOOD_markers.length==3) {
		jq("ba2").show("Rediger gode steder");
	}
	
	jq("#ba2").show();
	jq("#instruction2").css("color","#d3d3d3");
	
	$("#wrapper-2").hover( function(){
     	$(this).css('background-color', '#ffc354');
	}, 
	function(){
     	$(this).css('background-color', '#d3d3d3');
	});
	
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
	
	if (STATE==4) {
		nextState=3;
		deactivateFour();
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

	google.maps.event.removeListener(polyLineListenerMarker);

	google.maps.event.removeListener(BAD_listener);
	deactivateMarkerListeners();
	deactivateVMarkerListeners();

	jq("#wrapper-3").css("background-color","#d3d3d3");

	jq("#button-3").bind("click", function() {
		jq("#button-3").unbind();
		activateThree();
	});
	jq("#instruction3").css("color","#d3d3d3");
	jq("#ba3").show();
	
	$("#wrapper-3").hover( function(){
     	$(this).css('background-color', '#ffc354');
	}, 
	function(){
     	$(this).css('background-color', '#d3d3d3');
	});
	
}

function activateFour() {
	
	if (STATE==2) {
		nextState=3;
		deactivateTwo();
	}
	if (STATE==1) {
		nextState=3;
		deactivateOne();
	}

	if (STATE==3) {
		nextState=4;
		deactivateThree();
	}
	
	STATE = 4;
	jq("#wrapper-4").css("background-color","#FF0000");
}

function deactivateFour() {

	jq("#wrapper-4").css("background-color","#d3d3d3");

	jq("#button-4").bind("click", function() {
		jq("#button-4").unbind();
		activateFour();
	});
	jq("#ba4").show();
	
	$("#wrapper-4").hover( function(){
     	$(this).css('background-color', '#ffc354');
	}, 
	function(){
     	$(this).css('background-color', '#d3d3d3');
	});
	
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


function canAddGoodMarker() {
	
	for (var i=0;i<3;i++) {
		if (GOOD_markers[i]==null) {
			return true;
		}
	}
	return false;
}

function canAddBadMarker() {
	
	for (var i=0;i<3;i++) {
		if (BAD_markers[i]==null) {
			return true;
		}
	}
	return false;
}

/*
 * placeGoodMarker() places a good marker and opens its bubble.
 *
 */
function placeGoodMarker(location) {


	if (canAddGoodMarker()) {

		for (var i=0;i<3;i++) {
			if (GOOD_markers[i]==null) {
				var curr_id = i;
				break;
			}
		}

		var marker = new google.maps.Marker({
			position: location,
			map: map,
			icon :"green_icon.png",
			draggable : true
		});
		
		marker.set("id", curr_id);
		map.setCenter(location);

		var iwc1 = '<div class="google_spacer"></div><form id="f' + curr_id + '"> '+ createDropdown(curr_id, 'good') +'<br/><textarea name="tgood' + curr_id + '" id="tgood' + curr_id + '" onkeyup="updateText(' + singlequote + 'good' + singlequote + ',' +
		curr_id + ');"></textarea><br/><a class="deletemarker" href="javascript:google.maps.event.clearInstanceListeners(map);deleteGood(' + curr_id + ');">Fjern oplevelse</a><form>';

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
				var tb = '<div class="google_spacer"><form id="f' + curr_id + '">' + createDropdownSelected(curr_id, 'good', g) + '<br/><textarea name="tgood' + v + '" id="tgood' + v + '" onkeyup="updateText(' + singlequote + 'good' + singlequote + ',' + 
										 curr_id + ');">' + mtext  + '</textarea><br/><a class="deletemarker" href="javascript:google.maps.event.clearInstanceListeners(map);deleteGood(' + curr_id + ');">Fjern oplevelse</a><form>';
				var iw = new google.maps.InfoWindow({content : tb});
				iw.open(map, marker);
				google.maps.event.addListener(iw, "closeclick", function(event) {
					marker.set("text", jq("#tgood" + curr_id).val());
					marker.set("group",jq("#s" + curr_id).val());
				});
				
				
				
			});
		});
		
		jq("#good-coord" + curr_id).val(location.lat() + "," + location.lng());
		
		google.maps.event.addListener(marker, "dragend", function(event) {
			var lctn = marker.getPosition()
			jq("#good-coord" + curr_id).val(lctn.lat() + "," + lctn.lng());
			saveData();
		});
		
		GOOD_markers[curr_id] = marker;
		saveData();
	} else {
		alert("Du har ikke mulighed for at beskrive flere end tre gode oplevelser.");
	}
}

function deleteGood(id) {

	GOOD_markers[id].setMap(null);
	GOOD_markers[id] = null;
	jq("#good-coord" + id).val("");
	jq("#good-text" + id).val("");
	jq("#good-drop" + id).val("");
	placeGoodMarkers();
}

function deleteBad(id) {

	BAD_markers[id].setMap(null);
	BAD_markers[id] = null;
	jq("#bad-coord" + id).val("");
	jq("#bad-text" + id).val("");
	jq("#bad-drop" + id).val("");
	placeBadMarkers();
}



/*
 * placeGoodMarker() places a good marker and opens its bubble.
 *
 */
function placeBadMarker(location) {

	if (canAddBadMarker()) {

		for (var i=0;i<3;i++) {
			if (BAD_markers[i]==null) {
				var curr_id = i;
				break;
			}
		}

		var marker = new google.maps.Marker({
			position: location,
			map: map,
			icon :"red_icon.png",
			draggable : true
		});

		marker.set("id", curr_id);
		map.setCenter(location);

		var iwc1 = '<div class="google_spacer"></div><form id="f' + curr_id + '"> '+ createDropdown(curr_id, 'bad') +'<br/><textarea name="tbad" id="tbad' + curr_id + '" onkeyup="updateText(' + singlequote + 'bad' + singlequote + ',' +
		curr_id + ');"></textarea><br/><a class="deletemarker" href="javascript:google.maps.event.clearInstanceListeners(map);deleteBad(' + curr_id + ');">Fjern oplevelse</a><form>';

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
				var tb = '<div class="google_spacer"><form id="f' + curr_id + '">' + createDropdownSelected(curr_id, 'bad', g) + '<br/><textarea name="ta" id="tbad' + v + '" onkeyup="updateText(' + singlequote + 'bad' + singlequote + ',' +
										 curr_id + ');">' + mtext  + '</textarea><br/><a class="deletemarker" href="javascript:google.maps.event.clearInstanceListeners(map);deleteBad(' + curr_id + ');">Fjern oplevelse</a><form>';
				var iw = new google.maps.InfoWindow({content : tb});
				iw.open(map, marker);
				google.maps.event.addListener(iw, "closeclick", function(event) {
					marker.set("text", jq("#tbad" + curr_id).val());
					marker.set("group",jq("#s" + curr_id).val());

				});
			});
		});
		
		jq("#bad-coord" + curr_id).val(location.lat() + "," + location.lng())
		
		google.maps.event.addListener(marker, "dragend", function(event) {
			var lctn = marker.getPosition()
			jq("#bad-coord" + curr_id).val(lctn.lat() + "," + lctn.lng());
			saveData();
		});
		
		
		BAD_markers[curr_id] = marker;
		saveData();

	} else {
		alert("Du har ikke mulighed for at beskrive flere end tre daarlige oplevelser.");
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