; (function () {

    var app = angular.module("app.ctrls");
    app.controller("SignInCtrl", ["$scope", '$http', function ($scope, $http) {

        $scope.submitLogin = false;
        $scope.login = function () {
            $scope.submitLogin = true;
            var data = {
                "Username": $scope.username,
                "Password": $scope.password,
                "Source": "mobile"
            };
            $http.post('http://core.parko.co.nz/api/AdminUser',
              JSON.stringify(data),
              {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              }
          ).then(function (data) {
              $scope.submitLogin = false;
              localStorage.setItem("ParkoAdminToken", data.data.Token);
              document.location.href = "/";
          }, function (error) {
              $scope.submitLogin = false;
              $scope.alertShow = true;
              $scope.ErrorLoginMessage = error.data;
          });

        };

    }])

    //=== #end
})()