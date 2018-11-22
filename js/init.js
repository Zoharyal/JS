

const myMap = {
  arrayOfLocation: null,
  map:null,
  apiVelo: null,
  apiStation: null,
  arrayOfStation: null,

  init: function() {
    this.map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 45.764043,
            lng: 4.835658999999964
        },
        zoom: 13
    });
    this.apiVelo = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=20a81bc95ae471858670e801e23569f309287532';
    this.apiStation='https://api.jcdecaux.com/vls/v1/stations/{station_number}?contract=Lyon&apiKey=20a81bc95ae471858670e801e23569f309287532';
    this.arrayOfLocation = [];
    this.arrayOfStation = [];
    myMap.getDataFromApi();
    myMap.markerClustering();
  },

  getDataFromApi: function() {
    $.getJSON(this.apiVelo, function(data) {
      $.each(data, function(index) {
          myMap.createMarker(data[index]);
      });
  });
  },

  createMarker: function(obj) {
    let myLatLng = {
        lat: obj.position.lat,
        lng: obj.position.lng
    };
    let marker;
    let markerId = obj.number;
    if (obj.status === "CLOSED") {
        marker = new google.maps.Marker({
            position: myLatLng,
            map: this.map,
            icon: 'img/icon1.png',
            id : markerId,
        });
        myMap.markerClusterer.addMarker(marker);
        myMap.arrayOfLocation.push(marker);
    } else  if (obj.bonus === true) {
        marker = new google.maps.Marker({
            position: myLatLng,
            map: this.map,
            icon: 'img/icon1.png',
            id : markerId,
        });
        myMap.markerClusterer.addMarker(marker);
        myMap.arrayOfLocation.push(marker);
    } else {
        marker = new google.maps.Marker({
            position: myLatLng,
            map: this.map,
            icon: 'img/icon1.png',
            id : markerId,
        });
        myMap.markerClusterer.addMarker(marker);
        myMap.arrayOfLocation.push(marker);
    }
    marker.addListener('click', function() {
        for (let i = myMap.arrayOfLocation.length - 1; i>= 0; i--) {
            myMap.arrayOfLocation[i].setAnimation();
            if (myMap.arrayOfLocation[i].id == this.id) {
                myMap.arrayOfLocation[i].setAnimation(google.maps.Animation.BOUNCE);
            }
        }
    });
    if (obj.status === "OPEN") {
    marker.addListener('click', function() {
        myMap.displayInfosMarker(obj);
        myMap.reservBike(obj);
    });
    }

  },
  displayInfosMarker: function(obj) {
    const name = obj.name.split('- ');
    $('#name').text("Nom de la station : " + name[1]);
    $('#address').html("Adresse de la station : <br>" + obj.address);
    $('#bike_number').text("Nombre de total de vélo : " + obj.bike_stands);
    $('#bike_available').text("Nombre de vélo disponible : " + obj.available_bikes);
    $('#place_available').text("Nombre de places disponibles : " + obj.available_bike_stands);
  },
  markerClustering: function() {
    myMap.markerClusterer = new MarkerClusterer(this.map, [], {
        imagePath: './img/m'
    });
  },
  reservBike: function(obj) {
    $('#reserv').click(function() {
      const name = obj.name.split('- ');
      localStorage.setItem('station', name[1]);
      localStorage.setItem('adresse', obj.address);
      if (obj.available_bikes >= 1) {
        myMap.showPopUp();
      } else {
        myMap.showPopUpZero();
      } 
    });
  },
  showPopUp: function() {
    const name = localStorage.getItem('station');
    swal({
      title: 'Réservation',
      text: 'Vous avez réservé un velo a la station' + ' ' + name,
      type: 'success',
      confirmButtonText: 'OK'
    })
  },
  showPopUpZero: function() {
    swal({
      title: 'Oups',
      text: 'Aucun vélo disponible a cette station',
      type: 'error',
      confirmButtonText: 'OK'
    })
  }
}




$(function() {
  myMap.init();
})