package org.collDoc.controller

import grails.converters.JSON
import groovy.json.JsonBuilder

import org.codehaus.groovy.grails.web.json.JSONObject
import org.collDoc.domain.Settings
import org.collDoc.domain.security.Role
import org.collDoc.domain.security.User


class SettingsController {

	def get(){
		String action = request.getParameter("action")
		//default action
		if (action == null){
			render(view: "/settings")
		}
		//list all users
		if (action.equals("getUsers")){
			String user = request.getParameter("user")
			def users = User.findByUsername(user)
			if (users == null){
				render(status: 500, text: "The user is incorrect", contentType: "application/json", encoding: "UTF-8")
				return false;
			}else{
				def role = Role.findById(users.role.id)
				if (!role.settingsView){
					render(status: 500, text: "Incorrect permissions", contentType: "application/json", encoding: "UTF-8")
					return false;
				}
			}
			users = User.list()
			def data = []
			users.each {
				data << [id: it.id.toString(), username: it.username, role: it.role.authority]
			}
			
			def json = new JsonBuilder(data)
			render(status: 200, text: json.toPrettyString(), contentType: "application/json", encoding: "UTF-8")
		}
		
		//list all roles
		if (action.equals("getRoles")){
			String user = request.getParameter("user")
			def users = User.findByUsername(user)
			if (users == null){
				render(status: 500, text: "The user is incorrect", contentType: "application/json", encoding: "UTF-8")
				return false;
			}else{
				def role = Role.findById(users.role.id)
				if (!role.settingsView){
					render(status: 500, text: "Incorrect permissions", contentType: "application/json", encoding: "UTF-8")
					return false;
				}
			}
			def roles = Role.list()
			def data = []
			roles.each {
				def permissions = [ new Permission( "Settings", it.settingsView, it.settingsEdit4Creator, it.settingsEdit4All),
					new Permission("Page", it.pageView, it.pageEdit4Creator, it.pageEdit4All),
					new Permission("Discussion", it.discussionView, it.discussionEdit4Creator, it.discussionEdit4All)]
				
				data << [id: it.id.toString(), authority: it.authority, permissions: permissions]
			}
			
			def json2 = new JsonBuilder(data)
			render(status: 200, text: json2.toPrettyString(), contentType: "application/json", encoding: "UTF-8")
		}
		
		//check if user exists now
		if (action.equals("getUser")){
			String newUser = request.getParameter("newUser")
			def users = User.findByUsername(newUser)
			if (users == null){
				render(status: 200, text: "", contentType: "application/json", encoding: "UTF-8")
			}else{
				render(status: 200, text: users, contentType: "application/json", encoding: "UTF-8")
			}
		}
		//return permissions by user
		if (action.equals("getAuthorityRoleByUser")){
			String user = request.getParameter("user")
			def users = User.findByUsername(user)
			if (users == null){
				render(status: 200, text: "", contentType: "application/json", encoding: "UTF-8")
			}else{
				def role = Role.findById(users.role.id)
				render(status: 200, text: role.authority, contentType: "application/json", encoding: "UTF-8")
			}
		}
		//check if user exists now
		if (action.equals("getRole")){
			String newRole = request.getParameter("newRole")
			def roles = Role.findByAuthority(newRole)
			if (roles == null){
				render(status: 200, text: "", contentType: "application/json", encoding: "UTF-8")
			}else{
				render(status: 200, text: roles, contentType: "application/json", encoding: "UTF-8")
			}
		}
		
		//return true if an user has permissions to do an action
		if (action.equals("isAuthorized")){
			String userName = request.getParameter("user")
			String todo = request.getParameter("todo")  //view,edit
			//String pagePath = request.getParameter("currentPage") //page path
			def user = User.findByUsername(userName)
			if (user == null){
				render(status: 500, text: "The user is void", contentType: "application/json", encoding: "UTF-8")
			}else{
				def role = Role.findById(user.role.id)
				
				if ("view".equals(todo)){
					if (role.settingsView){
						render(status: 200, text: "true", contentType: "text/plain", encoding: "UTF-8")
						return true;
					}else{
						render(status: 200, text: "false", contentType: "text/plain", encoding: "UTF-8")
						return false;
					}
				}
				if ("edit".equals(todo)){
					//edit only the creator not used here
					if (role.pageEdit4All){
						render(status: 200, text: "true", contentType: "text/plain", encoding: "UTF-8")
						return true;
					}else{
						render(status: 200, text: "false", contentType: "text/plain", encoding: "UTF-8")
						return false;
					}
				}
				
				//TODO
//				if ("page".equals(item)){
//					if ("view".equals(todo)){
//						if (role.pageView){
//							render(status: 200, text: "true", contentType: "text/plain", encoding: "UTF-8")
//						}else{
//							render(status: 200, text: "false", contentType: "text/plain", encoding: "UTF-8")
//						}
//					}
//					if ("edit".equals(todo)){
//						if (role.pageEdit4All){
//							render(status: 200, text: "true", contentType: "text/plain", encoding: "UTF-8")
//						}
//						if (role.pageEdit4Creator){
//							if ("".equals(pagePath)){
//								render(status: 500, text: "Internal error getting the current page", contentType: "application/json", encoding: "UTF-8")
//							}
//							def page = Page.findByPath(pagePath)
//							if (page == null){
//								render(status: 500, text: pagePath+" not found in the system", contentType: "application/json", encoding: "UTF-8")
//							}
//							if (user.username.equals(page.creator.username)){
//								render(status: 200, text: "true", contentType: "text/plain", encoding: "UTF-8")
//							}else{
//							render(status: 200, text: "false", contentType: "text/plain", encoding: "UTF-8")
//							}
//						}else{
//							render(status: 200, text: "false", contentType: "text/plain", encoding: "UTF-8")
//						}
//					}
//				}
//				
//				if ("discussion".equals(item)){
//					if ("view".equals(todo)){
//						if (role.discussionView){
//							render(status: 200, text: "true", contentType: "text/plain", encoding: "UTF-8")
//						}else{
//							render(status: 200, text: "false", contentType: "text/plain", encoding: "UTF-8")
//						}
//					}
//					if ("edit".equals(todo)){
//						if (role.discussionEdit4All){
//							render(status: 200, text: "true", contentType: "text/plain", encoding: "UTF-8")
//						}
//						if (role.discussionEdit4Creator){
//							if ("".equals(pagePath)){
//								render(status: 500, text: "Internal error getting the current page", contentType: "application/json", encoding: "UTF-8")
//							}
//							def page = Page.findByPath(pagePath)
//							if (page == null){
//								render(status: 500, text: pagePath+" not found in the system", contentType: "application/json", encoding: "UTF-8")
//							}
//							if (user.username.equals(page.creator.username)){
//								render(status: 200, text: "true", contentType: "text/plain", encoding: "UTF-8")
//							}else{
//							render(status: 200, text: "false", contentType: "text/plain", encoding: "UTF-8")
//							}
//						}else{
//							render(status: 200, text: "false", contentType: "text/plain", encoding: "UTF-8")
//						}
//					}
//				}
				
				render(status: 200, text: "false", contentType: "text/plain")
			}
		}
	}
	
	//put
	def update(){
		String action = request.getParameter("action")
		
		//Update an user
		if (action.equals("updateUser")){
			//In the formData for the request is the user to update
			def contentOfRequest = request.reader.text
			def json = JSON.parse(contentOfRequest)
			String _id = json.id
			if (_id == null){
				render(status: 500, text: "The userId is null")
			}else{
				def user = User.findById(_id)
				if (user == null){
					render(status: 500, text: "The userId doesn't exist")
				}else{
					def inputRole = json.role
					def role
					if (inputRole instanceof String){
						role = Role.findByAuthority(inputRole)
					}
					if (inputRole instanceof JSONObject){
						role = Role.findByAuthority(inputRole.authority)
					}
					user.username = json.userName
					user.password = json.password
					user.role = role
					user.save(flush: true, failOnError: true)
					render(status: 200, text: "ok to update")
				}
			}
		}
		
		//Update the roles with the settings
		if (action.equals("updateRoles")){
			def contentOfRequest = request.reader.text
			def json = JSON.parse(contentOfRequest)
			Role role
			json.each{
					role = Role.findById(it.id)
					role.authority = it.authority
					it.permissions.each{
						if (it.title.equals("Settings")){
							role.settingsView = it.view
							role.settingsEdit4All = it.edit4All
							role.settingsEdit4Creator = it.edit4Creator
						}
						if (it.title.equals("Page")){
							role.pageView = it.view
							role.pageEdit4All = it.edit4All
							role.pageEdit4Creator = it.edit4Creator
						}
						if (it.title.equals("Discussion")){
							role.discussionView = it.view
							role.discussionEdit4All = it.edit4All
							role.discussionEdit4Creator = it.edit4Creator
						}
					}
					role.save(flush: true, failOnError: true)
			}
			render(status: 200, text: "ok to update")
		}
		
		//Rename a project
		if (action.equals("renameProject")){
			String user = request.getParameter("user")
			def users = User.findByUsername(user)
			if (users == null){
				render(status: 500, text: "The user is incorrect", contentType: "application/json", encoding: "UTF-8")
				return false;
			}else{
				def role = Role.findById(users.role.id)
				if (!role.settingsEdit4All){
					render(status: 500, text: "Incorrect permissions", contentType: "application/json", encoding: "UTF-8")
					return false;
				}
				if (!role.settingsView){
					render(status: 500, text: "Incorrect permissions", contentType: "application/json", encoding: "UTF-8")
					return false;
				}
			}
			def newProjectName = request.getParameter("newProjectName")
			def oldProjectName = request.getParameter("oldProjectName")
			Settings settings = Settings.findByProjectName(oldProjectName)
			settings.projectName = newProjectName
			settings.save(flush: true, failOnError: true)
			render(status: 200, text: "ok to rename")
		}
	}

	//post
	def create(){
		
		String action = request.getParameter("action")
		
		//Create an user
		if (action.equals("createUser")){
			//In the formData for the request is the user to create
			def contentOfRequest = request.reader.text
			def json = JSON.parse(contentOfRequest)
			def userName = json.userName
			def users = User.findByUsername(userName)
			if (users != null){
				render(status: 500, text: "The username is in use.")
			}else{
				Role role = Role.findByAuthority(json.role.authority)
				User user = new User()
				user.username = json.userName
				user.password = json.password
				user.role = role
				user.save(flush: true, failOnError: true)
				render(status: 200, text: "ok to create")
			}
		}
		
		//Create a role
		if (action.equals("createRole")){
			//In the formData for the request is the user to create
			def contentOfRequest = request.reader.text
			def json = JSON.parse(contentOfRequest)
			def authority = json.authority
			def roles = Role.findByAuthority(authority)
			if (roles != null){
				render(status: 500, text: "The role is in use.")
			}else{
				Role role = new Role()
				role.authority = authority
				role.permissions = "[]"
				role.save(flush: true, failOnError: true)
				render(status: 200, text: "ok to create")
			}
		}
	}
	
	//delete
	def delete(){
		String action = request.getParameter("action")
		
		//delete an user
		if (action.equals("deleteUser")){
			String _id = request.getParameter("id")
			if (_id == null){
				render(status: 500, text: "The userId is null")
			}else{
			
				if (User.count() == 1){
					render(status: 500, text: "The last user can't be deleted")
				}else{
					def user = User.findById(_id)
					if (user == null){
						render(status: 500, text: "The userId doesn't exist")
					}else{
						user.delete()
						render(status: 200, text: "ok to delete")
					}
				}
			}
		}
		
		//delete a role
		if (action.equals("deleteRole")){
			String _id = request.getParameter("id")
			if (_id == null){
				render(status: 500, text: "The roleId is null")
			}else{
			
				if (Role.count() == 1){
					render(status: 500, text: "The last role can't be deleted")
				}else{
					def role = Role.findById(_id)
					if (role == null){
						render(status: 500, text: "The roleId doesn't exist")
					}else{
						//if the role is used by an used, can't be deleted
						def usersWithRole = role ? User.findAllByRole(role) : []
						if (usersWithRole.size() == 0){
							role.delete()
							render(status: 200, text: "ok to delete")
						}else{
							render(status: 405, text: "The role "+role.authority+" can't be deleted because some users uses this role")
						}
					}
				}
			}
		}
	}
	
	class Permission {
		Permission(String title, boolean view, boolean edit4Creator, boolean edit4All){
			this.title = title
			this.view = view
			this.edit4Creator = edit4Creator
			this.edit4All = edit4All
		}
		String  title
		boolean view
		boolean edit4Creator
		boolean edit4All
		}
}
