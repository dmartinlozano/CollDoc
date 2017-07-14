describe('Page proofs', function() {
//	  element.getText().then(console.log);
  it('Login', function() {
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
  
  it('Page create', function() {
	  element(by.id('projectName')).click();
	  
	  //Do click in the second tab of page
	  expect(element(by.binding('editor.path')).isPresent()).toBe(true);
	  element.all(by.css('.nav-tabs li a .ng-scope .glyphicon')).then(function(items) {
		  items[3].click(); 
	  });
	  //Do click in new page
	  expect(element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div/div/div[4]/accordion/div/div[1]/div[1]/h4/a/span')).isPresent()).toBe(true);
	  element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div/div/div[4]/accordion/div/div[1]/div[1]/h4/a/span')).click();
	  element(by.id('newSubPageText')).sendKeys('newPageProof');
	  element(by.id('newSubPageButton')).click();
	  browser.sleep( 3000 ); 

	  //click in the new page created in the left tree
	  element.all(by.xpath('//*[@id="treeId"]/li')).each(function(element) {
		  element.getText().then(function(name){
			 if (name == 'newPageProof'){
				 element.click();
			 }
		  });
		});
	  
	  browser.sleep( 3000 ); 
	  //The page loaded is the new page created
	  expect(element(by.binding('editor.label')).getText()).toBe('newPageProof');
  });

  it('Page already create', function() {
	  element(by.id('projectName')).click();
	  
	  //Do click in the second tab of page
	  expect(element(by.binding('editor.path')).isPresent()).toBe(true);
	  element.all(by.css('.nav-tabs li a .ng-scope .glyphicon')).then(function(items) {
		  items[3].click(); 
	  });
	  //Do click in new page
	  //The accordion step is note neccesary:is already deployed in the last step
	  element(by.id('newSubPageText')).clear();
	  element(by.id('newSubPageText')).sendKeys('newPageProof');
	  element(by.id('newSubPageButton')).click();
	  browser.sleep( 5000 ); 
	  
	  //A message 400 appears: The name of the sub-Page is already in use:
	  expect(element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div[1]/div/span')).isPresent()).toBe(true);
	  expect(element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div[1]/button')).isPresent()).toBe(true);
	  element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div[1]/button')).click();
  });
  
  it('Page edit', function() {
	  var ptor = protractor.getInstance();
	  element(by.id('projectName')).click();
	  
	  //click in the new page created in the left tree
	  element.all(by.xpath('//*[@id="treeId"]/li')).each(function(element) {
		  element.getText().then(function(name){
			 if (name == 'newPageProof'){
				 element.click();
			 }
		  });
	  });
	  
	//Do click in the 3 tab of page
	  element.all(by.css('.nav-tabs li a .ng-scope .glyphicon')).then(function(items) {
		  items[2].click(); 
	  });
	  
	  //Get the texteditor of commentary add send a text:
	  expect(element(by.id('pageEditorTextArea')).isPresent()).toBe(true);
	  expect(element(by.model('editor.htmlContent')).isPresent()).toBe(true);
	  element(by.model('editor.htmlContent')).click();
	  ptor.actions().sendKeys('Prueba pagina').perform();
	  expect(element(by.model('editor.htmlContent')).getText()).toEqual('H1\nH2\nH3\nH4\nH5\nH6\nP\npre\nHeader\nL\nL\nL\nL\nL\nL\nB\nA\nA\nA\nA\nHTML\nMark Down\nPrueba pagina');  
  });  
  
  it('Page delete', function() {
	  var ptor = protractor.getInstance();
	  element(by.id('projectName')).click();
	  
	  //click in the new page created in the left tree
	  element.all(by.xpath('//*[@id="treeId"]/li')).each(function(element) {
		  element.getText().then(function(name){
			 if (name == 'newPageProof'){
				 element.click();
			 }
		  });
	  });
	  
	  //Do click in the 4 tab of page
	  element.all(by.css('.nav-tabs li a .ng-scope .glyphicon')).then(function(items) {
		  items[3].click(); 
	  });
	  browser.sleep( 3000 ); 
	  
	  //Do click in delete page
	  expect(element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div/div/div[4]/accordion/div/div[2]/div[1]/h4/a/span')).isPresent()).toBe(true);
	  element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div/div/div[4]/accordion/div/div[2]/div[1]/h4/a/span')).click();
	  element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div/div/div[4]/accordion/div/div[2]/div[2]/div/button')).click();
	  browser.sleep( 3000 ); 
	  
	  //click in modal window, accept
	  expect(element(by.id('confirmDeleteBranchModal')).isPresent()).toBe(true);
	  element(by.xpath('//*[@id="confirmDeleteBranchModal"]/div/div/div[3]/button[2]')).click();
	  browser.sleep( 6000 ); 
	  
	  //An error message doesn't appears:
	  expect(element(by.xpath('//*[@id="page-wrapper"]/div/div/div/div[2]/div[1]/div/span')).isPresent()).toBe(false);
	  
  });  
  
  //TODO rename page ?
  //TODO upload
  //TODO download
  
});