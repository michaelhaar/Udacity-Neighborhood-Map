// Foursquare API Authorization keys
var CLIENT_ID = "GW0BT31XPTNJUH5UQBJWMY2ZJ4EER40Q015BZO2SGQ52GHVR";
var CLIENT_SECRET = "COX0D1VGNKRVN3DUD0CSAX1XCE04MBIXYFWKU32QWFTW1WSC";
var API_VERSION = "20170801";

/** Class representing a location. */
class Location {
  /**
   * Create a location.
   * @param {string} title - The title of the location.
   * @param {{lat: number, lng: number}} position - The coordinates of the
   *      location.
   * @param {Map} map - The instance of the google.maps.Map class, where the
   *      markers should be placed on.
   * @param {InfoWindow} infowindow - An instanceof the google.maps.InfoWindow
   *      class.
   */
  constructor(title, position, map, infowindow) {
    this.title = title;
    this.position = position;

    // every location object holds a reference to the map and the
    // info-window object.
    this.targetMap = map;
    this.infowindow = infowindow;

    this.createMarker(); // create a marker for the map
    this.requestFoursquareData();  // request data through the Foursquare API
  }

  /**
   * This function calls Foursquare API to get some location specific data.
   * (We'll need the Id, name, street and the city.)
   *
   * The foursquareRequestfailed property will be set to true if the request
   * failed for some reason.
   *
   * visit the following link for details regarding the Foursquare API:
   * https://developer.foursquare.com/docs/api/venues/search
   */
  requestFoursquareData() {
    var foursquareUrl = "https://api.foursquare.com/v2/venues/search?" +
      "ll="+ this.position.lat + "," + this.position.lng + "&" +
      "client_id=" + CLIENT_ID + "&" +
      "client_secret=" + CLIENT_SECRET + "&" +
      "v=" + API_VERSION + "&" +
      "query=" + this.title + "&" +
      "limit=1";
    // console.log("Foursquare search URL: " + foursquareUrl)
    // The response object can be inspected by opening the url in your browser!
    var self = this; // cool trick to access current object in callback func.
    $.getJSON( foursquareUrl, function( data ) {
      // This anonymous function will be run as soon as we get the response
      // back from Foursquare. (This magic trick is done by JQuery)
      var venue = data.response.venues[0];
      self.foursquareId = venue.id;
      self.foursquarename = venue.name;
      self.street = venue.location.address;
      self.city = venue.location.city;
      self.getPhotoFromFoursquare();

    }).fail(function() {
      // runs if the AJAX request fails
      self.foursquareRequestfailed = true;
    });
  }

  /**
   * This function calls Foursquare API to get a photo for the location.
   *
   * The foursquarePhotoRequestfailed property will be set to true if the
   * request failed for some reason.
   *
   * visit the following link for details regarding the Foursquare API:
   * https://developer.foursquare.com/docs/api/venues/photos
   */
  getPhotoFromFoursquare() {
    var foursquarePhotoUrl = "https://api.foursquare.com/v2/venues/" +
      this.foursquareId + "/photos?" +
      "client_id=" + CLIENT_ID + "&" +
      "client_secret=" + CLIENT_SECRET + "&" +
      "v=" + API_VERSION + "&" +
      "limit=1";
    //console.log("Foursquare photo request URL: " + foursquarePhotoUrl)
    // The response object can be inspected by opening the url in your browser!
    var self = this;
    $.getJSON( foursquarePhotoUrl, function( data ) {
      var photo = data.response.photos.items[0];
      self.imgSrc = photo.prefix + "300x300" + photo.suffix;

    }).fail(function() {
      self.foursquarePhotoRequestfailed = true;
    });
  }

  /**
   * Create the google.maps.Marker object for this location.
   *
   * visit the following link for more details
   * https://developers.google.com/maps/documentation/javascript/markers
   */
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
      self.showInfowindow()
    });
  }

  /**
   * Bounce the location specific marker 3 times.
   *
   * visit the following link for more details
   * https://developers.google.com/maps/documentation/javascript/markers#animate
   */
  bounceMarker() {
    // trigger marker animation
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
    // stop marker animation after about 3 bounces.
    var self = this;
    window.setTimeout(function() {
      self.marker.setAnimation(null);
    }, 3*700);
  }

  /**
   * Set the visibility of the location specific marker.
   * @param {boolean} visibility - Desired visibility of the marker.
   */
  showMarker(visibility) {
    if (visibility === true) {
      this.marker.setMap(this.targetMap);
    } else {
      this.marker.setMap(null)
      // If map is set to null, the marker will be removed.
      // see: https://developers.google.com/maps/documentation/javascript/3.exp/reference#Marker
    }
  }

  /**
   * Open the infowindow for this location.
   */
  showInfowindow() {
    this.infowindow.setContent(this.populateInfoWindow());
    this.infowindow.open(this.targetMap, this.marker);
    this.bounceMarker();
  }

  /**
   * Fills the infowindow with the data from Foursquare.
   * (constructing the HTML string like this is a bit messy IMHO, but I haven't
   * found a better solution yet!? :)
   */
  populateInfoWindow() {
    var contentStr = '<div class="infowindow-content"><h3>' + this.title + '</h3>'
    if (this.foursquareRequestfailed) {
      return contentStr + '<p>Foursquare Data Could Not Be Loaded.</p></div>';
    }
    contentStr += '<p> Name on Foursquare: ' + this.foursquarename + '</p>' +
      '<p>Address: ' + this.street + ', ' + this.city + '</p>'
    if (this.foursquarePhotoRequestfailed) {
      return contentStr + '<p>Foursquare Photo Could Not Be Loaded.</p></div>';
    } else {
      return contentStr + '<img class="infowindow-img" src="' + this.imgSrc +
        '"><p>Data is provided by ' +
        '<a href="https://foursquare.com">Foursquare</a>.</p></div>';
    }
  }
}
