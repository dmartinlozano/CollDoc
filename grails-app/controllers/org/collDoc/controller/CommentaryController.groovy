package org.collDoc.controller

import org.collDoc.Indexer
import org.collDoc.domain.Commentary
import org.collDoc.domain.Page
import org.collDoc.domain.RssCommentary;
import org.collDoc.domain.security.User

import com.mongodb.BSONType

class CommentaryController {

	//post: Create a commentary in a page
	def create(){
		String action = request.getParameter("action")
		String userReceived = request.getParameter("user")
		//create a commentary
		if (action.equals("createCommentary")){
			//In the formData for the request is the html content of the file
			def contentOfRequest = request.reader.text
			//The path parameter passed how queryString is the path to find in WEB-INF
			def receivedPath = request.getParameter("path")
			def user = User.findByUsername(userReceived)
			Commentary com
			if (user == null){
				render(status: 500, text: "The user doesn't exist")
			}
			if (contentOfRequest != null){
				com = new Commentary(commentary: contentOfRequest,user: user, created: new Date(), updated: BSONType.NULL, deleted: false)
			}
			Page page = Page.findByPath(receivedPath)
			if (page == null){
				com.idRaw = 1
				page = new Page(path: receivedPath).addToComments(com).save(flush: true, failOnError: true)
			}else{
				def numComments = page.comments.size()
				com.idRaw = numComments + 1
				try{
					page.addToComments(com).save(flush: true, failOnError: true)
				}catch(e){
					e.getStackTrace()
					render(status: 500, text: e.getMessage())
				}
				
			}
			
			def now =  new Date().format("dd/MM/yyyy HH:mm:ss")
			RssCommentary rss = new RssCommentary()
			rss.title = page.label + "("  + page.path + ") has a new commentary at "+now+" by "+user
			rss.link = ""
			rss.description = contentOfRequest
			rss.pubDate = new Date()
			rss.save(flush: true, failOnError: true)
			
			Indexer.getInstance().addCommentIndexer(receivedPath, com.idRaw, user.username, contentOfRequest)
			render(status: 200, text: "ok to create")

		}
	}

	//put: Update a commentary in a page
	def update(){
		String action = request.getParameter("action")
		String userReceived = request.getParameter("user")
		//create a commentary
		if (action.equals("updateCommentary")){
			//In the formData for the request is the html content of the file
			def contentOfRequest = request.reader.text
			//The path parameter passed how queryString is the path to find in WEB-INF
			def receivedPath = request.getParameter("path")
			int idRaw = request.getParameter("idRaw") as int

			def user = User.findByUsername(userReceived)
			if (user == null){
				render(status: 500, text: "The user doesn't exist")
			}

			Page page = Page.findByPath(receivedPath)
			if (page == null){
				render(status: 500, text: "The page doesn't exist")
			}else{
			
				def comment
				def comments = page.comments.toList()
				for (int i=0;i<comments.size();i++){
					if (comments[i].idRaw == idRaw){
						comment = comments[i]
						comment.commentary = contentOfRequest
						comment.updated = new Date()
						comment.deleted = false
						comments[i] = comment
					}
				}

				page.save(flush: true, failOnError: true)
				Indexer.getInstance().updateCommentIndexer(receivedPath, idRaw, user.username, contentOfRequest)
				
				def now =  new Date().format("dd/MM/yyyy HH:mm:ss")
				RssCommentary rss = new RssCommentary()
				rss.title = page.label + "("  + page.path + ") update the comment "+idRaw + " at "+now+" by "+user
				rss.link = ""
				rss.description = contentOfRequest
				rss.pubDate = new Date()
				rss.save(flush: true, failOnError: true)
				
				render(status: 200, text: "ok to update")
			}
		}
	}

	//delete: Delete a commentary in a page
	def delete(){
		String action = request.getParameter("action")
		//get a html
		if (action.equals("deleteCommentary")){
			def receivedPath = request.getParameter("path")
			int idRaw = request.getParameter("idRaw") as int
			String userReceived = request.getParameter("user")

			def user = User.findByUsername(userReceived)
			if (user == null){
				render(status: 500, text: "The user doesn't exist")
			}
			Page page = Page.findByPath(receivedPath)
			if (page == null){
				render(status: 500, text: "The page doesn't exist")
			}else{

				for (comment in page.comments) {
					if (comment.idRaw == idRaw){
						comment.commentary = '<p style="font-style: italic;color: gray;">This comment has been removed by the author.</p>'
						comment.updated = new Date()
						comment.deleted = true
					}
				}

				page.save(flush: true, failOnError: true)
				
				def now =  new Date().format("dd/MM/yyyy HH:mm:ss")
				RssCommentary rss = new RssCommentary()
				rss.title = page.label + "("  + page.path + ") delete the comment "+idRaw + " at "+now+" by "+user
				rss.link = ""
				rss.description = ""
				rss.pubDate = new Date()
				rss.save(flush: true, failOnError: true)
				
				render(status: 200, text: "ok to delete")
			}
		}
	}
}
