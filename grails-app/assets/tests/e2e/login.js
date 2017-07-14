describe('Login proofs', function() {

  var ptor = protractor.getInstance();

  it('Login ok', function() {
	  	// Open webbrowser in url defined in protractor conf file / baseUrl
		browser.get(ptor.baseUrl);
		// login
	    element(by.id('usuario')).sendKeys('admin');
	    element(by.id('password')).sendKeys('admin');
	    element(by.id('submit')).click();
	    browser.sleep( 6000 ); 
	    // dashboard page is ok
	    expect(element(by.id('projectName')).isPresent()).toBe(true);
	  });
  it('Logout', function() {
	  element(by.css('.nav.navbar-top-links.navbar-right')).click();
	  element(by.id('menuDropDownId')).click();
	  element(by.css('#logoutId')).click();
	  browser.sleep( 3000 ); 
	  expect(element(by.css(' #signPanelId > h3')).isPresent()).toBe(true);  
  });
  it('Incorrect login', function() {
	  browser.get(ptor.baseUrl);
	  element(by.id('usuario')).sendKeys('admin1');
	  element(by.id('password')).sendKeys('admin');
	  element(by.id('submit')).click();
	  expect(element(by.id('incorrect-group')).isPresent()).toBe(true);
	});
});