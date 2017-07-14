angular.module('CollDoc').controller('LoginController', 
		['$http', '$log', '$scope', '$window', 
		 function($http, $log, $scope, $window) {
	this.credentials = {};
	this.login = function() {
		//To do login
		$http.post('/auth/api/login', {
			username : this.credentials.username,
			password : this.credentials.password
		}).success(function(userResult) {
			$window.sessionStorage.token = userResult.access_token;
			$window.sessionStorage.username = userResult.username;
			var username = userResult.username;
			//If login is correct, get all information about the user
			$http.get('/settings/listRoles?action=getAuthorityRoleByUser&user='+username)
			 .success(function(authority) {
				 $window.sessionStorage.authority = authority;
				 $scope.allowed = true;
				$window.location.href = '/dashboard';
			}).error(function(result, code) {
				delete $window.sessionStorage.token;
				$scope.allowed = false;
			});
		}).error(function(data) {
			delete $window.sessionStorage.token;
			$scope.allowed = false;
		});
	};
}]);