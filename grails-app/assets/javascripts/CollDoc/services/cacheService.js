angular.module('CollDoc').service('CacheService', function($cacheFactory) {
	var cache = $cacheFactory('CollDocCache');
    this.get = function(key) {
        return  cache.get(key);
    };
    this.put = function(key, value) {
        return  cache.put(key,value);
    };
});