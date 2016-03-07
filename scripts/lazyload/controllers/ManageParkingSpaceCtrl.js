; (function () {

    var app = angular.module("app.ctrls");
    app.controller("ManageParkingCtrl", ["$scope", '$http', 'ParkingSpaceIdParameter', function ($scope, $http, ParkingSpaceIdParameter) {
        
        if (localStorage.getItem(parkoTokenKey) == null) {
            document.location.href = "#/pages/signin";
            return false;
        }

        $scope.gotoParkingSpaceDetails = function (parkingSpaceId) {
            ParkingSpaceIdParameter.Set(parkingSpaceId);
            document.location.href = "#/pages/parkingspacedetails";
        };

        var getParkingSpacesAPIUrl = parkoBaseAPIUrl + '/ParkingSpace?token=' + encodeURIComponent(localStorage.getItem(parkoTokenKey));
        $http.get(getParkingSpacesAPIUrl).then(function (result) {
        
            $scope.parkingSpaces = result.data;

        });



    }])

    //=== #end
})()

