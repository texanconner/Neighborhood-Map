function initMap() {
  // Create a map object and specify the DOM element for display.

  var city = new google.maps.LatLng(21.284712,  -157.805762);
  var mapOptions = {
    center: city,
    scrollwheel: true,
    zoom: 8
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
}





