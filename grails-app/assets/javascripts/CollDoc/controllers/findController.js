angular.module('CollDoc').controller('FindController',function($scope, $http, $modal) {

			$scope.find = function() {
				
				$scope.queryResult ={pages:[], comments:[]};
				
				//Find in pages
				 $http.get('/find/get?action=queryPages&q=' + $scope.query)
				 .success(function(data, status, headers, config) {
					 	// Open the find settings configuration
					 	$scope.queryResult.pages = data;
					 	
					 	
					 	//Later, find in comments
					 	$http.get('/find/get?action=queryComments&q=' + $scope.query)
						 .success(function(data, status, headers, config) {
							 	$scope.queryResult.comments = data;
							 	
								var modalInstance = $modal.open({
										templateUrl : '/find/get',
										controller: FindInstanceCtrl,
										size : 'lg',
										resolve: {
											queryResult: function () {
										          return $scope.queryResult;
										     }
										}
								});
						 }).error(function(result, code) {
								$scope.addAlert(code,result);
							});
				 }).error(function(result, code) {
						$scope.addAlert(code,result);
					});
			};
});


var FindInstanceCtrl = function ($scope, $modalInstance, queryResult) {
	$scope.queryResult = queryResult;
	$scope.parseFindResults = function (subResult){
		var aux = subResult.replace(new RegExp('<B>', 'g'), '<span class="label label-info">');
		aux = aux.replace(new RegExp('</B>', 'g'), '</span>');
		return aux;
	};
	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	  
	var node_found;
	var children;
	  
	//Find recursively a label
		var findInTree = function(treeData, path2Find){
			for (var i in treeData){
				children = treeData[i].children;
				if (children != undefined && children.length != 0){
					findInTree(children,path2Find);
				}
				if (treeData[i].path == path2Find){
					node_found = treeData[i];
				}
			}
	};
	
	
	//Find a label i a node in the tree
	$scope.open_html_in_tree = function (openPage,path2Find){
		//Close the modal window
		$scope.cancel();
		var treeData = angular.element(document.getElementById('divTreeCtrl')).scope().tree_data;
		findInTree(treeData, path2Find);
		if (node_found == undefined){
			angular.element(document.getElementById('divTreeCtrl')).scope().reset();
		}else{
			angular.element(document.getElementById('divTreeCtrl')).scope().tree_control.select_branch(node_found);
			angular.element(document.getElementById('divTreeCtrl')).scope().tree_handler(node_found);
		}
		if (openPage == false){
			$scope.tab = {tab1: false, tab2: true, tab3:false, tab4:false};
		}
	};
};