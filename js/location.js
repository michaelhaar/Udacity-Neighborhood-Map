// Foursquare API Authorization keys
var CLIENT_ID = "GW0BT31XPTNJUH5UQBJWMY2ZJ4EER40Q015BZO2SGQ52GHVR";
var CLIENT_SECRET = "COX0D1VGNKRVN3DUD0CSAX1XCE04MBIXYFWKU32QWFTW1WSC";
var API_VERSION = "20170801";

class Location {
  constructor(locationData, map, infowindow) {
    this.title = locationData.title;
    this.position = locationData.position;

    // every location object holds a reference to the map and the
    // info-window object:
    this.targetMap = map;
    this.infowindow = infowindow;

    this.createMarker(); // create a marker for the map
    this.findOnFoursquare();  // request data through the Foursquare API
  }


  findOnFoursquare() {
    // This function calls Foursquare API
    // see: https://developer.foursquare.com/docs/api/venues/search
    var foursquareUrl = "https://api.foursquare.com/v2/venues/search?" +
      "ll="+ this.position.lat + "," + this.position.lng + "&" +
      "client_id=" + CLIENT_ID + "&" +
      "client_secret=" + CLIENT_SECRET + "&" +
      "v=" + API_VERSION + "&" +
      "query=" + this.title + "&" +
      "limit=1";

    //console.log("Foursquare search URL: " + foursquareUrl)
    // The response object can be inspected by opening the url in your browser ;)
    var self = this; // cool trick to access current object in callback func.
    $.getJSON( foursquareUrl, function( data ) {
      // This anonymous function will be run as soon as we get the response
      // back from Foursquare
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

  getPhotoFromFoursquare() {
    // calls the 'venue photo' endpoint from the Foursquare API
    // see: https://developer.foursquare.com/docs/api/venues/photos
    var foursquarePhotoUrl = "https://api.foursquare.com/v2/venues/" +
      this.foursquareId + "/photos?" +
      "client_id=" + CLIENT_ID + "&" +
      "client_secret=" + CLIENT_SECRET + "&" +
      "v=" + API_VERSION + "&" +
      "limit=1";

    //console.log("Foursquare photo request URL: " + foursquarePhotoUrl)
    // The response object can be inspected by opening the url in your browser ;)
    var self = this;
    $.getJSON( foursquarePhotoUrl, function( data ) {
      var photo = data.response.photos.items[0];
      self.imgSrc = photo.prefix + "300x300" + photo.suffix;

    }).fail(function() {
      self.foursquarePhotoRequestfailed = true;
    });
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
      self.showInfowindow()
    });
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


  showInfowindow() {
    this.setInfowindowContent();
    this.infowindow.open(this.targetMap, this.marker);
    this.bounceMarker();
  }

  setInfowindowContent() {
    this.infowindow.setContent(this.populateInfoWindow());
  }

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
        '">';
    }
  }
}
