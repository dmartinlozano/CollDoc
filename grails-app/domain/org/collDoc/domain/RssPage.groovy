package org.collDoc.domain

import java.util.Date;

import org.bson.types.ObjectId;

import grails.rest.Resource

@Resource(uri='/api/rss/page')
class RssPage {
	ObjectId id
	String title
	String link
	String description
}
