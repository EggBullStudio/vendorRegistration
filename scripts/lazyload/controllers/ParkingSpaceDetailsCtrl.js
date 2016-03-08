; (function () {

    var app = angular.module("app.ctrls");
    app.controller("ParkingSpaceDetailsCtrl", ["$scope", '$http', 'ParkingSpaceIdParameter', function ($scope, $http, ParkingSpaceIdParameter) {

        var parkingSpaceId = ParkingSpaceIdParameter.Get();
        if (parkingSpaceId == null)
        {
            document.location.href = "#/pages/manageparkingspace";
        }
        var token = localStorage.getItem(parkoTokenKey);
        if (token != null) {

            $http.get('http://core.parko.co.nz/api/ParkingDetails?token=' + encodeURIComponent(token) + '&parkingId=' + parkingSpaceId).then(function (data) {

                var currentLat = data.data.Lat;
                var currentLng = data.data.Lng;

                var position = new google.maps.LatLng(currentLat, currentLng);
                var mapOptions = {
                    //center: { lat: $(item).data("lat"), lng: $(item).data("long") },
                    center: position,
                    zoom: 12
                };
                var map = new google.maps.Map(document.getElementById("map"),
                    mapOptions);

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(currentLat, currentLng),
                    map: map
                });

            }, function (error) {


            });

            $("#parkingBookingSchedule").fullCalendar({});

        }

        else {
            document.location.href = "#/pages/signin";
        }

    }])

    //=== #end
})()
