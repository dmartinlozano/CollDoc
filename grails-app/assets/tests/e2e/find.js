describe('Find proofs', function() {
  it('Login', function() {
	  	//Open webbrowser in url defined in protractor conf file / baseUrl
	    var ptor = protractor.getInstance();
		browser.get(ptor.baseUrl);
		//login
	    element(by.id('usuario')).sendKeys('admin');
	    element(by.id('password')).sendKeys('admin');
	    element(by.id('submit')).click();
	    browser.sleep( 3000 ); 
	    //dashboard page is ok
	    expect(element(by.id('projectName')).isPresent()).toBe(true);
	  });
  
  it('Find', function() {
	  //find 'software' in page
	  element(by.id('queryInput')).sendKeys('software');
	  element(by.id('queryButton')).click();
	  expect(element(by.id('divFindModal')).isPresent()).toBe(true);
	  //some result is showed
	  //click in the first result and check that the page where the click is done is the same that shown page.
	  expect(element(by.repeater('query in queryResult.pages').row(0)).isPresent()).toBe(true);
	  var text = element(by.repeater('query in queryResult.pages').row(0)).$('a').getText();
	  element(by.repeater('query in queryResult.pages').row(0)).$('a').click();
	  expect(element(by.binding('editor.path')).getText()).toBe(text);
  });
  
});