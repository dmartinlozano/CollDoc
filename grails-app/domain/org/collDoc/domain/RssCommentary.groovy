package org.collDoc.domain

import org.bson.types.ObjectId;
import grails.rest.Resource

@Resource(uri='/api/rss/commentary')
class RssCommentary {
	ObjectId id
	String title
	String link
	String description
}
