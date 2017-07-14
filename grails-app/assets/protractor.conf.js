exports.config = {
  baseUrl: 'http://dev-colldoc.rhcloud.com/',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
	  browserName: 'phantomjs',
      'phantomjs.cli.args': ['--debug=true']
  },
  specs: ['tests/e2e/login.js','tests/e2e/find.js','tests/e2e/discussion.js','tests/e2e/page.js'],
  getPageTimeout: 30000,
  onPrepare: function () {},
  jasmineNodeOpts: {
      onComplete: function () {},
      isVerbose: true,
      showColors: true,
      includeStackTrace: true,
      defaultTimeoutInterval: 6000000
  }
};