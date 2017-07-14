<!DOCTYPE html>
<html lang="en">
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->
<html lang="en" class="no-js" ng-app="CollDoc">
<!--<![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title><g:layoutTitle default="CollDoc" /></title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<asset:link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
<asset:stylesheet href="font-awesome/css/font-awesome.css" />
<asset:stylesheet href="bootstrap-css/css/bootstrap.css" />
<asset:stylesheet href="bootstrap/dist/css/bootstrap.css" />
<asset:stylesheet href="application.css" />
<asset:stylesheet href="sb-admin-2.css" />
<asset:javascript src="application.js" />
<asset:javascript src="sb-admin-2.js" />
<script type="text/javascript">
	Response.resize(function() {
	    if ( Response.band(700) )
	    {//+ de 700:
	       $('.floating-container').css('width', '30%');
	    }
	    else 
	    {
	       $('.floating-container').css('width', '100%');
	    }
	});
</script>
<g:layoutHead />
</head>
<body class="body-login">
		<g:layoutBody />
</body>
</html>