var app = angular.module('myApp', []);
app.controller('personCtrl', function($scope) {
    $scope.firstName = "知周";   
    $scope.lastName = "李";      
    $scope.fullName = function() {
        return $scope.firstName + " " + $scope.lastName;
    }                                
});