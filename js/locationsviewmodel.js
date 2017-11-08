// "Function-Based-Class" to represent a row in the locations grid
function Location(data) {
    var self = this;
    self.title = data.title;
    self.postion = data.position;


}

// Overall viewmodel for this screen, along with initial state
function ViewModel() {
    var self = this; // 'self' is refering to the ViewModel object itself.

    self.filterInput = ko.observable("");


    self.locationList = ko.observableArray(); //init an empty array
    availableLocations.forEach(function(locationItem){
      self.locationList.push(new Location(locationItem));
    });

    // The clicked item will be passed as the first parameter
    // see: http://knockoutjs.com/documentation/click-binding.html
    self.selectLocation = function(clickedLocation) {
      console.log('Clicked: '+clickedLocation.title)
    }

    // self.filteredList = ko.computed( function() {
    //   var filter =
    // });
}

ko.applyBindings(new ViewModel());
