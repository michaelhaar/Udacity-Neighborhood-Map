class Location {

  constructor(locationData, map, viewModel) {
    this.title = locationData.title;
    this.position = locationData.position;
    // every location object holds a reference to the map object
    // and the Viewmodel:
    this.targetMap = map;
    this.viewModel = viewModel;
    console.log(viewModel);

    this.createMarker(); // create a marker for the map
  }

  createInfowindow() {
    this.infowindow = new google.maps.InfoWindow();
    this.infowindow.setContent('Hallo');
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
      self.viewModel.selectLocation(self)
    });

    // function() {
    //   self.infowindow.open(self.targetMap, self.marker);
    // });
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
