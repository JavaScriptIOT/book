var app = angular.module('myApp', []);
app.service('hexafy', function() {  
    this.myFunc = function (x) {    
        return x.toString(16);
    }
});
app.controller('personCtrl', function($scope, hexafy) {
    $scope.hex = hexafy.myFunc(255);
});