angular.module('CollDoc').controller('PageController', ['$http', '$scope','$sce', 'PageService', 'UtilsFactory', '$window', 'ngTableParams', '$filter', '$parse', '$base64', '$location', function($http, $scope, $sce, pageService, UtilsFactory, $window, ngTableParams, $filter, $parse, $base64, $location) {

	var tree;
	
	$scope.pageAlerts = [];
	
	$scope.closeAlert = function(index) {
		  $scope.pageAlerts.splice(index, 1);
	};
	
	$scope.addAlert = function(code,message) {
		   $scope.pageAlerts.push( { type: 'danger', msg: code+": "+message });
	};
	$scope.editor = {};
	$scope.parseInt = parseInt;
	
	$scope.textAreaSetup = function($element){
		  $element.attr('ui-codemirror', '');
		};

	// handle of selected node:
	$scope.tree_handler = function(node) {
		
		var path = ""
		var labelNode = ""
		if (undefined === node){
			path = "/";
			labelNode = "/index";
		}else{
			path = node.path;
			labelNode = node.label;
		}
		
		//check in cache:
//		var pageStoredInCache = pageService.getPageByPath(path);
//		if (pageStoredInCache != undefined && path != "/"){
//			$scope.editor = pageStoredInCache;
//			var html = $scope.editor.htmlContent.split("\n").map($.trim).filter(function(line) { 
//			      return line != "";
//			    }).join("\n");
//			$scope.mdContent=toMarkdown(html);
//			$scope.selectedNode={label: labelNode};
//			$scope.tab = {tab1: true, tab2: false, tab3:false, tab4:false}
//			$scope.editor.indexHtmlContent = $scope.createIndex($scope.editor.htmlContent);
//			return;
//		}

		$http.get('/page/get?action=getPage&path='+path).success(function(result) {
			$scope.editor = {htmlContent: $sce.trustAsHtml(result.htmlContent), mdContent: "", spreadsheet:{}, comments: result.comments, label: result.label, path: result.path, showHtml:true};
			var data = $scope.editor.comments;
			 $scope.commentariesTableParams = new ngTableParams({
			        page: 1,    
			        count: 10 
			    }, {
			        total: data.length,  
			        getData: function($defer, params) {
			        	var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;
			            $scope.editor.comments = filteredData.slice((params.page() - 1) * params.count(), params.page() * params.count());
			            params.total(filteredData.length); 
			            $defer.resolve($scope.editor.comments);
			        }
			    });
			
		}).error(function(result, code) {
			$scope.editor = {htmlContent: ''};
			$scope.mdContent='';
			$scope.addAlert(code,result);
		});
		$scope.selectedNode={label: labelNode};
		$scope.tab = {tab1: true, tab2: false, tab3:false, tab4:false}
	};
	
	//load the tree
	this.loadTree = function() {
	    $http.get('/api/settings.json').success(function(data, status, headers, config) {
	    	$scope.tree_data = eval(data[0].treeViewJS);
	     });
	};
	//Collapse all & unselect all
	$scope.reset = function(){
		$scope.tree_handler(undefined);
		$scope.tree_control.collapse_all();
		$scope.tree_control.select_branch();
	};
	
	// Save the current content in selected page
	$scope.save_current_page = function() {
			var i=0;
			var htmlContent = $scope.editor.htmlContent;
			//Fix: remove the span rangySelectionBoundary
			htmlContent = htmlContent.replace(/<span class="rangySelectionBoundary">.*?<\/span>/g, '');
			
			$http.put('/page/put?action=updatePage&path='+$scope.editor.path,htmlContent)
			.success(function(result) {
				$scope.tab = {tab1: true, tab2: false, tab3:false, tab4:false, tab5:false}
				$('#saveEditModal').modal('hide');
			}).error(function(result, code) {
				$scope.addAlert(code,result);
				$('#saveEditModal').modal('hide');
			});
			//Update in cache:
//			pageService.addOrPudatePageByPath($scope.editor);
		};
	
	// To add more nodes in tree
	$scope.add_a_new_branch = function() {
		
		var selected_branch = tree.get_selected_branch();
		var newSubPageLabel = this.newSubPageLabel;
		var newSubPagePath;
		
		//The newSubPageTitle can't be void
		if (newSubPageLabel == undefined){
			$scope.addAlert('',"The name of the new page can't be void");
			return;
		}
		
		//Check if the name is correct
		if (UtilsFactory.toCamelCase(newSubPageLabel) == ""){
			$scope.addAlert('',"The name of the new page is invalid");
			return;
		}
		
		//Compose newSubPagePath
		if (selected_branch == null){
			newSubPagePath = "/" + UtilsFactory.toCamelCase(newSubPageLabel);
		}else{
			newSubPagePath = selected_branch.path + "/" + UtilsFactory.toCamelCase(newSubPageLabel);
		}
		
		//Check if the new path is in use
		$http.get('/page/get?action=getPage&path='+newSubPagePath)
		.success(function(result) {
			//Find sub-Page: error
			$scope.addAlert("400","The name of the sub-Page is already in use");
		}).error(function(result, code) {
			//Not found sub-Page. Continue to create it:
			
			//Adding the new sub-Page in the tree
			if (selected_branch == null){
				tree.add_root_branch({
					label : newSubPageLabel,
					path: newSubPagePath
				});
			}else{
				tree.add_branch(selected_branch, {
					label : newSubPageLabel,
					path: newSubPagePath
				});
			};
			
			//Problem in tree plugin: update $scope.data with $scope.data of plugin
			$scope.tree_data = angular.element(document.getElementById('divTreeCtrl')).scope().tree_data;
			
			//Store in DB:
			var username = $window.sessionStorage.username;
			 $http.post('/page/post?action=createPage&newPagePath='+newSubPagePath+'&newPageLabel='+newSubPageLabel+'&username='+username,JSON.stringify($scope.tree_data))
				.success(function(result) {
					this.newSubPageLabel='';
					$scope.tab = {tab1: true, tab2: false, tab3:false, tab4:false};
				}).error(function(result, code) {
					$scope.addAlert(code,result);
					return;
				});
			 
			 //Create not store in cache: ¿create a void page?
		});
		this.newSubPageTitle='';
		$scope.tab = {tab1: true, tab2: false, tab3:false, tab4:false}
	};
	
	//Confirm delete the selected branch (and children)
	$scope.confirm_selected_branch = function() {
		if ($scope.editor.path === "/"){
			$('#IndexBranchCannotBeDeleted').modal({"backdrop" : "static"});
		}else{
			$('#confirmDeleteBranchModal').modal({"backdrop" : "static"});
		}
	}
	
	//delete the selected branch (and children)
	$scope.delete_selected_branch = function() {
		var selected_branch = tree.get_selected_branch();
		$scope.findAndDelete(selected_branch.path, $scope.tree_data);
		$http.defaults.headers.common.tree_data = JSON.stringify($scope.tree_data);
		$http.delete('/page/delete?action=deletePage&path=' + selected_branch.path)
		.success(function(result) {
			//Delete from cache
//			pageService.deleteAPage(selected_branch.path);
			$scope.reset();
			$('#confirmDeleteBranchModal').modal('hide');
			$scope.tab = {tab1: true, tab2: false, tab3:false, tab4:false}
		}).error(function(result, code) {
			$scope.addAlert(code,result);
			$('#confirmDeleteBranchModal').modal({"backdrop" : "static"});
		});
	};
	
	//Find a label in tree.data_tree and delete it
	$scope.findAndDelete = function(path2Find, treeData){
		for (var i in treeData){
			if (treeData[i].path == path2Find){
				treeData.splice(i, 1);
			}else{
				if (treeData[i].children != undefined){
				     if (treeData[i].children.length > 0){
				    	 $scope.findAndDelete(path2Find, treeData[i].children)
				     }
				}
			}
		}
	};
	
	//Error to update tree variable in the plugin. Fix:
	if (tree == undefined && window.jasmine == undefined){
		var treeOfPlugin = angular.element(document.getElementById('divTreeCtrl')).scope().tree_control;
		if (treeOfPlugin != undefined){
			tree = angular.element(document.getElementById('divTreeCtrl')).scope().tree_control;
		}else{
			tree = {};
		}
	}
	
	//rename the selected branch
	$scope.rename_current_branch = function(){
		var selected_branch = tree.get_selected_branch();
		if (selected_branch == null){
			$('#IndexBranchCannotBeDeleted').modal({"backdrop" : "static"});
			return;
		}
		$scope.findAndRename(selected_branch.label, $scope.selectedNode.label, $scope.tree_data);
		$http.defaults.headers.common.tree_data = JSON.stringify($scope.tree_data);
		$http.head('/page/head?action=renamePage&path=' + selected_branch.path + '&newLabel=' + $scope.selectedNode.label)
		.success(function(result) {
			//rename in cache
//			pageService.renameAPage(path, label);
			$scope.tab = {tab1: true, tab2: false, tab3:false, tab4:false}
		}).error(function(result, code) {
			$scope.addAlert(code,result);
		});
	};
	
	//Find a label in tree.data_tree and rename it
	$scope.findAndRename = function(label2Find, newLabel, treeData){
		for (var i in treeData){
			//Rename label  in the selected node
			if (treeData[i].label == label2Find){
				treeData[i].label = newLabel;
			}else if (treeData[i].children != undefined){
			    if (treeData[i].children.length > 0){
			    	$scope.findAndRename(label2Find, newLabel, treeData[i].children)
			    }
			}
		}
	};
	
	//Change to textAngular editor
	$scope.showPageHTmlEditor = function(){
		var converter = new Showdown.converter();
		$scope.editor.htmlContent = converter.makeHtml($scope.editor.mdContent);
		//$scope.editor.htmlContent = $sce.trustAsHtml($scope.editor.mdContent);
		$scope.editor.showHtml = true;
	};	
	
	//********************************************************************************************************************************
	
	$scope.commentary = {title: "", htmlPage: "", content: "", mdContent: "", userName:"", created: null, updated: null, isToCreate: false, idRaw: 0, deleted: false};
	
	
	//Open comentary modal
	$scope.openCommentaryModal = function(isToCreate, commentarySeleced) {
		if (isToCreate == true){
			$scope.commentary.title = "Add a new commentary"
			$scope.commentary.content="";
		}else{
			$scope.commentary.title = "Edit a commentary"
			$scope.commentary.content = commentarySeleced.commentary;
			$scope.commentary.idRaw = commentarySeleced.idRaw;
		}
		$scope.commentary.isToCreate = isToCreate;
		//Remove 4,5,6... toolbar in commentary for TextAngular. @see textAngularDecorator: taOptions.toolbar[4].push('save');
		//TODO it's better todo this action in textAngularDecorator, but I don't know how differents beetween textAngular instances :(
		var textAngularToolBar = angular.element(document.getElementById('commentaryEditorTextArea'))[0].children[0].children
		for (var i=textAngularToolBar.length-1;i>=4;i--){
		//if (textAngularToolBar.length != 4){
			textAngularToolBar[i].parentNode.removeChild(textAngularToolBar[i]);
		}
		$('#addCommentaryModal').modal({"backdrop" : "static"});
	};
	
	//add a comment into current page
	$scope.createOrEditComment = function() {

		if ($scope.commentary.isToCreate == true){
			//new comment
			var username = $window.sessionStorage.username;
			$http.post('/commentary/post?action=createCommentary&path='+$scope.editor.path+'&user='+username,$scope.commentary.content)
			.success(function(result) {
				$('#addCommentaryModal').modal('hide');
				if (tree.get_selected_branch() == null){
					$scope.tree_handler(undefined);
				}else{
					$scope.tree_handler(tree.get_selected_branch());
				}
				$scope.tab = {tab1: false, tab2: true, tab3:false, tab4:false};
			}).error(function(result, code) {
				$scope.addAlert(code,result);
				$('#addCommentaryModal').modal('hide');
			});
		}else{
			//edit a comment
			var username = $window.sessionStorage.username;
			$http.put('/commentary/put?action=updateCommentary&path='+$scope.editor.path+'&user='+username+'&idRaw='+$scope.commentary.idRaw,$scope.commentary.content)
			.success(function(result) {
				$('#addCommentaryModal').modal('hide');
				if (tree.get_selected_branch() == null){
					$scope.tree_handler(undefined);
				}else{
					$scope.tree_handler(tree.get_selected_branch());
				}
				$scope.tab = {tab1: false, tab2: true, tab3:false, tab4:false};
			}).error(function(result, code) {
				$scope.addAlert(code,result);
				$('#addCommentaryModal').modal('hide');
			});
		}
	};
	
	//Create index pane from html content
	$scope.createIndex = function(htmlContent){
		var regex = /div id=\"(.*?)\"\>(.*?)\<\/div\>/g;
		var matches, output = "";
		while (matches = regex.exec(htmlContent)) {
		    output = output +='<a href="##'+matches[1]+'">'+matches[2]+'</a>';
		}
		return $sce.trustAsHtml(output);
	}
	
	//with the id commentary, get a div with the content of the request comment
	$scope.getCommentary = function(idRaw){
		var result = idRaw;
		var index = idRaw.replace('#','');
		index--;
		var commentary2 = $scope.editor.comments[index];
		
		if (commentary2 == undefined){
			return idRaw;
		}
		
		var dataContent = '<div>'+commentary2.commentary+'</div>';
		if (commentary2.deleted == false){
			result = '<a title="'+idRaw+', by: '+commentary2.user+'" data-trigger="hover" rel="popover" data-placement="right" data-content="'+commentary2.commentary+'">'+idRaw+'</a>';
		}else{
			result = '<a title="'+idRaw+', by: '+commentary2.user+'" data-trigger="hover" rel="popover" data-placement="right" data-content="This comment has been removed by the author.">'+idRaw+'</a>';
		}
		$(document).ready(function() {
			$("[rel='popover']").popover({
				html: 'true',
				container: 'body'
			});
		});
		return result;
	};
	
	//Before write a comment, change #n by the popover commentary
	$scope.parseRefCommentaries = function(commentary){
		//Find #1 #2 #3 ... in string
		var htmlPage = commentary.replace(/#(\w{0,100})/g, function(idRaw){
			return $scope.getCommentary(idRaw);
		});
		return $sce.trustAsHtml(htmlPage);
	};
	
	//Confirm delete the selected branch (and children)
	$scope.confirmSelectedCommentay = function(commentary) {
		$scope.commentary = commentary;
		$('#confirmDeleteCommentary').modal({"backdrop" : "static"});
	};
	
	//Delete a commentary by idRaw
	$scope.deleteComentary = function(commentary){
		var selected_branch = tree.get_selected_branch();
		var username = $window.sessionStorage.username;
		if (selected_branch === undefined || selected_branch === null){
			selected_branch = {path: "/"};
		}
		$http.delete('/commentary/delete?action=deleteCommentary&path=' + selected_branch.path +'&idRaw='+commentary.idRaw+'&user='+username)
		.success(function(result) {
			if (tree.get_selected_branch() == null){
				$scope.tree_handler(undefined);
			}else{
				$scope.tree_handler(tree.get_selected_branch());
			}
			$scope.tab = {tab1: false, tab2: true, tab3:false, tab4:false};
			$('#confirmDeleteCommentary').modal('hide');
			$scope.tab = {tab1: true, tab2: false, tab3:false, tab4:false}
		}).error(function(result, code) {
			$scope.addAlert(code,result);
			$('#confirmDeleteCommentary').modal('hide');
		});
	};
	
	
	//Add in textAngular for page a template of table:
	$scope.createNewTable = function(){
		var rows = $scope.newTable.rows;
		var columns = $scope.newTable.columns;
		var i,j;
		var result='<br/><table class="table table-list-search"><thead><tr>';
		for (i = 0;i<columns; i++){
			result+='<th>Head '+(i+1)+'</th>';
		}
		result += '</tr></thead><tbody>';
		for (i=0;i<rows;i++){
			result += '<tr>';
			for (j=0;j<columns;j++){
				result += '<td>d'+(i+1)+(j+1)+'</td>';
			}
			result += '</tr>';
		}
		result += '</tbody> </table>';
		$('#insertTableModal').modal('hide');
		$scope.editor.htmlContent = $scope.editor.htmlContent + result;
		
	};
	
	//Add in textAngular the icon in the selected place:
	$scope.selectedIcon = function(icon){
 	    var  glossTag = '<i class="glyphicon glyphicon-'+icon+'"></i>';
 	    $scope.editor.htmlContent = $scope.editor.htmlContent + glossTag;
 	    $('#iconModal').modal('hide');
	};
	
	
	//**********************************************************************************
	//Upload file
	$scope.onFileSelect = function($files){
		var file = $files[0];
		var isCorrectFormat = false;
		
		if (file == undefined){
			$scope.addAlert("500","The file is not correct");
			return;
		}
		
		if (file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
			isCorrectFormat = true;
		}
		
		if (file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
			isCorrectFormat = true;
		}
		
		if (file.type == "application/vnd.openxmlformats-officedocument.presentationml.presentation"){
			isCorrectFormat = true;
		}
		
		if (isCorrectFormat){
			var fd = new FormData();
			fd.append('file',file);
			$http.put("/page/put?action=importDocInPage&path="+$scope.editor.path, fd, {
			    transformRequest: angular.identity,
			    headers: {'Content-Type': undefined}
			}).success(function(result) {
			  	$files = "";
			   	document.getElementById("file2Upload").value = "";
			   	if (tree.get_selected_branch() == null){
					$scope.tree_handler(undefined);
				}else{
					$scope.tree_handler(tree.get_selected_branch());
				}
			   	$scope.tab = {tab1: true, tab2: false, tab3:false, tab4:false};
			}).error(function(result, code) {
			   	$files = "";
			   	document.getElementById("file2Upload").value = "";
			   	$scope.addAlert(code,result);
			});
		}else{
			document.getElementById("file2Upload").value = "";
			$scope.addAlert("500","The type of file is not supported");
		};
	};
	
	//Export file
	$scope.exportPage = function(type){
		$http.get('/page/get?action=getExportedPage&path='+$scope.editor.path+"&type="+type)
		.success(function(data, status, headers) {

            headers = headers();
            var filename = headers["x-filename"] || "download.bin";
            var contentType = headers["content-type"] || "application/octet-stream";

            // Support for saveBlob method (Currently only implemented in Internet Explorer as msSaveBlob, other extension incase of future adoption)
            var saveBlob = navigator.msSaveBlob || navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;

            if (headers["content-transfer-encoding"] == "base64"){
            	data = $base64.decode(data);
            }
            if(saveBlob){
                // Save blob is supported, so get the blob as it's contentType and call save.
                var blob = new Blob([data], { type: contentType });
                saveBlob(blob, filename);
            }
            else{
                // Get the blob url creator
                var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                if(urlCreator){
                    // Try to use a download link
                    var link = document.createElement("a");
                    if("download" in link){
                        // Prepare a blob URL
                        var blob = new Blob([data], { type: contentType });
                        var url = urlCreator.createObjectURL(blob);
                        link.setAttribute("href", url);

                        // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                        link.setAttribute("download", filename);

                        // Simulate clicking the download link
                        var event = document.createEvent('MouseEvents');
                        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                        link.dispatchEvent(event);

                    } else {
                        // Prepare a blob URL
                        // Use application/octet-stream when using window.location to force download
                        var blob = new Blob([data], { type: octetStreamMime });
                        var url = urlCreator.createObjectURL(blob);
                        window.location = url;
                    }
                } else {
                    window.open($scope.appPath + 'CourseRegConfirm/getfile','_blank','');
                }
            }

        }).error(function(result, code) {
			$scope.addAlert(code,result);
		});
		
		
		//var content2Parse = $scope.editor.htmlContent;
//		var content2Parse = 'file content';
//		var blob = new Blob([ content2Parse ], { type : 'text/plain' });
//		$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
	}
	
	//Open rss modal with URL
	$scope.open_rss_modal = function(type){
		var url = $location.absUrl()
		if (type == 'pages'){
			$scope.rssUrl = $location.absUrl()+"/../rss/get?action=getPage"
			$('#showRSSURLModal').modal({"backdrop" : "static"});
		}
		if (type == 'comments'){
			$scope.rssUrl = $location.absUrl()+"/../rss/get?action=getCommentary"
			$('#showRSSURLModal').modal({"backdrop" : "static"});
		}
	}
	
	//is authorized the action for the page?
	$scope.isAuthorized = function(todo){
		var username = $window.sessionStorage.username;
		var selected_branch = tree.get_selected_branch();
		$http.get('/settings/get?action=isAuthorized&user='+username+'&item=page&todo='+todo+'&currentPage='+selected_branch).success(function(result) {
			if (result=="true"){return true;}else{return false;}
		}).error(function(result, code) {
			$scope.addAlert(code,result);
		});
	}
	
	$scope.multiply = function (multiplier1, multiplier2) {
	   return multiplier1 * multiplier2;
	};
	
	$scope.tree_control = tree;
	$scope.tree_handler(undefined);
	$scope.tree_data = [];
	this.loadTree();
}]);