package org.collDoc.domain.security

import grails.rest.Resource

import org.bson.types.ObjectId

@Resource(uri='/api/roles')
class Role {
	ObjectId id
	String authority
	boolean pageView
	boolean pageEdit4All
	boolean pageEdit4Creator
	boolean discussionView
	boolean discussionEdit4All
	boolean discussionEdit4Creator
	boolean settingsView
	boolean settingsEdit4All
	boolean settingsEdit4Creator

	static mapping = {
		cache true
	}

	static constraints = {
		authority blank: false, unique: true
	}
}
