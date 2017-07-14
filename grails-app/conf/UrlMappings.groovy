class UrlMappings {

	static mappings = {	 
		 "/page/$action"(controller:"page", parseRequest: false){
			 action = [GET:"get", PUT:"update", DELETE:"delete", POST:"create", HEAD: "rename"]
		 }
		 
		 "/settings/$action"(controller:"settings", parseRequest: false){
			 action = [GET:"get", PUT:"update", DELETE:"delete", POST:"create", HEAD: "rename"]
		 }
		 
		 "/find/$action"(controller:"find", parseRequest: false){
			 action = [GET:"get", PUT:"update", DELETE:"delete", POST:"create", HEAD: "rename"]
		 }
		 
		 "/commentary/$action"(controller:"commentary", parseRequest: false){
			 action = [GET:"get", PUT:"update", DELETE:"delete", POST:"create", HEAD: "rename"]
		 }
		 
		 "/rss/get"(controller:"rss", parseRequest: false)
		
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }
		
        "/"(view:"/index")
        "500"(view:'/error')
	}
}
