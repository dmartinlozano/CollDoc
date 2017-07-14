package org.collDoc.domain

import grails.rest.Resource

import org.bson.types.ObjectId
import org.collDoc.domain.security.User

@Resource(uri='/api/comments')
class Commentary {

	int idRaw
	ObjectId id
	static belongsTo = [ page: Page ]
    String commentary
	User user
	Date created
	Date updated
	boolean deleted
	static constraints = {
		idRaw blank:false, min: 1
		commentary blank:false
		updated nullable: true
	}
}
