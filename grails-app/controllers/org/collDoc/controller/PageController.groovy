package org.collDoc.controller

import groovy.json.JsonBuilder

import org.apache.commons.codec.binary.Base64
import org.apache.commons.fileupload.FileItemIterator
import org.apache.commons.fileupload.FileItemStream
import org.apache.commons.fileupload.servlet.ServletFileUpload
import org.collDoc.DocParser
import org.collDoc.Indexer
import org.collDoc.domain.Page
import org.collDoc.domain.RssPage;
import org.collDoc.domain.Settings


class PageController {

	//get: Method what given a path of file, get the file
	def get(){
		String action = request.getParameter("action")
		//get a html
		if (action.equals("getPage")){
			//The path parameter pased how queryString is the path to find in WEB-INF
			String receivedPath = request.getParameter("path")
			Page page = Page.findByPath(receivedPath)
			if (page == null){
				render(status: 404, text: receivedPath +" doesn't found in file system");
			}else{
				PageRaw pageResult = new PageRaw()
				pageResult.id = page.id.toString()
				pageResult.label = page.label
				pageResult.path = page.path
				pageResult.htmlContent = page.htmlContent
				if (page.comments.size() > 0){
					page.comments.sort{it.idRaw}.each{
						CommentaryRaw com = new CommentaryRaw()
						//to assign:
						com.idRaw = it.idRaw
						com.id = it.id.toString()
						com.commentary = it.commentary
						com.user = it.user.username
						com.created = it.created
						com.updated = it.updated
						com.deleted = it.deleted
						pageResult.comments << com
					}
				}
				def json = new JsonBuilder(pageResult)
				render(text: json.toPrettyString(), contentType: "application/json", encoding: "UTF-8")
			}
		}
		//export
		if (action.equals("getExportedPage")){
			String receivedPath = request.getParameter("path")
			String type = request.getParameter("type")
			
			Page page = Page.findByPath(receivedPath)
			if (page == null){
				render(status: 404, text: receivedPath +" doesn't found in file system");
			}
			
			if (type.equals("Html")){
				def htmlContent = page.htmlContent
				htmlContent = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body>'+
							   htmlContent+'</body></html>'
				response.setHeader('Content-Disposition', 'Attachment')
				response.setHeader('x-filename', page.label+'.html')
				response.setHeader('content-type', 'text/html')
				render(text: htmlContent, contentType: "text/html", encoding: "UTF-8")
			}
			if (type.equals("Docx")){
				File result = DocParser.parseHtml2Doc(page)
				response.setHeader("Content-disposition", "Attachment")
				response.setHeader('x-filename', page.label+'.docx')
				response.setHeader('Content-Transfer-Encoding','base64')
				response.setContentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
				response.outputStream << Base64.encodeBase64(result.readBytes())
				result.delete()
			}
		}
	}

	//put: Method what given a path of file and a content of file, write the html content in file
	def update(){
		String action = request.getParameter("action")
		//update a page with thml content
		if (action.equals("updatePage")){
			//The path parameter pased how queryString is the path to find in WEB-INF
			String receivedPath = request.getParameter("path")
			Page page = Page.findByPath(receivedPath)
			if (page == null){
				render(status: 404, text: receivedPath +" doesn't found in file system");
			}else{
				//In the formData for the request is the html content of the file
				page.htmlContent = request.reader.text
				page.save(flush: true, failOnError: true)
				
				Indexer.getInstance().updatePageIndexer(receivedPath,page.htmlContent)
				def now =  new Date().format("dd/MM/yyyy HH:mm:ss")
				RssPage rss = new RssPage()
				rss.title = page.label + "("  + page.path + ") updated at "+now
				rss.link = ""
				rss.description = ""
				rss.save(flush: true, failOnError: true)
				render(status: 200, text: "Page updated")
			}
		}
		//import a file content in the described page
		if (action.equals("importDocInPage")){
			//The path parameter pased how queryString is the path to find in WEB-INF
			String receivedPath = request.getParameter("path")
			Page page = Page.findByPath(receivedPath)
			if (page == null){
				render(status: 404, text: receivedPath +" doesn't found in file system");
			}else{
				//Check the content-type of the request
				if (request.getHeader("Content-Type") != null
				&& request.getHeader("Content-Type").startsWith("multipart/form-data")) {

					ServletFileUpload upload = new ServletFileUpload();
					FileItemIterator iterator = upload.getItemIterator(request)
					while (iterator.hasNext()) {
						//Get the file passed in the request
						FileItemStream item = iterator.next()
						//-1: incorrect, 0:doc, 1:xls, 2:ppt
						int formatCorrect = -1;
						
						if (item.getContentType().equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")){
							formatCorrect = 0;
						}
						
						if (item.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")){
							formatCorrect = 1;
						}
						
						if (item.getContentType().equals("application/vnd.openxmlformats-officedocument.presentationml.presentation")){
							formatCorrect = 2;
						}
						
						if (formatCorrect == -1){
							render(status: 500, text: "The type of file is not supported")
						}
						
						InputStream stream = item.openStream()

						//To parse the document to html:
						if (formatCorrect == 0){
							page = DocParser.parseDoc2Html(page, stream)
						}
						if (formatCorrect == 1){
							page = DocParser.parseXls2Html(page, stream)
						}
						if (formatCorrect == 2){
							page = DocParser.parsePpt2Html(page, stream)
						}
						page.save(flush: true, failOnError: true)
						Indexer.getInstance().updatePageIndexer(receivedPath, page.htmlContent)
						
						def now =  new Date().format("dd/MM/yyyy HH:mm:ss")
						RssPage rss = new RssPage()
						rss.title = page.label + "("  + page.path + ") updated with an imported file at "+now
						rss.link = ""
						rss.description = ""
						rss.save(flush: true, failOnError: true)

						render(status: 200, text: "Page updated")
					}
				}
				render(status: 500, text: "Not page added")
			}
		}
	}

	//post: Method that given the tree data and a new file, both is stored
	def create(){
		String action = request.getParameter("action")
		//get a html
		if (action.equals("createPage")){
			//queryStrings:
			def newPagePath = request.getParameter("newPagePath")
			def newPageLabel = request.getParameter("newPageLabel")
			def username = request.getParameter("username")

			//In the formData for the request is the html content of the file
			def menuJSON = sanitize(request.reader.text)

			if (newPageLabel.endsWith("undefined")){
				render(status: 500, text: "The name of the new Page can't be void")
			}

			//Check if the path is unique
			Page page = Page.findByPath(newPagePath)
			if (page != null){
				render(status: 500, text: "The name of the new Page already exists")
			}
			
			//Check if the user is correct
			def user = User.findByUsername(username)
			if (user == null){
				render(status: 500, text: "The user doesn't exist")
			}

			page = new Page()
			page.path= newPagePath
			page.label = newPageLabel
			page.htmlContent = ""
			page.creator = user
			page.comments = []
			page.save(flush: true, failOnError: true)

			Indexer.getInstance().addPageIndexer(newPagePath,page.htmlContent)

			//To store in mongodb the tree data in json form. It's need reemove uid, parent_uid, expanded and selected
			def settings = Settings.findAll()
			settings[0].treeViewJS = menuJSON
			settings[0].save(flush: true, failOnError: true)
			
			def now =  new Date().format("dd/MM/yyyy HH:mm:ss")
			RssPage rss = new RssPage()
			rss.title = page.label + "("  + page.path + ") created at "+now
			rss.link = ""
			rss.description = ""
			rss.save(flush: true, failOnError: true)

			render(status: 200, text: "Page created ok")
		}
	}

	//delete: Method that given the tree data and a new file, both is deleted
	def delete(){
		String action = request.getParameter("action")
		//get a html
		if (action.equals("deletePage")){
			//store the tree how json passed in the header
			def settings = Settings.findAll()
			def treeData = request.getHeader("tree_data")
			def path2Delete = request.getParameter("path")

			//From the menu of the tree, get the currents paths and delete the pages not included in the menu
			def menuJSON = sanitize(treeData)
			def matcher = menuJSON =~ /"path":"(.*?)"/
			def pathsToSave = [:]
			matcher.each{
				pathsToSave.put(it[1], "")
			}
			//The index can't be deleted
			pathsToSave.put("/", "")
			Page.findAll().each {
				if (!pathsToSave.containsKey(it.path)){
					it.delete(flush: true)
				}
			}
			settings[0].treeViewJS = menuJSON
			settings[0].save(flush: true, failOnError: true)
			
			def now =  new Date().format("dd/MM/yyyy HH:mm:ss")
			RssPage rss = new RssPage()
			rss.title = path2Delete + " deleted at "+now
			rss.link = ""
			rss.description = ""
			rss.save(flush: true, failOnError: true)
			
			render(status: 200, text: "Page and children deleted")
		}
	}

	//head: Method to store the node renamed. In file system, any change is need
	def rename(){String action = request.getParameter("action")
		//rename a label
		if (action.equals("renamePage")){
			//store the tree how json passed in the header
			def settings = Settings.findAll()
			def pathSelected = request.getParameter("path")
			def newLabel = request.getParameter("newLabel")

			//In the formData for the request is the html content of the file
			def menuJSON = sanitize(request.getHeader("tree_data"))

			Page page = Page.findByPath(pathSelected)
			if (page == null){
				render(status: 500, text: "The page selected doesn't exists")
			}
			page.label = newLabel
			page.save(flush: true, failOnError: true)
			
			def now =  new Date().format("dd/MM/yyyy HH:mm:ss")
			RssPage rss = new RssPage()
			rss.title = page.label + "("  + page.path + ") renamed at "+now
			rss.link = ""
			rss.description = ""
			rss.save(flush: true, failOnError: true)

			//TODO add to indexer
			//Indexer.getInstance().addIndexer(absolutePath)


			//To store in mongodb the tree data in json form. It's need reemove uid, parent_uid, expanded and selected
			settings[0].treeViewJS = menuJSON
			settings[0].save(flush: true, failOnError: true)

		}
		render(status: 200, text: "Page renamed")
	}

	/*Quit from a json data all data no included in Settings.
	 * */
	private String sanitize(input){
		def output = input.replaceAll(~/\"uid\":\".*?\"/,'')
		output = output.replaceAll(~/\"parent_uid":\".*?\"/,'')
		output = output.replaceAll(~/\"expanded\":true/,'')
		output = output.replaceAll(~/\"expanded\":false/,'')
		output = output.replaceAll(~/\"selected\":true/,'')
		output = output.replaceAll(~/\"selected\":false/,'')
		output = output.replaceAll(~/,,,/,',')
		output = output.replaceAll(~/,,/,',')
		output = output.replaceAll(~/],}/,']}')
		return output
	}

	class PageRaw{
		String id
		String label
		String path
		String htmlContent
		def comments = []
	}
	class CommentaryRaw{
		int idRaw
		String id
		String commentary
		String user
		Date created
		Date updated
		boolean deleted
	}
}

