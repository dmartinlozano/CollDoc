package org.collDoc.domain

import grails.rest.Resource

import org.bson.types.ObjectId

@Resource(uri='/api/settings')
class Settings {
	
	ObjectId id
	String projectName
	String treeViewJS
    static constraints = {
		projectName blank:false
    }
}
