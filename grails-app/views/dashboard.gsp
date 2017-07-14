<head>
<meta name="layout" content="main" />
</head>
<body>

	<div id="divTreeCtrl" ng-controller="PageController">

		<!-- Navigation -->
		<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
			<div class="navbar-header" >
				<button type="button" class="navbar-toggle" data-toggle="collapse"
					data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span> <span
						class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<div  ng-controller="SettingsController">
					 <a class="navbar-brand" href="javascript:angular.element(document.getElementById('divTreeCtrl')).scope().reset()" id="projectName">
			      	{{projectName}}
			      	</a>
		      	</div>
			</div>
			<!-- /.navbar-header -->
			  
			<div ng-controller="SettingsController">
				<ul class="nav navbar-top-links navbar-right">
					<li class="dropdown" id="menuDropDownId"><a class="dropdown-toggle"
						data-toggle="dropdown" href="#"> <i class="fa fa-user fa-fw"></i>
							<i class="fa fa-caret-down"></i>
					</a>
						<ul class="dropdown-menu dropdown-user">
							<li><a href="#"><i class="fa fa-user fa-fw"></i> User Profile</a></li>
							<li><a href="#" ng-click="open_settings_modal()" ng-show="permissions.view"><i class="fa fa-gear fa-fw"></i> Settings</a></li>
							<li class="divider"></li>
							<li><a href="#" ng-click="open_rss_modal('pages')"><i class="fa fa-rss fa-fw"></i> RSS pages</a></li>
							<li><a href="#" ng-click="open_rss_modal('comments')"><i class="fa fa-rss fa-fw"></i> RSS coments</a></li>
							<li class="divider"></li>
							<li><a href="/" id="logoutId"><i class="fa fa-sign-out fa-fw"></i> Logout</a></li>
						</ul> <!-- /.dropdown-user --></li>
					<!-- /.dropdown -->
				</ul>
			</div>
			<div ng-controller="FindController">
				<div class="navbar-right">
			        <form class="navbar-form " role="search">
			        <div class="input-group">
			            <input type="text" class="form-control" placeholder="Search" name="q"  id="queryInput" ng-model="query">
			            <div class="input-group-btn">
			                <button class="btn btn-default" ng-click="find()" id="queryButton"><i class="glyphicon glyphicon-search"></i></button>
			            </div>
			        </div>
			        </form>
		        </div>
		    </div>
			<!-- /.navbar-top-links -->

			<div class="navbar-default sidebar" role="navigation">
				<div class="sidebar-nav navbar-collapse">
					<div >
						<abn-tree tree-data="tree_data" tree-control="tree_control" on-select="tree_handler(branch)" expand-level="1" id="treeId"></abn-tree>
					</div>
				</div>
			</div>
		</nav>
		

		<div id="page-wrapper">
			<div class="row">
				<div class="col-lg-12"  style="margin-top:30px">
					<div class="panel panel-default">
						<div class="panel-heading"><h4>
							<span class="label label-primary" ng-bind="editor.label"></span>
							<span class="label label-info" ng-bind="editor.path"></span>
						</h4>
						
						</div>

						<!-- /.panel-heading -->
						<div class="panel-body">
				  				<alert ng-repeat="alert in pageAlerts" type="{{alert.type}}" close="closeAlert($index)">{{alert.msg}}</alert>
								<!-- Tabs de arriba -->
									 <tabset>
									 	<tab active="tab.tab1">
									 	<tab-heading><i class="glyphicon glyphicon-book"></i>Page</tab-heading>
									    	<div>
									    		<div class="floating-container" >
									    	 	 	<accordion close-others="true" >
													    <accordion-group>
													     <accordion-heading> 
													     	<span class="glyphicon glyphicon-comment"></span>Index
													     </accordion-heading>   	
															<!--  <div ng-bind-html="editor.indexHtmlContent"></div>-->
															<div id="indexForHtmlView" create-index-for-html-view="editor.htmlContent"></div>
													    </accordion-group>
												    </accordion>
												</div>
									    		<div parse-html-view="editor.htmlContent"></div>
									    	</div>
									 	</tab>
									    <tab active="tab.tab2" id="divCommentsCtrl">
										    	<tab-heading><i class="glyphicon glyphicon-comment"></i><i class="icon-remove"></i>Discussion</tab-heading>
										    	<div>
											    	<button type="button" class="btn btn-primary pull-right" ng-click="openCommentaryModal(true,undefined)" id="addCommentaryButton">Add</button>
												 	<p><strong>Filter:</strong> {{commentariesTableParams.filter()|json}}
													<table ng-table="commentariesTableParams" show-filter="true" style="width:100%">
												        <tr ng-repeat="commentary in editor.comments">
												            <td data-title="''" style="width:100%" filter="{ 'commentary': 'text' }" >
																 <div class="well well-sm">
																 
												                    <a class="pull-left" href="#">
												                        <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg">
												                    </a>
												                    <div class="media-body">
												                    	<small class="pull-right time">,&nbsp;<i class="fa fa-clock-o"></i> {{commentary.updated | date:'dd-MM-yyyy HH:mm'}}</small>
												                        <small class="pull-right time"><i class="fa fa-clock-o"></i> {{commentary.created | date:'dd-MM-yyyy HH:mm'}}</small>
																		<h5 class="media-heading">
												                        	<span class="label label-primary">#{{commentary.idRaw}}</span>
																			<span class="label label-info">{{commentary.user}}</span>
												                        </h5>
												                        <small class="col-lg-10">
												                        	<p ng-bind-html="parseRefCommentaries(commentary.commentary)"></p>
												                        </small>
												                        <p ng-hide="{{commentary.deleted}}">
												                        	<small class="pull-right time">&nbsp;&nbsp;&nbsp;<a href="#" ng-click="confirmSelectedCommentay(commentary)">Delete</a></small>
												                        	<small class="pull-right time"><a href="#" ng-click="openCommentaryModal(false,commentary)">Edit</a></small>
												                        </p>
												                    </div>
												                </div>
												            </td>
												        </tr>
												    </table>
											    </div>
									    </tab>
									     <tab active="tab.tab3" id="EditPageId">
									    	<tab-heading><i class="glyphicon glyphicon-pencil"></i>Edit Page</tab-heading>
							   					<div text-angular ng-model="editor.htmlContent" class="panel panel-default animate-hide"  style="margin-top: 1%" id="pageEditorTextArea" ng-show="editor.showHtml"  ta-text-editor-setup="textAreaSetup"></div>
							   					<div name="mdEditorContent" id="pageMDTextArea" ng-show="!editor.showHtml" style="margin-top: 10px;" class="ta-root" >
							   						<div class="ta-toolbar btn-toolbar">
													  <div class="btn-group">
													    <a href="https://guides.github.com/features/mastering-markdown/" class="btn btn-default ng-scope" title="This is title" target="openHref">Help</a>
													    <button type="button" class="btn btn-default ng-scope" unselectable="on" ng-click="showPageHTmlEditor()"><i class="fa fa-pencil"></i>Text Editor</button>
													   </div>
													</div>
							   						<textarea mark-down ng-model="editor.mdContent"  class="form-control animate-hide" rows="17"></textarea>
							   					</div>
									    </tab> 
						
									<tab active="tab.tab4"> <tab-heading>
										<i class="glyphicon glyphicon-asterisk"></i>Management of pages</tab-heading>
										  <accordion close-others="true" >
										    <accordion-group>
										     <accordion-heading>Create a new Sub-Page</accordion-heading>
												<div class="form-group">
													<div class="col-md-10">
														<h3>The parent of the page will be {{selectedNode.label}}</h3>
														<input type="text" class="form-control" id="newSubPageText" placeholder="Title of the subpage"  ng-model="newSubPageLabel" required>
														<button type="button" class="btn btn-primary" ng-click="add_a_new_branch()" id="newSubPageButton"><span class="glyphicon glyphicon-plus"></span>Create</button>
													</div>
												</div>
										    </accordion-group>
										    <accordion-group>
										        <accordion-heading>Delete current page</accordion-heading>
										        <h3>Press Delete to confirm delete the current page {{selectedNode.label}}</h3>
										        <button type="button" class="btn btn-primary" ng-click="confirm_selected_branch()"><span class="glyphicon glyphicon-minus"></span>Delete</button>
										    </accordion-group>
										    <accordion-group>
										     <accordion-heading>Rename current Page</accordion-heading>
												<div class="form-group">
													<div class="col-md-10">
														<input class="form-control" id="subPageTitle" ng-model="selectedNode.label" required/>
														<button class="btn btn-primary" ng-click="rename_current_branch()"><span class="glyphicon glyphicon-sound-stereo"></span>Rename</button>
													</div>
												</div>
										    </accordion-group>
										    <accordion-group>
										     <accordion-heading>Move page</accordion-heading>
												<div class="form-group">
													<div class="col-md-10">
														...
													</div>
												</div>
										    </accordion-group>
										    <accordion-group>
										        <accordion-heading>Upload docx, pptx or xlsx</accordion-heading>
										        <h3>Select the file to append its content to the current page {{selectedNode.label}}</h3>
										        	<div class="control-group">
										        		<span class="">
  															<input class="glyphicon glyphicon-cloud-upload btn btn-primary" type="file" ng-file-select="onFileSelect($files)" id="file2Upload"/>
  														</span>
    												</div>
										    </accordion-group>
										    <accordion-group>
										        <accordion-heading>Export current page</accordion-heading>
										        <h3>Export {{selectedNode.label}} page how pdf, docx, pptx or html</h3>
										          <div class="btn-group">
												        <label class="btn btn-primary" ng-click="exportPage('Html')">Html</label>
												        <label class="btn btn-primary" ng-click="exportPage('Pdf')">Pdf</label>
												        <label class="btn btn-primary" ng-click="exportPage('Docx')">Docx</label>
												    </div>
										     </accordion-group>
										</accordion>	
										</tab>
									 </tabset>
						</div>
						 <!-- Modal to confirm to delete the current branch and files -->
						<div modal-show class="modal fade" id="confirmDeleteBranchModal">
							<div class="modal-dialog modalsm">
								<div class="modal-content">
									<div class="modal-header">
										<h4 class="modal-title">Delete?</h4>
									</div>
									<div class="modal-body">Are you sure that do you want delete the current page {{node.labelNode}} and all its children?</p>This action can't be undone.</div>
									<div class="modal-footer">
										<button class="btn btn-warning" data-dismiss="modal">Cancel</button>
										<button class="btn btn-primary" ng-click="delete_selected_branch()">Delete</button>
									</div>
								</div>
							</div>
						</div>
						 <!-- Modal to confirm to delete the current commentary -->
						<div modal-show class="modal fade" id="confirmDeleteCommentary">
							<div class="modal-dialog modalsm">
								<div class="modal-content">
									<div class="modal-header">
										<h4 class="modal-title">Delete?</h4>
									</div>
									<div class="modal-body">Are you sure that do you want delete the current commentary #{{commentary.idRaw}}?</p>This action can't be undone.</div>
									<div class="modal-footer">
										<button class="btn btn-warning" data-dismiss="modal">Cancel</button>
										<button class="btn btn-primary" ng-click="deleteComentary(commentary)">Delete</button>
									</div>
								</div>
							</div>
						</div>
						<!-- Modal to show and error -->
						<div modal-show class="modal fade" id="IndexBranchCannotBeDeleted">
							<div class="modal-dialog modalsm">
								<div class="modal-content">
									<div class="modal-header">
										<h4 class="modal-title">Error</h4>
									</div>
								<div class="modal-body">The page /index can not be deleted or renamed.</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-warning" data-dismiss="modal">OK</button>
								</div>
							</div>
							</div>
						</div>
						
						<!-- Modal to show to confirm save -->
						<div modal-show class="modal fade" id="saveEditModal">
							<div class="modal-dialog modalsm">
								<div class="modal-content">
									<div class="modal-header">
										<h4 class="modal-title">Save?</h4>
									</div>
									<div class="modal-body">Do you want save?</div>
									<div class="modal-footer">
										<button class="btn btn-warning" data-dismiss="modal">Cancel</button>
										<button class="btn btn-primary" ng-click="save_current_page()">Save changes</button>
									</div>
								</div>
							</div>
						</div>
						
						<!-- Modal to open a href -->
						<div id="openHref" class="modal hide fade" tabindex="-1" role="dialog">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">×</button>
									<h3>Help</h3>
							</div>
							<div class="modal-body">
						      <iframe src="" style="zoom:0.60" frameborder="0" height="250" width="99.6%"></iframe>
							</div>
							<div class="modal-footer">
								<button class="btn" data-dismiss="modal">OK</button>
							</div>
						</div>
						
						<!-- Modal to add a commentary -->
						<div modal-show class="modal fade"  id="addCommentaryModal">
								<div class="modal-dialog modal-lg">
									<div class="modal-content">
										<div class="panel-heading">
										 	<button type="button" class="close" data-dismiss="modal">&times;</button>
											<h4 class="modal-title">{{commentary.title}}</h4>
										</div>
										<div text-angular ng-model="commentary.content" class="panel panel-default"  style="margin-top: 1%"  id="commentaryEditorTextArea" ></div>
					   					<div class="modal-footer">
											<button class="btn btn-warning" data-dismiss="modal">Cancel</button>
											<button class="btn btn-primary" ng-click="createOrEditComment()">Save changes</button>
										</div>
									</div>
								</div>
						</div>
						
						<!-- Modal to open the url for rss -->
						<div modal-show class="modal fade" id="showRSSURLModal">
							<div class="modal-dialog modalsm">
								<div class="modal-content">
									<div class="modal-header">
										<h4 class="modal-title">RSS URL</h4>
									</div>
									<div class="modal-body">Copy this URL and paste it in your RSS provider:
									<input type="text" class="form-control" id="url" ng-model="rssUrl" readonly/>
									</div>
									<div class="modal-footer">
										<button class="btn btn-primary" data-dismiss="modal">OK</button>
									</div>
								</div>
							</div>
						</div>
						
						<!-- Modal to show how create a new table -->
						<div modal-show class="modal fade"  id="insertTableModal">
								<div class="modal-dialog modalsm">
									<div class="modal-content">
										<div class="modal-header">
											<h4 class="modal-title">Insert a table in the end of the Page</h4>
										</div>
										<div class="modal-body">
											<div class="form-horizontal">
												<div class="form-group">
													<label for="userName" class="col-sm-2 control-label">Columns:</label>
													<div class="col-sm-10">
														<input type="text" class="form-control" id="userName" placeholder="Columns" ng-model="newTable.columns" ng-pattern="/^[0-9]{1,7}$/"/>
														<span class="label label-danger" data-ng-show="newTable.columns.length == 0">Required!</span>
														<span class="label label-danger" data-ng-show="!parseInt(newTable.columns)">Not a valid number!</span>
														<span class="label label-danger" data-ng-show="newTable.columns < -1">Columns must be integer</span>
													</div>
												</div>
												<div class="form-group">
													<label for="userName" class="col-sm-2 control-label">Rows:</label>
													<div class="col-sm-10">
														<input type="text" class="form-control" id="userName" placeholder="Rows" ng-model="newTable.rows">
														<span class="label label-danger" data-ng-show="newTable.rows.length == 0">Required!</span>
														<span class="label label-danger" data-ng-show="!parseInt(newTable.rows)">Not a valid number!</span>
														<span class="label label-danger" data-ng-show="newTable.rows < -1">Rows must be integer</span>
													</div>
												</div>
											</div>
										</div>
										<div class="modal-footer">
											<button class="btn btn-warning" data-dismiss="modal">Cancel</button>
											<button class="btn btn-primary" ng-click="createNewTable()">Create</button>
										</div>
									</div>
								</div>
						</div>
						<!-- Modal to show icons -->
						 <div modal-show class="modal fade"  id="iconModal">
								<div class="modal-dialog modal-lg">
									<div class="modal-content">
										<div class="panel-heading">
										 	<button type="button" class="close" data-dismiss="modal">&times;</button>
											<h4 class="modal-title">Select an icon in the end of the Page</h4>
										</div>
										<div class="modal-body">	
										<button class="btn btn-default" ng-click="selectedIcon('asterisk')"><span class="glyphicon glyphicon-asterisk"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('plus')"><span class="glyphicon glyphicon-plus"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('euro')"><span class="glyphicon glyphicon-euro"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('minus')"><span class="glyphicon glyphicon-minus"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('cloud')"><span class="glyphicon glyphicon-cloud"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('envelope')"><span class="glyphicon glyphicon-envelope"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('pencil')"><span class="glyphicon glyphicon-pencil"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('glass')"><span class="glyphicon glyphicon-glass"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('music')"><span class="glyphicon glyphicon-music"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('search')"><span class="glyphicon glyphicon-search"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('heart')"><span class="glyphicon glyphicon-heart"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('star')"><span class="glyphicon glyphicon-star"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('star-empty')"><span class="glyphicon glyphicon-star-empty"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('user')"><span class="glyphicon glyphicon-user"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('film')"><span class="glyphicon glyphicon-film"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('th-large')"><span class="glyphicon glyphicon-th-large"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('th')"><span class="glyphicon glyphicon-th"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('th-list')"><span class="glyphicon glyphicon-th-list"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('ok')"><span class="glyphicon glyphicon-ok"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('remove')"><span class="glyphicon glyphicon-remove"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('zoom-in')"><span class="glyphicon glyphicon-zoom-in"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('zoom-out')"><span class="glyphicon glyphicon-zoom-out"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('off')"><span class="glyphicon glyphicon-off"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('signal')"><span class="glyphicon glyphicon-signal"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('cog')"><span class="glyphicon glyphicon-cog"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('trash')"><span class="glyphicon glyphicon-trash"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('home')"><span class="glyphicon glyphicon-home"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('file')"><span class="glyphicon glyphicon-file"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('time')"><span class="glyphicon glyphicon-time"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('road')"><span class="glyphicon glyphicon-road"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('download-alt')"><span class="glyphicon glyphicon-download-alt"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('download')"><span class="glyphicon glyphicon-download"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('upload')"><span class="glyphicon glyphicon-upload"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('inbox')"><span class="glyphicon glyphicon-inbox"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('play-circle')"><span class="glyphicon glyphicon-play-circle"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('repeat')"><span class="glyphicon glyphicon-repeat"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('refresh')"><span class="glyphicon glyphicon-refresh"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('list-alt')"><span class="glyphicon glyphicon-list-alt"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('lock')"><span class="glyphicon glyphicon-lock"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('flag')"><span class="glyphicon glyphicon-flag"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('headphones')"><span class="glyphicon glyphicon-headphones"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('volume-off')"><span class="glyphicon glyphicon-volume-off"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('volume-down')"><span class="glyphicon glyphicon-volume-down"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('volume-up')"><span class="glyphicon glyphicon-volume-up"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('qrcode')"><span class="glyphicon glyphicon-qrcode"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('barcode')"><span class="glyphicon glyphicon-barcode"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('tag')"><span class="glyphicon glyphicon-tag"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('tags')"><span class="glyphicon glyphicon-tags"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('book')"><span class="glyphicon glyphicon-book"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('bookmark')"><span class="glyphicon glyphicon-bookmark"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('print')"><span class="glyphicon glyphicon-print"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('camera')"><span class="glyphicon glyphicon-camera"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('font')"><span class="glyphicon glyphicon-font"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('bold')"><span class="glyphicon glyphicon-bold"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('italic')"><span class="glyphicon glyphicon-italic"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('text-height')"><span class="glyphicon glyphicon-text-height"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('text-width')"><span class="glyphicon glyphicon-text-width"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('align-left')"><span class="glyphicon glyphicon-align-left"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('align-center')"><span class="glyphicon glyphicon-align-center"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('align-right')"><span class="glyphicon glyphicon-align-right"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('align-justify')"><span class="glyphicon glyphicon-align-justify"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('list')"><span class="glyphicon glyphicon-list"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('indent-left')"><span class="glyphicon glyphicon-indent-left"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('indent-right')"><span class="glyphicon glyphicon-indent-right"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('facetime-video')"><span class="glyphicon glyphicon-facetime-video"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('picture')"><span class="glyphicon glyphicon-picture"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('map-marker')"><span class="glyphicon glyphicon-map-marker"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('adjust')"><span class="glyphicon glyphicon-adjust"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('tint')"><span class="glyphicon glyphicon-tint"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('edit')"><span class="glyphicon glyphicon-edit"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('share')"><span class="glyphicon glyphicon-share"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('check')"><span class="glyphicon glyphicon-check"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('move')"><span class="glyphicon glyphicon-move"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('step-backward')"><span class="glyphicon glyphicon-step-backward"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('fast-backward')"><span class="glyphicon glyphicon-fast-backward"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('backward')"><span class="glyphicon glyphicon-backward"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('play')"><span class="glyphicon glyphicon-play"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('pause')"><span class="glyphicon glyphicon-pause"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('stop')"><span class="glyphicon glyphicon-stop"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('forward')"><span class="glyphicon glyphicon-forward"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('fast-forward')"><span class="glyphicon glyphicon-fast-forward"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('step-forward')"><span class="glyphicon glyphicon-step-forward"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('eject')"><span class="glyphicon glyphicon-eject"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('chevron-left')"><span class="glyphicon glyphicon-chevron-left"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('chevron-right')"><span class="glyphicon glyphicon-chevron-right"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('plus-sign')"><span class="glyphicon glyphicon-plus-sign"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('minus-sign')"><span class="glyphicon glyphicon-minus-sign"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('remove-sign')"><span class="glyphicon glyphicon-remove-sign"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('ok-sign')"><span class="glyphicon glyphicon-ok-sign"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('question-sign')"><span class="glyphicon glyphicon-question-sign"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('info-sign')"><span class="glyphicon glyphicon-info-sign"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('screenshot')"><span class="glyphicon glyphicon-screenshot"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('remove-circle')"><span class="glyphicon glyphicon-remove-circle"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('ok-circle')"><span class="glyphicon glyphicon-ok-circle"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('ban-circle')"><span class="glyphicon glyphicon-ban-circle"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('arrow-left')"><span class="glyphicon glyphicon-arrow-left"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('arrow-right')"><span class="glyphicon glyphicon-arrow-right"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('arrow-up')"><span class="glyphicon glyphicon-arrow-up"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('arrow-down')"><span class="glyphicon glyphicon-arrow-down"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('share-alt')"><span class="glyphicon glyphicon-share-alt"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('resize-full')"><span class="glyphicon glyphicon-resize-full"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('resize-small')"><span class="glyphicon glyphicon-resize-small"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('exclamation-sign')"><span class="glyphicon glyphicon-exclamation-sign"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('gift')"><span class="glyphicon glyphicon-gift"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('leaf')"><span class="glyphicon glyphicon-leaf"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('fire')"><span class="glyphicon glyphicon-fire"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('eye-open')"><span class="glyphicon glyphicon-eye-open"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('eye-close')"><span class="glyphicon glyphicon-eye-close"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('warning-sign')"><span class="glyphicon glyphicon-warning-sign"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('plane')"><span class="glyphicon glyphicon-plane"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('calendar')"><span class="glyphicon glyphicon-calendar"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('random')"><span class="glyphicon glyphicon-random"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('comment')"><span class="glyphicon glyphicon-comment"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('magnet')"><span class="glyphicon glyphicon-magnet"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('chevron-up')"><span class="glyphicon glyphicon-chevron-up"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('chevron-down')"><span class="glyphicon glyphicon-chevron-down"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('retweet')"><span class="glyphicon glyphicon-retweet"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('shopping-cart')"><span class="glyphicon glyphicon-shopping-cart"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('folder-close')"><span class="glyphicon glyphicon-folder-close"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('folder-open')"><span class="glyphicon glyphicon-folder-open"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('resize-vertical')"><span class="glyphicon glyphicon-resize-vertical"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('resize-horizontal')"><span class="glyphicon glyphicon-resize-horizontal"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('hdd')"><span class="glyphicon glyphicon-hdd"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('bullhorn')"><span class="glyphicon glyphicon-bullhorn"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('bell')"><span class="glyphicon glyphicon-bell"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('certificate')"><span class="glyphicon glyphicon-certificate"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('thumbs-up')"><span class="glyphicon glyphicon-thumbs-up"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('thumbs-down')"><span class="glyphicon glyphicon-thumbs-down"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('hand-right')"><span class="glyphicon glyphicon-hand-right"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('hand-left')"><span class="glyphicon glyphicon-hand-left"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('hand-up')"><span class="glyphicon glyphicon-hand-up"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('hand-down')"><span class="glyphicon glyphicon-hand-down"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('circle-arrow-right')"><span class="glyphicon glyphicon-circle-arrow-right"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('circle-arrow-left')"><span class="glyphicon glyphicon-circle-arrow-left"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('circle-arrow-up')"><span class="glyphicon glyphicon-circle-arrow-up"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('circle-arrow-down')"><span class="glyphicon glyphicon-circle-arrow-down"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('globe')"><span class="glyphicon glyphicon-globe"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('wrench')"><span class="glyphicon glyphicon-wrench"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('tasks')"><span class="glyphicon glyphicon-tasks"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('filter')"><span class="glyphicon glyphicon-filter"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('briefcase')"><span class="glyphicon glyphicon-briefcase"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('fullscreen')"><span class="glyphicon glyphicon-fullscreen"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('dashboard')"><span class="glyphicon glyphicon-dashboard"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('paperclip')"><span class="glyphicon glyphicon-paperclip"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('heart-empty')"><span class="glyphicon glyphicon-heart-empty"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('link')"><span class="glyphicon glyphicon-link"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('phone')"><span class="glyphicon glyphicon-phone"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('pushpin')"><span class="glyphicon glyphicon-pushpin"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('usd')"><span class="glyphicon glyphicon-usd"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('gbp')"><span class="glyphicon glyphicon-gbp"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sort')"><span class="glyphicon glyphicon-sort"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sort-by-alphabet')"><span class="glyphicon glyphicon-sort-by-alphabet"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sort-by-alphabet-alt')"><span class="glyphicon glyphicon-sort-by-alphabet-alt"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sort-by-order')"><span class="glyphicon glyphicon-sort-by-order"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sort-by-order-alt')"><span class="glyphicon glyphicon-sort-by-order-alt"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sort-by-attributes')"><span class="glyphicon glyphicon-sort-by-attributes"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sort-by-attributes-alt')"><span class="glyphicon glyphicon-sort-by-attributes-alt"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('unchecked')"><span class="glyphicon glyphicon-unchecked"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('expand')"><span class="glyphicon glyphicon-expand"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('collapse-down')"><span class="glyphicon glyphicon-collapse-down"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('collapse-up')"><span class="glyphicon glyphicon-collapse-up"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('log-in')"><span class="glyphicon glyphicon-log-in"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('flash')"><span class="glyphicon glyphicon-flash"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('log-out')"><span class="glyphicon glyphicon-log-out"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('new-window')"><span class="glyphicon glyphicon-new-window"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('record')"><span class="glyphicon glyphicon-record"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('save')"><span class="glyphicon glyphicon-save"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('open')"><span class="glyphicon glyphicon-open"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('saved')"><span class="glyphicon glyphicon-saved"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('import')"><span class="glyphicon glyphicon-import"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('export')"><span class="glyphicon glyphicon-export"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('send')"><span class="glyphicon glyphicon-send"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('floppy-disk')"><span class="glyphicon glyphicon-floppy-disk"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('floppy-saved')"><span class="glyphicon glyphicon-floppy-saved"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('floppy-remove')"><span class="glyphicon glyphicon-floppy-remove"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('floppy-save')"><span class="glyphicon glyphicon-floppy-save"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('floppy-open')"><span class="glyphicon glyphicon-floppy-open"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('credit-card')"><span class="glyphicon glyphicon-credit-card"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('transfer')"><span class="glyphicon glyphicon-transfer"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('cutlery')"><span class="glyphicon glyphicon-cutlery"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('header')"><span class="glyphicon glyphicon-header"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('compressed')"><span class="glyphicon glyphicon-compressed"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('earphone')"><span class="glyphicon glyphicon-earphone"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('phone-alt')"><span class="glyphicon glyphicon-phone-alt"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('tower')"><span class="glyphicon glyphicon-tower"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('stats')"><span class="glyphicon glyphicon-stats"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sd-video')"><span class="glyphicon glyphicon-sd-video"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('hd-video')"><span class="glyphicon glyphicon-hd-video"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('subtitles')"><span class="glyphicon glyphicon-subtitles"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sound-stereo')"><span class="glyphicon glyphicon-sound-stereo"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sound-dolby')"><span class="glyphicon glyphicon-sound-dolby"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sound-5-1')"><span class="glyphicon glyphicon-sound-5-1"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sound-6-1')"><span class="glyphicon glyphicon-sound-6-1"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('sound-7-1')"><span class="glyphicon glyphicon-sound-7-1"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('copyright-mark')"><span class="glyphicon glyphicon-copyright-mark"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('registration-mark')"><span class="glyphicon glyphicon-registration-mark"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('cloud-download')"><span class="glyphicon glyphicon-cloud-download"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('cloud-upload')"><span class="glyphicon glyphicon-cloud-upload"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('tree-conifer')"><span class="glyphicon glyphicon-tree-conifer"></span> </button>
										<button class="btn btn-default" ng-click="selectedIcon('tree-deciduous')"><span class="glyphicon glyphicon-tree-deciduous"></span> </button>
										</div>
									</div>
								</div>
						</div>
						<!-- END OF MODALS -->
					</div>
				</div>
			</div><footer ng-controller="SettingsController">
				<p class="pull-right">{{projectName}} ©2014 Company</p>
			</footer></div>
	</div>
</body>
