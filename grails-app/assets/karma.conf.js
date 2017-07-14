module.exports = function(config) {
    config.set({
    	
    	
		basePath : '',
		files : [
		   'bower_components/angular/angular.js',
		   'bower_components/angular-mocks/angular-mocks.js',
		   'bower_components/angular-route/angular-route.js',
		   'bower_components/angular-bootstrap/ui-bootstrap.js',
		   'bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
		   'bower_components/angular-sanitize/angular-sanitize.js',
		   'bower_components/angular-ui-tree/dist/angular-ui-tree.js',
		   'bower_components/textAngular/dist/textAngular.min.js',
		   'bower_components/ng-table/ng-table.js',
		   'bower_components/ng-file-upload/angular-file-upload.js',
		   'bower_components/angular-base64/angular-base64.js',
//		   'bower_components/jasmine/lib/jasmine-core/jasmine.js',
//		   'bower_components/jasmine/lib/jasmine-core/jasmine-html.js',
//		   'bower_components/jasmine/lib/jasmine-core/boot/boot.js',
		   'javascripts/CollDoc/app.js',
		   'javascripts/CollDoc/controllers/pageController.js',
		   'javascripts/CollDoc/services/pageService.js',
		   'javascripts/CollDoc/factories/utilsFactory.js',
		   'tests/unit/pageControllerSpec.js',
		 //  'javascripts/CollDoc/**/*.js'
		],
//		exclude : [
//		   'javascripts/CollDoc/services/*.js',
//		   'javascripts/CollDoc/factories/*.js',
//		   'javascripts/CollDoc/directives/*.js',
//		   'javascripts/CollDoc/decorators/*.js'
//		],
		reporters : ['progress', 'html','coverage'],
		autoWatch : true,
		frameworks : ['jasmine'],
		browsers: ['PhantomJS'],
		preprocessors : {
			'javascripts/CollDoc/**/*.js': 'coverage'
		},
		plugins : ['karma-coverage','karma-jasmine', 'karma-phantomjs-launcher', 'karma-html-reporter'],
		coverageReporter : {
		  type : 'html',
		  dir : __dirname+'../../../target/js-coverage'
		},
		htmlReporter: {
		  outputDir: __dirname+'../../../target/js-reports',
		  templatePath: __dirname+'/jasmine_template.html'
		},
		captureTimeout: 60000,
	    browserNoActivityTimeout: 100000,
		singleRun: true
    });
  };
