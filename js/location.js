class Location {

  constructor(locationData, map, infowindow) {
    this.title = locationData.title;
    this.position = locationData.position;
    // every location object holds a reference to the map object
    // and the inf-window:
    this.targetMap = map;
    this.infowindow = infowindow;

    this.createMarker(); // create a marker for the map
  }

  createMarker() {
    // create the marker object
    this.marker = new google.maps.Marker({
      map: this.targetMap,
      position: this.position,
      title: this.title,
      animation: google.maps.Animation.DROP
    });

    // add a click listener to the marker:
    var self = this; // cool trick to access current object in callback func.
    this.marker.addListener('click', function() {
      self.showInfowindow(self)
    });
  }

  setInfowindowContent() {
    this.infowindow = new google.maps.InfoWindow();
    this.infowindow.setContent('Hallo');
  }

  // The clicked item will be passed as the first parameter
  // see: http://knockoutjs.com/documentation/click-binding.html

  showInfowindow(location) {
    // TODO I think showInfowindow() would also work with 'this'
    location.infowindow.open(location.targetMap, location.marker);
    location.bounceMarker();
  }

  bounceMarker() {
    // trigger marker animation
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
    // stop marker animation after 3 bounces
    var self = this;
    window.setTimeout(function() {
      self.marker.setAnimation(null);
    }, 3*700);
  }

  showMarker(visibility) {
    if (visibility === true) {
      this.marker.setMap(this.targetMap);
    } else {
      this.marker.setMap(null)
      // If map is set to null, the marker will be removed.
      // see: https://developers.google.com/maps/documentation/javascript/3.exp/reference#Marker
    }
  }

  // populateInfoWindow() {
  //     infowindow.marker = marker;
  //     infowindow.setContent('<div>' + marker.title + '</div>');
  //     infowindow.open(map, marker);
  //     // Make sure the marker property is cleared if the infowindow is closed.
  //     infowindow.addListener('closeclick',function(){
  //       infowindow.setMarker = null;
  //     });
  //   }
  // }


}
