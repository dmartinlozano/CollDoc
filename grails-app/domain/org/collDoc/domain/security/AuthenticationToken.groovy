package org.collDoc.domain.security

import org.bson.types.ObjectId

class AuthenticationToken {
	
	ObjectId id
	String username
	String token
}
