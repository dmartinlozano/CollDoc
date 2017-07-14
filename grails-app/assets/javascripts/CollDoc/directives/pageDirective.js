angular.module('CollDoc')

 //Create the popups with the comments
 .directive("popoverHtmlUnsafePopup", function () {
 return {
      restrict: "EA",
      replace: true,
      scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
      template: '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">  <div class="arrow"></div>  <div class="popover-inner">      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>      <div class="popover-content" bind-html-unsafe="content"></div>  </div></div>'
    };
  })

  .directive("popoverHtmlUnsafe", [ "$tooltip", function ($tooltip) {
    return $tooltip("popoverHtmlUnsafe", "popover", "click");
  }])
  
  //Create the html page
  .directive('parseHtmlView', ['$sce', function($sce){
    return {
        scope: {
        	parseHtmlView: '=',
        },
        template: "<div ng-bind-html='trustedHtml'></div>",
        link: function($scope, iElm, iAttrs, controller) {
        	$scope.$watch('parseHtmlView', function(newVal, oldVal) {
        		var htmlContent = $sce.getTrusted($sce.HTML, newVal);
        		if (htmlContent != undefined){
        			var i=0;
        			
        			//Reemplace for index:
	        		htmlContent = htmlContent.replace(/\<div(.*?)\>/g,'');
	    			htmlContent = htmlContent.replace(/\<\/div\>/g,'');
	    			htmlContent = htmlContent.replace(/\<h(.*?)\>/g, '\<div id=\"1\"\>\<h$1\>');
	    			htmlContent = htmlContent.replace(/\<\/h(.*?)\>/g, '\</h$1\>\<\/div\>');
	    			htmlContent = htmlContent.replace(/div id=\"1\"/g, function() { return 'div id=\"' + (++i) + '\"'; });
	    			
	    			//Create the commentaries in html page (popovers):
	    			var i = 1;
	    			htmlContent = htmlContent.replace(/<a class="btn btn-warning loading disabled">(.*?)<\/a>/g,function(a,b) { return '<a data-trigger="hover" rel="popover" data-placement="right" data-content="'+b+'">#'+(i++)+'</a>'; });
        		}
                $scope.updateView(htmlContent);
             });
            $scope.updateView = function(htmlContent) {
                $scope.trustedHtml = $sce.trustAsHtml(""+htmlContent );
            }
        }
    };
  }])
  
  //Create the index pane of page
  .directive('createIndexForHtmlView', ['$sce', function($sce){
    return {
        scope: {
        	createIndexForHtmlView: '=',
        },
        template: "<div ng-bind-html='trustedHtml'></div>",
        link: function($scope, iElm, iAttrs, controller) {
        	$scope.$watch('createIndexForHtmlView', function(newVal, oldVal) {
        		var htmlContent = $sce.getTrusted($sce.HTML, newVal);
        		if (htmlContent != undefined){
        			var i=0;
        			htmlContent = htmlContent.replace(/\<div(.*?)\>/g,'');
	    			htmlContent = htmlContent.replace(/\<\/div\>/g,'');
	    			htmlContent = htmlContent.replace(/\<h(.*?)\>/g, '\<div id=\"1\"\>\<h$1\>');
	    			htmlContent = htmlContent.replace(/\<\/h(.*?)\>/g, '\</h$1\>\<\/div\>');
	    			htmlContent = htmlContent.replace(/div id=\"1\"/g, function() { return 'div id=\"' + (++i) + '\"'; });
        			var regex = /div id=\"(.*?)\"\>(.*?)\<\/div\>/g;
        			var matches, output = "";
        			while (matches = regex.exec(htmlContent)) {
        			    output = output +='<a href="##'+matches[1]+'">'+matches[2]+'</a>';
        			}
        			htmlContent = $sce.trustAsHtml(output);
        		}
                $scope.updateView(htmlContent);
             });
            $scope.updateView = function(htmlContent) {
                $scope.trustedHtml = $sce.trustAsHtml(""+htmlContent);
            }
        }
    };
  }])
  
  //upload file
  .directive('uploadFile', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.uploadFile);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

