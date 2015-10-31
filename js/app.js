
// sources http://codepen.io/prather-mcs/pen/KpjbNN - Used the idea for the List filetering


// List of data 
var locationData = [
  {
    locationName: 'Bread Winners',
    latLng: {lat: 32.804653, lng: -96.799586},
    yelpID: 'bread-winners-cafe-and-bakery-dallas-4',
    yelpName: null
    
  },
  
  {
    locationName: 'So & Sos',
    latLng: {lat: 32.804838, lng: -96.799296},
    yelpID: 'so-and-sos-dallas',
    yelpName: null

  },
  
  {
    locationName: 'Public School',
    latLng: {lat: 32.80782, lng: -96.796436},
    yelpID: 'public-school-214-dallas-3',
    yelpName: null
  },

  {
    locationName: 'Taco Diner',
    latLng: {lat: 32.807903, lng: -96.797732},
    yelpID: 'taco-diner-dallas',
    yelpName: null
  },

  {
    locationName: 'Del Friscos',
    latLng: {lat: 32.803483, lng: -96.799090},
    yelpID: 'del-friscos-grille-dallas',
    yelpName: null
  }

];



// View Model

var koViewModel = function() {
  var self = this;

  var infowindow = new google.maps.InfoWindow();
  
  
  // Build the Google Map object. Store a reference to it.
  self.googleMap = new google.maps.Map(document.getElementById('map-canvas'), {
    center: {lat: 32.804653, lng: -96.799586},
    zoom: 16
  });
  
  

 //  Sourced from  http://codepen.io/prather-mcs/pen/KpjbNN - Used this method of creating an array of all elements, and 
 //  one of the visible elements to be show when list filtering.

  // Build "Place" objects out of raw place data. It is common to receive place
  // data from an API like FourSquare. Place objects are defined by a custom
  // constructor function you write, which takes what you need from the original
  // data and also lets you add on anything else you need for your app, not
  // limited by the original data.
  self.allPlaces = [];
  locationData.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });
  
  
  // Build Markers via the Maps API and place them on the map.
  self.allPlaces.forEach(function(place) {
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng,
      animation: google.maps.Animation.DROP
    };
    
  
    place.marker = new google.maps.Marker(markerOptions);



// Yelp API call - Ideas sourced from Udacity office hours and discussion board.

  function nonce_generate() {
    return (Math.floor(Math.random() * 1e12).toString());
  }

// Users the Business ID in the location data
  var YELP_BASE_URL = 'https://api.yelp.com/v2/'

  var yelp_url = YELP_BASE_URL + 'business/' + place.yelpID;

      var parameters = {
        oauth_consumer_key: 'Yn-PC-1RRCMvJgfNe-mE6A',
        oauth_token: 'tR4TGKQAaYKfUV0kNmnO85YpwnN8I8Ji',
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now()/1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version : '1.0',
        callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
      },

// Not sure of how to keep these hidden yet.  Need to reveiw Oauth some more.  
      YELP_KEY_SECRET = 'Ho0wd7VAyNSmg225bgGAvPCyJvk',
      YELP_TOKEN_SECRET = 'BoeCfNUVcKko2mQAo3t_hd759AI';

      var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
      parameters.oauth_signature = encodedSignature;

      var settings = {
        url: yelp_url,
        data: parameters,
        cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
        dataType: 'jsonp',
        success: function(results) {
          // Do stuff with results
          
        place.yelpName = '<div> <h1> <a href=' + results.url + '>'  + results.name  + '</a> </h1> </div> <div> <h4> Number of Reviews: ' + results.review_count +' </h4> </div> <div> <img src="'+ results.rating_img_url + '"' +'</div>';

        
  
        },
        fail: function() {
          // Do stuff on fail
          console.log('Yelp API Error');

        }
      };

      // Send AJAX query via jQuery library.
      $.ajax(settings);


  

        google.maps.event.addListener(place.marker, 'click', function() {

        self.openInfo(place);


    });


  

   });


  // cc - Toggles the map markers when clicked.  
  function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
    

  // cc - Opens the info window, sets the content, and toggles the bounce of the map marker.  
  self.openInfo = function (place) {

    
    infowindow.setContent(place.yelpName);
    infowindow.open(self.googleMap, place.marker);

    toggleBounce(place.marker);

     
    
  }


  
  // This array will contain what its name implies: only the markers that should
  // be visible based on user input. My solution does not need to use an 
  // observableArray for this purpose, but other solutions may require that.
  self.visiblePlaces = ko.observableArray();
  
  
  // All places should be visible at first. We only want to remove them if the
  // user enters some input which would filter some of them out.
  self.allPlaces.forEach(function(place) {
    self.visiblePlaces.push(place);
  });
  
  
  // This, along with the data-bind on the <input> element, lets KO keep 
  // constant awareness of what the user has entered. It stores the user's 
  // input at all times.
  self.userInput = ko.observable('');
    
  // The filter will look at the names of the places the Markers are standing
  // for, and look at the user input in the search box. If the user input string
  // can be found in the place name, then the place is allowed to remain 
  // visible. All other markers are removed.


  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();
    
    self.visiblePlaces.removeAll();
    
    // This looks at the name of each places and then determines if the user
    // input can be found within the place name.
    self.allPlaces.forEach(function(place) {
      place.marker.setVisible(false);
      
      if (place.locationName.toLowerCase().indexOf(searchInput) !== -1) {
        self.visiblePlaces.push(place);
      }
    });
    
    
    self.visiblePlaces().forEach(function(place) {
      place.marker.setVisible(true);
    });
  };
  
  
  function Place(dataObj) {
    this.locationName = dataObj.locationName;
    this.latLng = dataObj.latLng;
    this.yelpID = dataObj.yelpID;
    this.yelpName = dataObj.yelpName;
    
    // You will save a reference to the Places' map marker after you build the
    // marker:
    this.marker = null;
  }
  

};

ko.applyBindings(new koViewModel());
