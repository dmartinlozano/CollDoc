angular.module('CollDoc').controller('SettingsController', [ '$http', '$log', '$scope', '$window', '$modal', function($http, $log, $scope, $window, $modal) {
	//Load the left tree and sho the name of the project
	this.load = function() {
	    $http.get('/api/settings.json').success(function(data, status, headers, config) {
	    	$scope.projectName = data[0].projectName;
	     });
	};
	
	//Open the modal window for settings
	$scope.open_settings_modal = function(){
		var settingsModalInstance = $modal.open({
			templateUrl : '/settings/get',
			size : 'lg',
			controller: SettingsModalInstanceCtrl
		});
		//$('#divSettingsModal').modal('show');
	};
	
	//*************************************************************************************
	//RENAME PROJECT
	$scope.newProjectName = $scope.projectName;
	$scope.rename_project = function () {
		var username = $window.sessionStorage.username;
		var newProjectName = angular.element(document.getElementById('newProjectNameId')).scope().newProjectName;
		//rename project
		$http.put('/settings/put?action=renameProject&newProjectName='+newProjectName+'&oldProjectName='+$scope.projectName+'&user='+username,null)
		.success(function(result) {
			//TODO not work: the panel is not hidden
			$('#divSettingsModal').modal('hide');
		}).error(function(result, code) {
			$scope.addAlert(code,result);
			return;
		});
	}
	
	//Controller to manage Settings
	var SettingsModalInstanceCtrl = function ($http, $scope, $modalInstance, $filter, $q, ngTableParams) {
			
			$scope.alerts = [];
			
			 $scope.closeAlert = function(index) {
				  $scope.alerts.splice(index, 1);
			};
			
			 $scope.addAlert = function(code,message) {
				    $scope.alerts.push( { type: 'danger', msg: code+": "+message });
				  };
			
			//tableParams for permissions tab
			$scope.tablePermissionsParams = new ngTableParams({
				  page: 1,   // show first page
				  count: 5  // count per page
			}, {
				  counts: [], // hide page counts control
				  total: 1  // value less than count hide pagination
			});
				  
			//List users
			 var list_users = function(){
				 var username = $window.sessionStorage.username;
				 $http.get('/settings/listUsers?action=getUsers&user='+username)
				.success(function(data) {
					$scope.userTableParams = new ngTableParams({
				        page: 1,            // show first page
				        count: 5,          // count per page
				        sorting: {
				        	username: 'asc'     // initial sorting
				        }
				    }, {
				        total: data.length, // length of data
				        counts: [5,10,20,30,50,100], // hide page counts control
				        getData: function($defer, params) {
				            // use build-in angular filter
				        	var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;
				            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : data;
				            $scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
				            params.total(orderedData.length); // set total for recalc pagination
				            $defer.resolve($scope.users);
				        }
				    });
				}).error(function(result, code) {
					$scope.addAlert(code,result);
				});
			};
			 
			 //*************************************************************************************
			 //USER MANAGEMENT
			 
			 //To add data in Add/Edit user window
			 $scope.newOrEditUser = function(user){
				 if (user == undefined){
					 //To create an user
					 $scope.newEditUser ={title:'Create a new user',id:'',userName:'',password:'',role:'', userNameValid:true};
				 }else{
					 //to edit an user
					 $scope.newEditUser ={title:'Edit user: '+user.username, id:user.id, userName:user.username, password:user.password, role:user.role, userNameValid:true};
					 for (i=0;i<document.getElementById('selectRoles').options.length;i++){
						    if (document.getElementById('selectRoles').options[i].text == user.role){
						      document.getElementById('selectRoles').options[i].selected = 'selected';
						    }
						}
					 //$scope.newEditUser ={title:'Edit user: '+user.username,userName:user.username, password:user.password, role:$scope.roles[1]};
				 }
				 $('#newEditUser').modal('show');
			 };
			 
			 //To delete an user
			 $scope.deleteUser = function(user){
				 $http.delete('/settings/delete?action=deleteUser&id='+user.id)
				 .success(function(result) {
					list_users();
				}).error(function(result, code) {
						$scope.addAlert(code,result);
				});
			 }
			 
			 //save new user /edit user
			 $scope.save_changes_for_user = function(){
				 if ($scope.newEditUser.userName == undefined || $scope.newEditUser.password == undefined || $scope.newEditUser.role == undefined){
					 $('#missingDataForUser').modal('show');
					 return;
				 }
				 if ($scope.newEditUser.userName == "" || $scope.newEditUser.password == "" || $scope.newEditUser.role == ""){
					 $('#missingDataForUser').modal('show');
					 return;
				 }
				 //Check if the user exists in a new user
				 if ($scope.newEditUser.id == ""){
					 $http.get('/settings/listUsers?action=getUser&newUser='+$scope.newEditUser.userName)
					 .success(function(result) {
						 if (result!=""){
								$('#userNameIsInUse').modal('show');
								return;
							}
					}).error(function(result, code) {
							$scope.addAlert(code,result);
					});
				 }
				 //Update or create the user
				 if ($scope.newEditUser.id == ""){
					 //new user
					 $http.post('/settings/post?action=createUser',JSON.stringify($scope.newEditUser))
						.success(function(result) {
							$('#newEditUser').modal('hide');
							list_users();
						}).error(function(result, code) {
							$scope.addAlert(code,result);
							return;
						});
				 }else{
					 //update user
					 $http.put('/settings/put?action=updateUser',JSON.stringify($scope.newEditUser))
						.success(function(result) {
							$('#newEditUser').modal('hide');
							list_users();
						}).error(function(result, code) {
							$scope.addAlert(code,result);
							return;
						});
				 }
			 };
			
			 //*************************************************************************************
			 //ROLE MANAGEMENT
			
			 //To list all roles
			 var list_roles = function(){
				 var username = $window.sessionStorage.username;
				 $http.get('/settings/listRoles?action=getRoles&user='+username)
				 .success(function(data) {
					 $scope.roleTableParams = new ngTableParams({
					        page: 1,            // show first page
					        count: 5,          // count per page
					        sorting: {
					        	authority: 'asc'     // initial sorting
					        }
					    }, {
					        total: data.length, // length of data
					        counts: [5,10,20,30,50,100], // hide page counts control
					        getData: function($defer, params) {
					            // use build-in angular filter
					        	var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;
					            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : data;
					            $scope.roles = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
					            params.total(orderedData.length); // set total for recal pagination
					            $defer.resolve($scope.roles);
					        }
					    });
						//$scope.roles = result;
					}).error(function(result, code) {
						$scope.addAlert(code,result);
					});
			 };
			 
			 //To add data in Add/Edit role window
			 $scope.newOrEditRole = function(role){
				 if (role == undefined){
					 //To create an role
					 $scope.newEditRole ={title:'Create a new role',authority:'', roleValid:true, permissions:'"[{" edit ":false," data ":" Pages "," view ":false},{" edit ":false," data ":" Discussions "," view ":false},{" edit ":false," data ":" Users "," view ":false},{" edit ":false," data ":" Roles "," view ":false},{" edit ":false," data ":" Permissions "," view ":false},{" edit ":false," data ":" ProjectName "," view ":false}]"'};
				 }else{
					 //to edit an role
					 $scope.newEditRole ={title:'Edit role: '+role.authority, id:role.id, authority:role.authority, roleValid:true, permissions:role.permissions};
				 }
				 $('#newEditRole').modal('show');
			 };
			 
			 //save new roler /edit role
			 $scope.save_changes_for_role = function(){
				 if ($scope.newEditRole.authority == undefined || $scope.newEditRole.authority == ""){
					 $('#missingDataForRole').modal('show');
					 return;
				 }
				 //Check if the role exists in a new user
				 if ($scope.newEditRole.id == "" || $scope.newEditRole.id == undefined){
					 $http.get('/settings/listRoles?action=getRole&newRole='+$scope.newEditRole.authority)
					 .success(function(result) {
						 if (result!=""){
								$('#roleIsInUse').modal('show');
								return;
							}
					}).error(function(result, code) {
							$scope.addAlert(code,result);
					});
				 }
				 //Update or create the role
				 if ($scope.newEditRole.id == "" || $scope.newEditRole.id == undefined){
					 //new role
					 $http.post('/settings/post?action=createRole',JSON.stringify($scope.newEditRole))
						.success(function(result) {
							$('#newEditRole').modal('hide');
							list_roles();
						}).error(function(result, code) {
							$scope.addAlert(code,result);
							return;
						});
				 }else{
					 //update role
					 $http.put('/settings/put?action=updateRole',JSON.stringify($scope.newEditRole))
						.success(function(result) {
							$('#newEditRole').modal('hide');
							list_roles();
						}).error(function(result, code) {
							$scope.addAlert(code,result);
							return;
						});
				 }
			 };
			 
			 //To delete an role
			 $scope.deleteRole = function(role){
				 $http.delete('/settings/delete?action=deleteRole&id='+role.id)
				 .success(function(result) {
					list_roles();
				}).error(function(result, code) {
					if (code == '405'){
						$scope.userTableParams.$params.filter = {role: role.authority};
						$scope.settingsTab = {tab1: true, tab2: false, tab3:false, tab4:false, tab5:false, tab6:false};
					}
					$scope.addAlert(code,result);
				});
			 };
			 
			//*************************************************************************************
			//PERMISSIONS MANAGEMENT
			 
			 //Parse permissions string to map
			 $scope.permissions_change_role = function(){
				if ($scope.roleSelected.role.permissions instanceof Object){
					//Nothing
				}else{
					$scope.roleSelected.role.permissions = JSON.parse($scope.roleSelected.role.permissions);
			 	}
			 };
			 
			 //Init role
			 var permissions_init_role = function(){
				 $scope.roleSelected = {};
				 $http.get('/settings/listRoles?action=getAuthorityRoleByUser&user='+sessionStorage.username)
					.success(function(authority) {
						//TODO: hacer que aparezca el rol como seleccionado:
//						 for (i=0;i<document.getElementById('selectRolesForPermissions').options.length;i++){
//							    if (document.getElementById('selectRolesForPermissions').options[i].text == authority){
//							      document.getElementById('selectRolesForPermissions').options[i].selected = 'selected';
//							    }
//							}
//						 $scope.permissions_change_role();
					}).error(function(result, code) {
						$scope.addAlert(code,result);
						return;
					});
				 
			 }
			 
			//Save changes to permissions
			 $scope.save_changes_for_permissions = function () {
				 $http.put('/settings/put?action=updateRoles',JSON.stringify($scope.roles))
					.success(function(result) {
						 $modalInstance.close();
					}).error(function(result, code) {
						$scope.addAlert(code,result);
						return;
					});
				
			 };

			//To press canel button
			 $scope.cancel_changes_for_permissions = function () {
				 $modalInstance.dismiss('cancel');
			 };
			 
			//*************************************************************************************
			//COMMON
			list_roles();
			list_users();
			permissions_init_role(); 
		};
		
		//PERMISSIONS
		$scope.permissions = {view: false, edit: false};
		 
		//is authorized the action for the settings?
		this.is_authorized = function(todo){
			var username = $window.sessionStorage.username;
//			var selected_branch = angular.element(document.getElementById('divTreeCtrl')).scope().tree_control.get_selected_branch();
//			if (selected_branch == null){
//				selected_branch = "/";
//			}else{
//				selected_branch = selected_branch.path;
//			};
			$http.get('/settings/get?action=isAuthorized&user='+username+'&todo='+todo).success(function(result) {
				if (result=="true"){
					$scope.permissions.view = true;
				}
			}).error(function(result, code) {
				$scope.addAlert(code,result);
			});
		};
			
		this.load();
		this.is_authorized('view');
}]);