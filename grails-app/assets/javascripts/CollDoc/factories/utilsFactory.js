angular.module('CollDoc').factory('UtilsFactory', [ '$http', function($http) {
	var UtilsFactory = {};
	UtilsFactory.toCamelCase = function(s) {
		if (undefined === s)
			return;
		s = s.replace(/([^a-zA-Z0-9\- ])|^[_0-9]+/g, "").trim().toLowerCase();
		// uppercase letters preceeded by a hyphen or a space
		s = s.replace(/([ -]+)([a-zA-Z0-9])/g, function(a, b, c) {
			return c.toUpperCase();
		});
		// uppercase letters following numbers
		s = s.replace(/([0-9]+)([a-zA-Z])/g, function(a, b, c) {
			return b + c.toUpperCase();
		});
		return s;
	};
	return UtilsFactory;
}]);