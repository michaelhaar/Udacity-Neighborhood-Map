class ViewModel {
  constructor() {
    // Initialize some KnockoutJS variables/observables
    // see: http://knockoutjs.com/documentation/observables.html
    this.filterInput = ko.observable("");
    this.locationList = ko.observableArray(); //init an empty array

    // Init some Google Maps objects
    // see: https://developers.google.com/maps/documentation/javascript
    this.map = this.createMap()
    this.infowindow = new google.maps.InfoWindow();

    // Import the available locations and create 'Location' objects.
    availableLocations.forEach(function(locationItem){
      this.locationList.push(new Location(locationItem, this.map, this.infowindow));
    }, this);

    // Filter the LocationList:
    this.filteredList = ko.computed(function() {
      var filterStr = this.filterInput().toLowerCase();
      if (!filterStr) {
        // no filter will be applied
        this.showAllMarkers();
        return this.locationList();
      } else {
        // filter the locationsList
        return ko.utils.arrayFilter(this.locationList(), function(location) {
          var filterResult = location.title.toLowerCase().includes(filterStr);
          location.showMarker(filterResult);
          return filterResult;
        });
        // Note: the knockout utility methods are very usefull but I wasn't
        // able to find them in the official documentation for some reason! :o
        // I found the arrayFilter method on other websites, thanks to Google.
        // see: https://stackoverflow.com/questions/20857594/knockout-filtering-on-observable-array
        // also usefull: http://jsfiddle.net/rniemeyer/vdcUA/
      }
    }, this);
  }

  createMap() {
    // Constructor creates a new map
    var map = new google.maps.Map(document.getElementById('map'), {
      // only center and zoom are required.
      center: {lat: 47.075004, lng: 15.436732},
      zoom: 14
    });
    return map;
  }

  showAllMarkers() {
    this.locationList().forEach(function(locationItem) {
      locationItem.showMarker(true);
    })
  }
}

// This function is called after the Google Maps Javascript API has been loaded
function startApp() {
  ko.applyBindings(new ViewModel()); // start APP :)
}
