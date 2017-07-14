exports.config = {
  baseUrl: 'http://localhost:8080/',
  //baseUrl: 'http://dev-colldoc.rhcloud.com/',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
	  //browserName: 'phantomjs',
	  browserName: 'chrome',
      'phantomjs.binary.path': 'c:/phantomjs.exe',
      'phantomjs.cli.args': ['--debug=true'],
      platform: 'WINDOWS'
  },
  //TODO falta settings.js:
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