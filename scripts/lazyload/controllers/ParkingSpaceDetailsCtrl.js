; (function () {

    var app = angular.module("app.ctrls");
    app.controller("ParkingSpaceDetailsCtrl", ["$scope", '$http', 'ParkingSpaceIdParameter', function ($scope, $http, ParkingSpaceIdParameter) {
        var parkingSpaceId = ParkingSpaceIdParameter.Get();
    }])

    //=== #end
})()
