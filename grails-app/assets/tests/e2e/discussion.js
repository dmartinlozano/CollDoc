describe('Discussion proofs', function() {
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
  
  it('Discussion create', function() {
	  var ptor = protractor.getInstance();
	  element(by.id('projectName')).click();
	  
	  //Do click in the second tab of page
	  expect(element(by.binding('editor.path')).isPresent()).toBe(true);
	  element.all(by.css('.nav-tabs li a .ng-scope .glyphicon')).then(function(items) {
		  items[1].click(); 
		  expect(element(by.id('addCommentaryButton')).isPresent()).toBe(true);
		});
	  element(by.id('addCommentaryButton')).click();
	  expect(element(by.id('addCommentaryModal')).isPresent()).toBe(true);
	  
	  //Get the texteditor of commentary add send a text:
	  expect(element(by.id('commentaryEditorTextArea')).isPresent()).toBe(true);
	  expect(element(by.model('commentary.content')).isPresent()).toBe(true);
	  element(by.model('commentary.content')).click();
	  ptor.actions().sendKeys('Prueba comentario').perform();
	  expect(element(by.model('commentary.content')).getText()).toEqual("H1\nH2\nH3\nH4\nH5\nH6\nP\npre\nPrueba comentario");
	  
	  //Accept:
	  element(by.css('#addCommentaryModal > div > div > div.modal-footer > button.btn.btn-primary')).click();
	  element(by.css('#page-wrapper > div > div > div > div.panel-body > div > div > div.tab-pane.ng-scope.active > div > table > thead > tr.ng-table-filters.ng-scope > th > div > div > div > input')).sendKeys('Prueba comentario');
	  browser.sleep( 3000 ); 
	  //Check if the previous comment exists:
	  expect(element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div/div/div[2]/div/table/tbody/tr/td/div/div/small[3]/p/p')).isPresent()).toBe(true);
	  expect(element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div/div/div[2]/div/table/tbody/tr/td/div/div/small[3]/p/p')).getText()).toEqual('Prueba comentario');
  });
  
  it('Discussion delete', function() {
	  //Open webbrowser in url defined in protractor conf file / baseUrl
	  var ptor = protractor.getInstance();
	  browser.get(ptor.baseUrl);
	  
	  //login
	  element(by.id('usuario')).sendKeys('admin');
	  element(by.id('password')).sendKeys('admin');
	  element(by.id('submit')).click();
	  browser.sleep( 3000 );
	  
	  //Do click in the second tab of page
	  expect(element(by.binding('editor.path')).isPresent()).toBe(true);
	  element.all(by.css('.nav-tabs li a .ng-scope .glyphicon')).then(function(items) {
		  items[1].click(); 
		});
	  
	  //Filter prueba comentario
	  element(by.css('#page-wrapper > div > div > div > div.panel-body > div > div > div.tab-pane.ng-scope.active > div > table > thead > tr.ng-table-filters.ng-scope > th > div > div > div > input')).sendKeys('Prueba comentario');
	  expect(element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div/div/div[2]/div/table/tbody/tr[1]/td/div/div/p/small[1]/a')).isPresent()).toBe(true);
	  element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div/div/div[2]/div/table/tbody/tr[1]/td/div/div/p/small[1]/a')).click();
	  
	  //click save changes in modal window
	  expect(element(by.xpath('//*[@id="confirmDeleteCommentary"]')).isPresent()).toBe(true);
	  expect(element(by.xpath('//*[@id="confirmDeleteCommentary"]/div/div/div[3]/button[2]')).isPresent()).toBe(true);
	  element(by.xpath('//*[@id="confirmDeleteCommentary"]/div/div/div[3]/button[2]')).click();
	  
  });
  
});