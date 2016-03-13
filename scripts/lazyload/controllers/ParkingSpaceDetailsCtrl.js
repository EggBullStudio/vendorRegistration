; (function () {

    var app = angular.module("app.ctrls");
    app.controller("ParkingSpaceDetailsCtrl", ["$scope", '$http', 'ParkingSpaceIdParameter', function ($scope, $http, ParkingSpaceIdParameter) {

        $scope.Address = '';
        $scope.Vendor = '';
        $scope.Email = '';
        $scope.Phone = '';

        $scope.Availability = [];

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

                $scope.Address = data.data.Address;
                $scope.Vendor = data.data.Fullname;
                $scope.Email = data.data.Email;
                $scope.Phone = data.data.Phone;

                $.each(data.data.Availability, function (index, item) {
                    var day;
                    var from;
                    var To;
                    switch (item.Day) {
                        case 0:
                            day = "Sun";
                            break;
                        case 1:
                            day = "Mon";
                            break;
                        case 2:
                            day = "Tue";
                            break;
                        case 3:
                            day = "Wed";
                            break;
                        case 4:
                            day = "Thu";
                            break;
                        case 5:
                            day = "Fri";
                            break;
                        case 6:
                            day = "Sat";
                            break;
                    }
                    if (item.From < 12) {
                        from = item.From + ":00 am";
                    }
                    if (item.From == 12) {
                        from = item.From + ":00 pm";
                    }
                    if (item.From > 12) {
                        var t = item.From - 12;
                        from = t + ":00 pm";
                    }
                    if (item.To < 12) {
                        to = item.To + ":00 am";
                    }
                    if (item.To == 12) {
                        to = item.To + ":00 pm";
                    }
                    if (item.To > 12) {
                        var t = item.To - 12;
                        to = t + ":00 pm";
                    }
                    $scope.Availability.push({
                        Day: day, From: from, To: to
                    });

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
