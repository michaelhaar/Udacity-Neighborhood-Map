/** Class representing a location. */
class ViewModel {
  /** Create a ViewModel. **/
  constructor() {
    // Initialize some KnockoutJS variables/observables.
    // see: http://knockoutjs.com/documentation/observables.html
    this.filterInput = ko.observable("");
    this.locationList = ko.observableArray(); //init an empty array

    // Init the some required Google Maps objects.
    // We are using the Google Maps Javascript API.
    // see: https://developers.google.com/maps/documentation/javascript
    this.map = this.createMap();
    this.infowindow = new google.maps.InfoWindow();
    this.bounds = new google.maps.LatLngBounds();

    // Import the available locations and create 'Location' objects.
    availableLocations.forEach(function(loc){
      this.locationList.push(
        new Location(loc.title, loc.position, this.map, this.infowindow));
    }, this);
    this.fitBoundsToLocations(this.locationList());

    // Filter the LocationList with KnockoutJS:
    this.filteredList = ko.computed(function() {
      var filterStr = this.filterInput().toLowerCase();
      if (!filterStr) {
        // no filter will be applied
        this.showAllMarkers();
        this.fitBoundsToLocations(this.locationList());
        return this.locationList();
      } else {
        // filter the locationsList
        var remainingLocations = ko.utils.arrayFilter(this.locationList(), function(location) {
          var filterResult = location.title.toLowerCase().includes(filterStr);
          location.showMarker(filterResult);
          return filterResult;
        });
        this.fitBoundsToLocations(remainingLocations);
        return remainingLocations;
        // Note: the knockout utility methods are very usefull but I wasn't
        // able to find them in the official documentation for some reason! :o
        // I found the arrayFilter method on other websites, thanks to Google.
        // see: https://stackoverflow.com/questions/20857594/knockout-filtering-on-observable-array
        // also usefull: http://jsfiddle.net/rniemeyer/vdcUA/
      }
    }, this);
  }

  /**
   * Creates a new google.maps.Map instance, which is centered to my city.
   * see: https://developers.google.com/maps/documentation/javascript/tutorial
   * @return {Map} the map object.
   */
  createMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      // only center and zoom are required.
      center: {lat: 47.075004, lng: 15.436732},
      zoom: 10
    });
    return map;
  }

  /**
   * Displays/Activates the markers for all locations on the map
   */
  showAllMarkers() {
    this.locationList().forEach(function(locationItem) {
      locationItem.showMarker(true);
    });
  }

  /**
   * Extend the boundaries of the map so that we can see the active locations.
   */
  fitBoundsToLocations(activeLocations) {
    activeLocations.forEach(function(locationItem) {
      this.bounds.extend(locationItem.position);
    }, this);
    // Extend the boundaries of the map for each marker
    this.map.fitBounds(this.bounds);
  }
}

/**
 * This function will kick-off our neighborhood app. It is called after
 * the Google Maps Javascript API has been successfully loaded.
 * (This callback is defined in the index.html file)
 */
function startApp() {
  ko.applyBindings(new ViewModel()); // start APP :)
}
