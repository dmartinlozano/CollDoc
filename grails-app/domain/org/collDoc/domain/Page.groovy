package org.collDoc.domain

import grails.rest.Resource

import org.bson.types.ObjectId
import org.collDoc.domain.security.User

@Resource(uri='/api/pages')
class Page {

	ObjectId id
    String label
	String path
	String htmlContent
	User creator
	static hasMany = [comments: Commentary]
	static constraints = {
		path blank:false, unique: true
		comments cascade: "all-delete-orphan"
	}
}
