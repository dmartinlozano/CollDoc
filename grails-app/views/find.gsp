
<div class="panel panel-default" id="divFindModal" ng-controller="FindController" >
    <div class="panel-heading">
      <button type="button" class="close"  ng-click="cancel()">&times;</button>
      <h4 class="modal-title">Results</h4>
    </div>
    <div>
  		<alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)">{{alert.msg}}</alert>
	</div>
    <div class="modal-body">
    
		<tabset> 
			<tab heading="Pages" active="findTab.tab1">
			 	<table class="table">
			        <tr ng-repeat="query in queryResult.pages">
			            <td style="width:10%">
			           		<a href ng-click="open_html_in_tree(true,query.path)">{{query.path}}</a>
			            </td>
			            <td style="width:90%">
			            	 <div>
			                	<table>
							        <tr ng-repeat="subResult in query.result">
							            <td>
							            	 <div>
							                	<p ng-bind-html="parseFindResults(subResult)"></p>
							                 </div>
							            </td>
							        </tr>
							    </table>
			                 </div>
			            </td>
			        </tr>
			    </table>
			    <div collapse="querysPage.length != 0">
			    	<h3><span class="label label-info">No pages found</span></h3>
			    </div>
			</tab>
			<tab heading="Discussions" active="findTab.tab2">
				<table class="table">
			        <tr ng-repeat="query in queryResult.comments">
			            <td style="width:10%">
			           		<a href ng-click="open_html_in_tree(false,query.path)">{{query.path}}</a>
			            </td>
			            <td style="width:10%">#{{query.idRaw}}</td>
			            <td style="width:80%">
			            	 <div>
			                	<table>
							        <tr ng-repeat="subResult in query.result">
							            <td>
							            	 <div>
							                	<p ng-bind-html="parseFindResults(subResult)"></p>
							                 </div>
							            </td>
							        </tr>
							    </table>
			                 </div>
			            </td>
			        </tr>
			    </table>
			</tab> 
		</tabset>
	</div>
</div>
