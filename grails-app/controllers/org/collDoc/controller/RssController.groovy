package org.collDoc.controller

import java.text.DateFormat
import java.text.SimpleDateFormat

import org.collDoc.domain.RssCommentary
import org.collDoc.domain.RssPage

class RssController {
	def get(){
		String action = request.getParameter("action")
		if (action.equals("getPage")){
			render(feedType:"rss", feedVersion:"2.0") {
				title = "Rss for pages"
				link = ""
				description = ''
				RssPage.list(max: 10, sort: "title", order: "desc").each() {
					entry(it.title) {
						link = it.link
						it.description // return the content
					}
				}
			}
		}


		if (action.equals("getCommentary")){
			render(feedType:"rss", feedVersion:"2.0") {
				title = "Rss for comments"
				link = ""
				description = ''
				RssCommentary.list(max: 10, sort: "title", order: "desc").each() {
					entry(it.title) {
						link = it.link
						it.description // return the content
					}
				}
			}
		}
	}
}
