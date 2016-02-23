;(function() {

    var app = angular.module("app.ctrls");
    app.controller("DashboardCtrl", ["$scope", '$location', '$anchorScroll', function ($scope, $location, $anchorScroll) {
        $scope.registration = {};
        $scope.DailyRates = [];

        $scope.schedule = { day: "Monday", type: "Custom", from: 8, to: 9 };

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
            $location.hash('ValidationErrorAnchor');
            if (((/^\s*$/).test($scope.registration.email) || !$scope.registration.email) ||
                ((/^\s*$/).test($scope.registration.firstname) || !$scope.registration.firstname) ||
                ((/^\s*$/).test($scope.registration.surname) || !$scope.registration.surname) ||
                ((/^\s*$/).test($scope.registration.address) || !$scope.registration.address)) {
                $scope.ShowFormValidationError = true;
                $scope.ShowSuccess = false;
                $scope.ValidationError = "Please input all required fields.";
                $anchorScroll();
                return;
            }
            $scope.ShowFormValidationError = false;
            $scope.ShowSuccess = true;
            $location.hash('ValidationErrorAnchor');
            $anchorScroll();
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

    }])

    //=== #end
})()

