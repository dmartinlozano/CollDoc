package org.collDoc.controller

import grails.test.mixin.*

import org.collDoc.domain.Page
import org.collDoc.domain.security.User

import spock.lang.Specification

/**
 * Information testing grails: http://grails.org/doc/latest/guide/testing.html
 */
@TestFor(PageController)
@Mock(Page)
class PageControllerSpec extends Specification {

	def setup() {
		//		mockDomain(Page, [
		//			[label: "/index", path: "/", htmlContent: "<h1>Default main page 1</h1>"],
		//			[title: "The Shining", pages: 400],
		//			[title: "Along Came a Spider", pages: 300] ])
		
		//mockDomain(User, [[username: "admin"]])
		
		def user = new User()
		user.username = "admin"
		
		mockDomain(Page, [
			[label: "/index", path: "/", htmlContent: "<h1>Default main page 1</h1>", comments: []],
			[label: "/page1", path: "/1", htmlContent: "<h1>Page 1</h1>", comments: [
				[commentary: "<p>comentario index 1</p>", user: user],[commentary: "<p>comentario index 2</p>", user: user]
				]]
			])
		}

		def cleanup() {
		}

		//get the page / of mock
		void "getPage"() {
			when:
			request.method = 'GET'
			request.makeAjaxRequest()
			//controller.request.parameters = [path:'/',msg:'test']
			request.parameters = [action:'getPage',path:'/']
			controller.get()

			then:
			response.status == 200
			response.json.label == '/index'
			response.json.path == '/'
		}
		
		//get the comments of a page
		void "getComments"() {
			when:
			request.method = 'GET'
			request.makeAjaxRequest()
			//controller.request.parameters = [path:'/',msg:'test']
			request.parameters = [action:'getPage',path:'/1']
			controller.get()

			then:
			response.status == 200
			println response.json.comments
			response.json.comments.size() == 2
		}
		
		//Check a page not exists
		void "getPageNotFound"() {
			when:
			request.method = 'GET'
			request.makeAjaxRequest()
			//controller.request.parameters = [path:'/',msg:'test']
			request.parameters = [action:'getPage',path:'patata']
			controller.get()

			then:
			response.status == 404
			response.text == "patata doesn't found in file system"
		}
		
		//Check if html exported works
		void "getExportedHtml"(){
			when:
			request.method = 'GET'
			request.makeAjaxRequest()
			request.parameters = [action:'getExportedPage',path:'/', type:"Html"]
			controller.get()
			
			then:
			response.status == 200
			response.text == '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><h1>Default main page 1</h1></body></html>'
		}
		
		//Check a page is updated
		void "updatePage"(){
			when:
			request.method = 'PUT'
			request.makeAjaxRequest()
			//controller.request.parameters = [path:'/',msg:'test']
			request.parameters = [action:'updatePage',path:'/']
			request.xml = "<h1>Updated main page 1</h1>"
			controller.get()

			then:
			response.status == 200
			//response.text == 'Page updated'
		}
	}