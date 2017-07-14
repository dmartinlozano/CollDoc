describe('Testing PageController', function() {
	var dummySettings = [{
	  "projectName": "demoProject",
	  "treeViewJS": [{"label":"Analysis","path":"/analysis","children":[]},{"label":"Design","path":"/design"}]
	  }];
	var dummyPageOK = {
			    "comments": [
			        {
			            "deleted": false,
			            "created": "2014-09-07T20:38:55+0000",
			            "user": "admin",
			            "updated": null,
			            "id": "540cc2663269696c26a5129d",
			            "commentary": "<p>Comentario prueba 1</p>",
			            "idRaw": 1
			        }
			    ],
			    "htmlContent": "<h1>Pagina por defecto 1</h1>",
			    "label": "/index",
			    "path": "/"
			};
	var $scope, ctrl, $httpBackend;
	beforeEach(function() {
		module('CollDoc');
		var dummyElement = document.createElement('div');
		document.getElementById = jasmine.createSpy('HTML Element').andReturn(dummyElement);
		inject(function($rootScope, $controller, $q, _$timeout_, $injector) {
			$scope = $rootScope.$new();
			$httpBackend = $injector.get('$httpBackend');
			ctrl = $controller('PageController', {
				$scope : $scope
			});
		});
	});
	
	it('Dummy Method', function() {
		expect($scope.multiply(5, 6)).toEqual(30);
	});
	
	it('Get Page ok', function() {
		$httpBackend.expect('GET', '/page/get?action=getPage&path=/').respond(200, dummyPageOK);
		$httpBackend.expect('GET', '/api/settings.json').respond(200, dummySettings);
		$httpBackend.flush();
		expect($scope.editor.htmlContent.$$unwrapTrustedValue()).toEqual('<h1>Pagina por defecto 1</h1>');
		expect($scope.selectedNode.label).toEqual('/index');
	});
	
	it('Get Commentary of Page ok', function() {
		$httpBackend.expect('GET', '/page/get?action=getPage&path=/').respond(200, dummyPageOK);
		$httpBackend.expect('GET', '/api/settings.json').respond(200, dummySettings);
		$httpBackend.flush();
		expect($scope.editor.comments[0].commentary).toEqual('<p>Comentario prueba 1</p>');
	});
	
	it('Get Page incorrect', function() {
		//TODO
//		$httpBackend.expect('GET', '/page/get?action=getPage&path=/patata').respond(404, "/patata doesn't found in file system");
//		$httpBackend.expect('GET', '/api/settings.json').respond(200, dummySettings);
//		$httpBackend.flush();
//		expect($scope.editor.comments[0].commentary).toEqual('<p>Comentario prueba 1</p>');
	});
});