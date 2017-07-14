angular.module('CollDoc').config(function ($provide) {
    	  // this demonstrates how to register a new tool and add it to the default toolbar
        $provide.decorator('taOptions', ['$delegate', function(taOptions){
            // $delegate is the taOptions we are decorating
            // here we override the default toolbars and classes specified in taOptions.
            taOptions.toolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'ul', 'ol'],
                ['justifyLeft','justifyCenter','justifyRight'],
                ['insertImage', 'insertLink'],
                ['underscore', 'label-default','label-primary','label-success','label-info','label-warning','label-danger', 'badge'],
                ['alert-success','alert-info','alert-warning','alert-danger'],
                ['table', 'icons', 'save', 'prueba'],
                ['html', 'md']
            ];
            taOptions.classes = {
                focussed: 'focussed',
                toolbar: 'btn-toolbar',
                toolbarGroup: 'btn-group',
                toolbarButton: 'btn btn-default',
                toolbarButtonActive: 'active',
                disabled: 'disabled',
                textEditor: 'form-control',
                htmlEditor: 'form-control'
            };
            return taOptions; // whatever you return will be the taOptions
        }]);
        // this demonstrates changing the classes of the icons for the tools for font-awesome v3.x
        $provide.decorator('taTools', ['$delegate', function(taTools){
        	 taTools.bold.iconclass = 'fa fa-bold';
            taTools.italics.iconclass = 'fa fa-italic';
            taTools.underline.iconclass = 'fa fa-underline';
            taTools.ul.iconclass = 'fa fa-list-ul';
            taTools.ol.iconclass = 'fa fa-list-ol';
            taTools.undo.iconclass = 'fa fa-undo';
            taTools.redo.iconclass = 'fa fa-repeat';
            taTools.justifyLeft.iconclass = 'fa fa-align-left';
            taTools.justifyRight.iconclass = 'fa fa-align-right';
            taTools.justifyCenter.iconclass = 'fa fa-align-center';
            taTools.clear.iconclass = 'fa fa-ban-circle';
            taTools.insertLink.iconclass = 'fa fa-link';
     //       taTools.unlink.iconclass = 'fa fa-unlink';
            taTools.insertImage.iconclass = 'fa fa-picture-o';
            delete taTools.quote.iconclass;
            taTools.quote.iconclass = 'fa fa-quote-right';
            taTools.html.buttontext='HTML';
            return taTools;
        }]);
        
      //Add more buttons y editor
        $provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$sce', 'taSelection', '$modal', function(taRegisterTool, taOptions, $sce, taSelection, $modal){
            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
        	 
        	//Underscore:
        	taRegisterTool('underscore', {
        		buttontext: '<u>Header</u>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<div class="page-header">'+ selectedText +'</div>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'page-header';
            	    return false;
            	}
            });
        	
        	//Bootstrap labels:
            taRegisterTool('label-default', {
            	buttontext: '<span class="label label-default">L</span>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<span class="label label-default">'+ selectedText +'</span>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'label label-default';
            	    return false;
            	}
            });
            taRegisterTool('label-primary', {
            	buttontext: '<span class="label label-primary">L</span>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<span class="label label-primary">'+ selectedText +'</span>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'label label-primary';
            	    return false;
            	}
            });
            taRegisterTool('label-success', {
            	buttontext: '<span class="label label-success">L</span>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<span class="label label-success">'+ selectedText +'</span>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'label label-success';
            	    return false;
            	}
            });
            taRegisterTool('label-info', {
            	buttontext: '<span class="label label-info">L</span>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<span class="label label-info">'+ selectedText +'</span>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'label label-info';
            	    return false;
            	}
            });
            taRegisterTool('label-warning', {
            	buttontext: '<span class="label label-warning">L</span>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<span class="label label-warning">'+ selectedText +'</span>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'label label-warning';
            	    return false;
            	}
            });
            taRegisterTool('label-danger', {
            	buttontext: '<span class="label label-danger">L</span>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<span class="label label-danger">'+ selectedText +'</span>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'label label-danger';
            	    return false;
            	}
            });
            
            //Alerts
            
            taRegisterTool('alert-success', {
            	buttontext: '<span class="alert alert-success">A</span>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<div class="alert alert-success" role="alert">'+ selectedText +'</div>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'alert alert-success';
            	    return false;
            	}
            });
            
            taRegisterTool('alert-info', {
            	buttontext: '<span class="alert alert-info">A</span>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<div class="alert alert-info" role="alert">'+ selectedText +'</div>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'alert alert-info';
            	    return false;
            	}
            });
            
            taRegisterTool('alert-warning', {
            	buttontext: '<span class="alert alert-warning">A</span>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<div class="alert alert-warning" role="alert">'+ selectedText +'</div>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'alert alert-warning';
            	    return false;
            	}
            });
            
            taRegisterTool('alert-danger', {
            	buttontext: '<span class="alert alert-danger">A</span>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<div class="alert alert-danger" role="alert">'+ selectedText +'</div>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'alert alert-danger';
            	    return false;
            	}
            });
            
            //Badges
            taRegisterTool('badge', {
            	buttontext: '<span class="badge">B</span>',
            	action: function(e, elt, editorScope){
            	    var selectedText = window.getSelection();
            	    var  glossTag = '<span class="badge">'+ selectedText +'</span>';

            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'badge';
            	    return false;
            	}
            });
            //Save button
            taRegisterTool('save', {
                iconclass: "fa fa-save",
                action: function(){
                	$('#saveEditModal').modal({"backdrop" : "static"});
                }
            });
          //Icon button
            taRegisterTool('icons', {
                iconclass: "fa fa-bolt",
                action: function(e, elt, editorScope){
                	
                	$('#iconModal').modal({"backdrop" : "static"});
                	
                	
//                	//In selected:
//            	    var selectedText = window.getSelection();
//            	    var  glossTag = '<i class="glyphicon glyphicon-stop">'+ selectedText +'</i>';
//
//            	    return this.$editor().wrapSelection('insertHTML', glossTag, true);
            	},
            	activeState: function(commonElement) {
            	    if(commonElement) return commonElement[0].className === 'i';
            	    return false;
            	}
            });
            //Table
            taRegisterTool('table', {
                iconclass: "fa fa-table",
                action: function(e, elt, editorScope){
                	$('#insertTableModal').modal({"backdrop" : "static"});
                }
            });
            //Button for change to mark down
            taRegisterTool('md', {
            	buttontext: "Mark Down",
                action: function(){
                	var scope = angular.element(document.getElementById('divTreeCtrl')).scope();
                	var htmlContent = $sce.getTrusted($sce.HTML, scope.editor.htmlContent);
                	var html = htmlContent.split("\n").map($.trim).filter(function(line) { 
      			      return line != "";
      			    }).join("\n");
                	scope.editor.mdContent=toMarkdown(html);
                	var showHtml = angular.element(scope.editor.showHtml);
                	scope.editor.showHtml = !showHtml;
                }
            });
            
            taRegisterTool('prueba', {
                iconclass: "fa fa-comment",
                action: function($deferred) {
                    var textAngular = this;
                    var savedSelection = rangy.saveSelection();
                    var selectedText = document.getSelection();
                    var modalInstance = $modal.open({
                      // Put a link to your template here or whatever
                      template: '<div id="addCommentaryForPageModal">'+
											'	<div class="modal-header">'+
											'	 	<button type="button" class="close" ng-click="cancel()">&times;</button>'+
													'<h4 class="modal-title">Write a comment</h4>'+
												'</div>'+
												'<textarea ng-model="commentary" class="panel panel-default" rows="5" style="width: 100%;"></textarea>'+
							   					'<div class="modal-footer">'+
													'<button class="btn btn-warning" ng-click="cancel()">Cancel</button>'+
													'<button class="btn btn-primary" ng-click="saveCommentary(commentary)">Add</button>'+
												'</div>'+
										'</div>',
                      size: 'sm',
                      controller: ['$modalInstance', '$scope',
                        function($modalInstance, $scope) {
                          $scope.commentary = "";
                          $scope.saveCommentary = function(commentary) {
                        	  $modalInstance.close(commentary);
                        	  $('#addCommentaryForPageModal').modal('hide');
                          };
                          $scope.cancel = function () {
                        	    $modalInstance.dismiss('cancel');
                        	  };
                        }
                      ]
                    });

                    modalInstance.result.then(function(commentary) {
                    	rangy.restoreSelection(savedSelection);
                    	//var  result = selectedText + '<div class="panel panel-danger">'+commentary+'</div>';
                    	var  result = selectedText + '<a class="btn btn-warning loading disabled">'+commentary+'</a>';
                    	return textAngular.$editor().wrapSelection('insertHTML', result, true);
                    	//$deferred.resolve();
                    });	
                    return false;
                  },
                });
            // add the button to the default toolbar definition
            //taOptions.toolbar[5].push('save');
            return taOptions;
        }]);
});