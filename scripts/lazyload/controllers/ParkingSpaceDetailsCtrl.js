; (function () {

    var app = angular.module("app.ctrls");
    app.controller("ParkingSpaceDetailsCtrl", ["$scope", '$http', 'ParkingSpaceIdParameter', function ($scope, $http, ParkingSpaceIdParameter) {

        $scope.schedule = { day: 1, type: "Custom", from: 8, to: 9 };
        $scope.Address = '';
        $scope.Vendor = '';
        $scope.Email = '';
        $scope.Phone = '';
        $scope.DailyRates = [];
        $scope.ParkingImage = '';

        var parkingDetails;

        $scope.delete = function () {
            for (var i = 0; i < $scope.DailyRates.length; i++) {
                if ($scope.DailyRates[i].Delete) {
                    $scope.DailyRates.splice(i, 1);
                }
            }
        };

        $scope.selectOption = function () {
            switch ($scope.schedule.type) {
                case "Earlybird":
                    $scope.schedule.from = 8;
                    $scope.schedule.to = 18;
                    $scope.FromDisabled = true;
                    $scope.ToDisabled = true;
                    break;
                case "Night Rate":
                    $scope.schedule.from = 18;
                    $scope.schedule.to = 22;
                    $scope.FromDisabled = true;
                    $scope.ToDisabled = true;
                    break;
                case "Custom":
                    $scope.FromDisabled = false;
                    $scope.ToDisabled = false;
                    break;
            }
        };

        $scope.add = function () {
            if ((/^\s*$/).test($scope.schedule.price) || !$scope.schedule.price) {
                $scope.ParkingError = "Please input price.";
                $scope.ShowParkingValidationError = true;
                return;
            }

            if (parseInt($scope.schedule.from) >= parseInt($scope.schedule.to)) {
                $scope.ParkingError = "Invalid time range.";
                $scope.ShowParkingValidationError = true;
                return;
            }

            $scope.ShowParkingValidationError = false;
            var rate = $scope.schedule.price;
            var day = parseInt($scope.schedule.day);
            var from = $scope.schedule.from;
            var to = $scope.schedule.to;
            $scope.DailyRates.push({ Price: rate, Day: day, From: from, To: to, Delete: false });
        };

        $scope.save = function () {
            var data = parkingDetails;

            var availability = [];
            for (var i = 0; i < $scope.DailyRates.length; i++) {
                var avail = {
                    "Day": $scope.DailyRates[i].Day,
                    "From": $scope.DailyRates[i].From,
                    "To": $scope.DailyRates[i].To,
                    "Price": $scope.DailyRates[i].Price
                }
                availability.push(avail);
            }

            data.Availability = availability;
            $http.post(parkoBaseAPIUrl + '/ParkingDetails?token=' + encodeURIComponent(token) + '&parkingId=' + parkingSpaceId,
              JSON.stringify(data),
              {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              }
                ).then(function (data) {
                    $scope.ShowUpdateSuccess = true;
            }, function (error) {
            });
        };

        $scope.displayDay = function (dayValue) {
            switch (dayValue) {
                case 0:
                    return "Sunday";
                    break;
                case 1:
                    return "Monday";
                    break;
                case 2:
                    return "Tuesday";
                    break;
                case 3:
                    return "Wednesday";
                    break;
                case 4:
                    return "Thursday";
                    break;
                case 5:
                    return "Friday";
                    break;
                case 6:
                    return "Saturday";
                    break;
            }
        };

        $scope.Availability = [];

        var parkingSpaceId = ParkingSpaceIdParameter.Get();
        if (parkingSpaceId == null)
        {
            document.location.href = "#/pages/manageparkingspace";
        }
        var token = localStorage.getItem(parkoTokenKey);

        if (token != null) {

            $scope.ParkingImage = parkoBaseAPIUrl + '/ParkingSpaceImage?token=' + encodeURIComponent(token) + '&parkingId=' + parkingSpaceId;


            $http.get(parkoBaseAPIUrl + '/ParkingDetails?token=' + encodeURIComponent(token) + '&parkingId=' + parkingSpaceId).then(function (data) {

                parkingDetails = data.data;

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
                $scope.DailyRates = data.data.Availability;

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
