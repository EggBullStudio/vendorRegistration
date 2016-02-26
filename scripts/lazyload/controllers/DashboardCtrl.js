;(function() {

    var app = angular.module("app.ctrls");
    app.controller("DashboardCtrl", ["$scope", '$http', function ($scope, $http) {
        $scope.registration = {numOfVehicle: 1};
        $scope.DailyRates = [];

        

        $scope.schedule = { day: "1", type: "Custom", from: 8, to: 9 };

        $scope.displayDay = function (dayValue) {
            switch (dayValue) {
                case "0":
                    return "Sunday";
                    break;
                case "1":
                    return "Monday";
                    break;
                case "2":
                    return "Tuesday";
                    break;
                case "3":
                    return "Wednesday";
                    break;
                case "4":
                    return "Thursday";
                    break;
                case "5":
                    return "Friday";
                    break;
                case "6":
                    return "Saturday";
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
            var day = $scope.schedule.day;
            var type = $scope.schedule.type;
            var from = $scope.schedule.from;
            var to = $scope.schedule.to;
            $scope.DailyRates.push({ Rate: rate, Day: day, Type: type, From: from, To: to, Delete: false });
        };

        $scope.delete = function () {
            for (var i = 0; i < $scope.DailyRates.length; i++) {
                if ($scope.DailyRates[i].Delete) {
                    $scope.DailyRates.splice(i, 1);
                }
            }
        };

        $scope.submit = function () {
            $scope.DisableSubmit = true;
            if (((/^\s*$/).test($scope.registration.email) || !$scope.registration.email) ||
                ((/^\s*$/).test($scope.registration.firstname) || !$scope.registration.firstname) ||
                ((/^\s*$/).test($scope.registration.password) || !$scope.registration.password) ||
                ((/^\s*$/).test($scope.registration.surname) || !$scope.registration.surname) ||
                ((/^\s*$/).test($scope.registration.address) || !$scope.registration.address)) {
                $scope.ShowFormValidationError = true;
                $scope.ShowSuccess = false;
                $scope.ValidationError = "Please input all required fields.";
                $scope.DisableSubmit = false;
                return;
            }

            if (((/^\s*$/).test($scope.registration.lat) || !$scope.registration.lat) ||
                ((/^\s*$/).test($scope.registration.lng) || !$scope.registration.lng)) {
                $scope.ShowFormValidationError = true;
                $scope.ShowSuccess = false;
                $scope.ValidationError = "Please select a valid address.";
                $scope.DisableSubmit = false;
                return;
            }

            var availability = [];
            for (var i=0; i < $scope.DailyRates.length; i++){
                var avail = {
                    "Day": $scope.DailyRates[i].Day,
                    "From": $scope.DailyRates[i].From,
                    "To": $scope.DailyRates[i].To,
                    "Price": $scope.DailyRates[i].Rate
                }
                availability.push(avail);
            }

            var data = {
                "Firstname": $scope.registration.firstname,
                "Surname": $scope.registration.surname,
                "Email": $scope.registration.email,
                "Password": $scope.registration.password,
                "Address": $scope.registration.address,
                "Lat": $scope.registration.lat,
                "Lng": $scope.registration.lng,
                "PricePerHour": 0,
                "NumberOfVehicle": $scope.registration.numOfVehicle,
                "Availability": availability,
                "Phone" : $scope.registration.phone
            };

            $http.post('http://core.parko.co.nz/api/ParkingSpace',
              JSON.stringify(data),
              {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              }
          ).then(function (data) {
              $scope.ShowUploadMessage = true;

              var fileFormData = new FormData();
              var fileInput = document.getElementById('uploadFile');
              if (fileInput.files.length > 0) {
                  fileFormData.append("files", fileInput.files[0]);
                  fileFormData.append("filename", fileInput.files[0].name);
                  fileFormData.append("parkingspaceid", data.data.Id);

                  var uploadRequest = {
                      method: 'PUT',
                      url: 'http://core.parko.co.nz/api/ParkingSpace',
                      data: fileFormData,
                      headers: {
                          'Content-Type': undefined
                      }
                  };

                  $http(uploadRequest)
                      .success(function (d) {
                          $scope.ShowUploadMessage = false;
                          $scope.registration = { numOfVehicle: 1 };
                          $scope.DailyRates = [];
                          $scope.schedule = { day: "1", type: "Custom", from: 8, to: 9 };
                          $scope.ShowFormValidationError = false;
                          $scope.ShowSuccess = true;
                          $scope.DisableSubmit = false;
                      })
                      .error(function (ee) {
                          alert(ee);
                      });
              }
              else {
                  $scope.ShowUploadMessage = true;
                  $scope.registration = { numOfVehicle: 1 };
                  $scope.DailyRates = [];
                  $scope.schedule = { day: "1", type: "Custom", from: 8, to: 9 };
                  $scope.ShowFormValidationError = false;
                  $scope.ShowSuccess = true;
                  $scope.DisableSubmit = false;
              }
              



          }, function (error) {
              $scope.DisableSubmit = false;
              var g = error;
          });



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

        var input = (document.getElementById('txtAddress'));
        var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
            $scope.registration.lat = place.geometry.location.lat();
            $scope.registration.lng = place.geometry.location.lng()
            $scope.registration.address = place.formatted_address;
        });

    }])

    //=== #end
})()

