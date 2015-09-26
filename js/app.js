
function ViewModel() {


var map;
var infowindow;




function initMap() {
  // Create a map object and specify the DOM element for display.

  var city = new google.maps.LatLng(32.7767,  -96.7970);
  var mapOptions = {
    center: city,
    scrollwheel: true,
    zoom: 14
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  infowindow = new google.maps.InfoWindow();

  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
  	location: city,
  	radius: 1500, 
  	keyword: 'bar'
  }, callback);

}


function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}

	console.log(results);

	console.log(results[0].name)

}


function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);

	});
}






initMap();


}

var viewModel = function() {

	self =this;
}

ViewModel();




$('#form-container').submit(viewModel);