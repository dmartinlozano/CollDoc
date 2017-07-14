angular.module('CollDoc').service('PageService', function($cacheFactory) {
	
	var cache = $cacheFactory('PageCache');
	var commentary = {idRaw: "", page: null, commentary: "", user: "", created: null, updated: null};
	var page = {label: "", path: "", htmlContent: "", comments: []};
	
	this.getPageByPath = function(path) {
		 return cache.get(path);
	};
	
	this.addOrPudatePageByPath = function(page){
		var previousPage = cache.get(page.path);
		if (previousPage != undefined){
			cache.remove(previousPage.path);
		}
		cache.put(page.path,page);
	};
	
	this.deleteAPage = function(path){
		var previousPage = cache.get(path);
		if (previousPage != undefined){
			cache.remove(path);
		}
	}
	
	//pageService.rename(path, label);
	this.renameAPage = function(path, label){
		var previousPage = cache.get(page.path);
		if (previousPage != undefined){
			previousPage.label = label;
		}
	}
	
	this.addComentaryToPage = function(page, commentary){
		var previousPage = cache.get(page.path);
		if (previousPage == undefined){
			page.push(commentary);
			cache.put(page.path,page);
		}else{
			previousPage.push(commentary);
			//TODO Comprobar si esto reemplaza o annade:
			cache.put(page.path,page);
		}
	};
});