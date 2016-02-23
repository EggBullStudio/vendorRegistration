;(function() {

    var app = angular.module("app.ctrls");
    app.controller("DashboardCtrl", ["$scope", function ($scope) {
        $scope.DailyRates = [];

        $scope.schedule = { day: "Monday", type: "Earlybird", from: 8, to: 9, price:1 };

        $scope.add = function () {
            var rate = $scope.schedule.price;
            var day = $scope.schedule.day;
            var type = $scope.schedule.type;
            var from = $scope.schedule.from;
            var to = $scope.schedule.to;
            $scope.DailyRates.push({Rate: rate, Day: day, Type: type, From: from, To: to, Delete: false});
        };

        $scope.delete = function () {
            for (var i = 0; i < $scope.DailyRates.length; i++) {
                if ($scope.DailyRates[i].Delete) {
                    $scope.DailyRates.splice(i, 1);
                }
            }
        };

    }])

    //=== #end
})()

