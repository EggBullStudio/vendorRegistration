;(function() {

    angular.module("app.services", [])

    .service("ParkingSpaceIdParameter", function () {
        var parkingSpaceId = null;

        function set(data) {
            parkingSpaceId = data;
        }

        function get() {
            return parkingSpaceId;
        }

        return {
            Set: set,
            Get: get
        };
    })

}())
