// TODO rewrite the following sentence
// This function is defined as a callback in the index.html file
function initMap() {
  var map = createMap();
  var markers = addMarkers(map, mylocations);
  zoomToFitMarkers(map, markers)
  addClickListeners(markers)
}

function createMap() {
  // Constructor creates a new map
  var map = new google.maps.Map(document.getElementById('map'), {
    // only center and zoom are required.
    center: {lat: 47.075004, lng: 15.436732},
    zoom: 13
  });
  return map;
}

function addMarkers(targetMap, locations) {
  // Create a new blank array for all the listing markers.
  var markers = [];
  // The following group uses the location array to create an array of markers.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: targetMap,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
  }
  return markers;
}

function zoomToFitMarkers(targetMap, markers) {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker
  for (var i = 0; i < markers.length; i++) {
    bounds.extend(markers[i].position);
  }
  // apply the new boundaries to our map
  targetMap.fitBounds(bounds);
}

function addClickListeners(markers) {
  var largeInfowindow = new google.maps.InfoWindow();
  // Create an onclick event to open an infowindow at each marker.
  for (var i = 0; i < markers.length; i++) {
    markers[i].addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
  }
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}
