
<div class="panel panel-default" id="divSettingsModal" ng-controller="SettingsController" >
    <div class="panel-heading">
      <button type="button" class="close" ng-click="cancel_changes_for_permissions()">&times;</button>
      <h4 class="modal-title">Settings</h4>
    </div>
    <div>
  		<alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)">{{alert.msg}}</alert>
	</div>
    <div class="modal-body">
		<tabset> 
			<tab heading="Users" active="settingsTab.tab1">
			 	<button type="button" class="btn btn-primary pull-right" ng-click="newOrEditUser()">Add</button>
			 	<p><strong>Sorting:</strong> {{userTableParams.sorting()|json}}, <strong>Filter:</strong> {{userTableParams.filter()|json}}
				<table ng-table="userTableParams" class="table"  show-filter="true">
			        <tr ng-repeat="user in users">
			            <td data-title="'User Name'" style="width:40%" sortable="'username'" filter="{ 'username': 'text' }" >
			                {{user.username}}
			            </td>
			            <!-- TODO: Filter personalizado:
			            http://plnkr.co/edit/wKgf04?p=preview
			            select en vez de text -->
			            <td data-title="'Role'"  style="width:30%" sortable="'role'" filter="{ 'role': 'text' }">
			                {{user.role}}
			            </td>
			             <td data-title="''">
			               <button type="button" class="btn btn-primary" data="{{user}}" ng-click="newOrEditUser(user)">Edit</button>
			            </td>
			             <td data-title="''">
			                 <button type="button" class="btn btn-primary" data="{{user}}" ng-click="deleteUser(user)">Delete</button>
			            </td>
			        </tr>
			    </table>
			</tab>
			<tab heading="Roles" active="settingsTab.tab2">
				<button type="button" class="btn btn-primary pull-right" ng-click="newOrEditRole()">Add</button>
			 	<p><strong>Sorting:</strong> {{roleTableParams.sorting()|json}}, <strong>Filter:</strong> {{roleTableParams.filter()|json}}
				<table ng-table="roleTableParams" class="table"  show-filter="true">
			        <tr ng-repeat="role in roles">
			            <td data-title="'Role'" style="width:70%" sortable="'authority'" filter="{ 'authority': 'text' }" >
			                {{role.authority}}
			            </td>
			             <td data-title="''">
			               <button type="button" class="btn btn-primary" data="{{role}}" ng-click="newOrEditRole(role)">Edit</button>
			            </td>
			             <td data-title="''">
			                 <button type="button" class="btn btn-primary" data="{{role}}" ng-click="deleteRole(role)">Delete</button>
			            </td>
			        </tr>
			    </table>
			</tab> 
			<tab heading="Permissions" active="settingsTab.tab3">
				<div class="form-horizontal">
					<div class="form-group">
						<label for="role" class="col-sm-2 control-label">Role</label>
						<div class="col-sm-5">
							<select class="form-control" ng-model="roleSelected.role" ng-options="rol.authority for rol in roles" id="selectRolesForPermissions" ng-change="permissions_change_role()"/>
						</div>
					</div>
				</div>
				<table class="table" ng-table="tablePermissionsParams">
					<tr ng-repeat="permission in roleSelected.role.permissions">
						<td data-title="''" style="width:25%">{{permission.title}}</td>
						<td data-title="'View'" style="width:25%">
						   <input type="checkbox"  ng-checked="permission.view" ng-model="permission.view"/>
						</td>
						<td data-title="'Edit for all'" style="width:25%">
						   <input type="checkbox" ng-checked="permission.edit4All" ng-model="permission.edit4All"/>
						</td>
						<td data-title="'Edit only for creator'" style="width:25%">
						   <input type="checkbox" ng-checked="permission.edit4Creator" ng-model="permission.edit4Creator"/>
						</td>
						
					</tr>
				</table>	
				
			    <div class="modal-footer">
			       <button type="button" class="btn btn-default" ng-click="cancel_changes_for_permissions()">Close</button>
			      <button type="button" class="btn btn-primary" ng-click="save_changes_for_permissions()">Save changes</button>
			    </div>
			</tab> 
			<tab heading="Profile"  active="settingsTab.tab5">Vertical content 5</tab> 
			<tab heading="Rename project"  active="settingsTab.tab6">
				<h3>The old name of the project: {{projectName}}</h3>
				<input type="text" class="form-control" id="newProjectNameId" placeholder="New name of the project"  ng-model="newProjectName" required>
				<button type="button" class="btn btn-primary" ng-click="rename_project()" id="newProjectNameButton"><span class="glyphicon glyphicon-warning-sign"></span>   Rename</button>
			</tab>
		</tabset>
		
		<!-- Modal to show edit/new user -->
		<div modal-show class="modal fade" id="newEditUser">
				<div class="modal-dialog modalsm">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title">{{newEditUser.title}}</h4>
						</div>
						<div class="modal-body">
							<div class="form-horizontal">
								<div class="form-group">
									<label for="userName" class="col-sm-2 control-label">User Name:</label>
									<div class="col-sm-10">
										<input type="text" class="form-control" id="userName" placeholder="User name" ng-model="newEditUser.userName" ng-blur="user_exists()"/>
										<span class="label label-danger" data-ng-show="newEditUser.userName.length == 0">Required!</span>
										<span class="label label-danger" data-ng-show="newEditUser.userName.length < 3">Username is too short.</span>
										<span class="label label-danger" data-ng-show="newEditUser.userName.length > 25">Username is too long.</span>
										<span class="label label-danger" data-ng-show="newEditUser.userNameValid == false">The username is in use.</span>
									</div>
								</div>
								<div class="form-group">
									<label for="inputPassword" class="col-sm-2 control-label">Password</label>
									<div class="col-sm-10">
										<input type="password" class="form-control" id="inputPassword" placeholder="Password" ng-model="newEditUser.password">
										<span class="label label-danger" data-ng-show="newEditUser.password.length == 0">Required!</span>
										<span class="label label-danger" data-ng-show="newEditUser.password.length < 3">Password is too short.</span>
										<span class="label label-danger" data-ng-show="newEditUser.password.length > 10">Password is too long.</span>
									</div>
									</div>
								<div class="form-group">
									<label for="role" class="col-sm-2 control-label">Role</label>
									 <div class="col-sm-10">
									    <select class="form-control" ng-model="newEditUser.role" ng-options="rol.authority for rol in roles" id="selectRoles"></select>
									    <input type="hidden" class="form-control" id="role" placeholder="Role" ng-model="newEditUser.role">
									    <span class="label label-danger" data-ng-show="newEditUser.role == ''">Required!</span>
									  </div>
							 	</div>
							</div>
						</div>
						<div class="modal-footer">
							<button class="btn btn-warning" data-dismiss="modal">Cancel</button>
							<button class="btn btn-primary" ng-click="save_changes_for_user()">Save changes</button>
						</div>
					</div>
				</div>
		</div>
		<!-- Modal to show edit/new role -->
		<div modal-show class="modal fade" id="newEditRole">
				<div class="modal-dialog modalsm">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title">{{newEditRole.title}}</h4>
						</div>
						<div class="modal-body">
							<div class="form-horizontal">
								<div class="form-group">
									<label for="role" class="col-sm-2 control-label">Role:</label>
									<div class="col-sm-10">
										<input type="text" class="form-control" id="role" placeholder="Role" ng-model="newEditRole.authority" ng-blur="role_exists()"/>
										<span class="label label-danger" data-ng-show="newEditRole.authority.length == 0">Required!</span>
										<span class="label label-danger" data-ng-show="newEditRole.authority.length < 3">Authority is too short.</span>
										<span class="label label-danger" data-ng-show="newEditRole.roleValid == false">The role is in use.</span>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button class="btn btn-warning" data-dismiss="modal">Cancel</button>
							<button class="btn btn-primary" ng-click="save_changes_for_role()">Save changes</button>
						</div>
					</div>
				</div>
		</div>
		<!-- Modal to show edit/new user -->
		<div modal-show class="modal fade" id="missingDataForUser">
			<div class="modal-dialog modalsm">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title">Error</h4>
					</div>
				<div class="modal-body">The fields name, password and role can't be void.</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-warning" data-dismiss="modal">OK</button>
				</div>
			</div>
			</div>
		</div>
		
		<!-- Modal to show username is in use -->
		<div modal-show class="modal fade" id="userNameIsInUse">
			<div class="modal-dialog modalsm">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title">Error</h4>
					</div>
				<div class="modal-body">The user name is in use. Please, select other</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-warning" data-dismiss="modal">OK</button>
				</div>
			</div>
			</div>
		</div>
			<!-- Modal to show edit/new role -->
		<div modal-show class="modal fade" id="missingDataForRole">
			<div class="modal-dialog modalsm">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title">Error</h4>
					</div>
				<div class="modal-body">The field role can't be void.</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-warning" data-dismiss="modal">OK</button>
				</div>
			</div>
			</div>
		</div>
		
		<!-- Modal to show username is in use -->
		<div modal-show class="modal fade" id="roleIsInUse">
			<div class="modal-dialog modalsm">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title">Error</h4>
					</div>
				<div class="modal-body">The role is in use. Please, select other</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-warning" data-dismiss="modal">OK</button>
				</div>
			</div>
			</div>
		</div>
	</div>
</div>