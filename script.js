var map, infoWindow;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 15
        });
        infoWindow = new google.maps.InfoWindow();

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            var mark = new google.maps.Marker({
              map : map,
              position : pos
            });

            google.maps.event.addListener(mark, 'click', function() {
              infoWindow.setPosition(pos);
              infoWindow.setContent('Location found.');
              infoWindow.open(map, this);
            });

            map.setCenter(pos);
            
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location : pos,
                radius : 5500,
                type : [ 'shopping_mall' ]
            }, callback)

            service.nearbySearch({
              location : pos,
              radius : 5500,
              type : [ 'bus_station' ]
            }, callback)

            service.nearbySearch({
              location : pos,
              radius : 5500,
              type : [ 'subway_station' ]
            }, callback)

            service.nearbySearch({
              location : pos,
              radius : 5500,
              type : [ 'taxi_stand' ]
            }, callback)

            function callback(results, status) {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                  for (var i = 0; i < results.length; i++) {
                      createMarker(results[i]);
                  }
              }
            }
  
            function createMarker(place) {
              var placeLoc = place.geometry.location;
              var icon={
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
              }
              var marker = new google.maps.Marker({
                  map : map,
                  icon: icon,
                  position : placeLoc
              });
  
              google.maps.event.addListener(marker, 'click', function() {
                  infoWindow.setContent(place.name);
                  infoWindow.open(map, this);
              });
            }

          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }