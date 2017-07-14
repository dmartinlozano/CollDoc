<head>
<meta name="layout" content="main" />
</head>

<body>

	<div class="container" ng-app="LoginModule">
		<div class="row">
			<div class="col-md-4 col-md-offset-4">
				<div class="login-panel panel panel-default">
					<div class="panel-heading" id="signPanelId">
						<h3 class="panel-title">Please Sign In</h3>
					</div>
					<div class="panel-body">
						<form name="loginForm" ngclass="form-horizontal" role="form"
							ng-controller="LoginController as loginCtrl"
							ng-submit="loginCtrl.login()" novalidate>
							<fieldset>
								<div id="incorrect-group" ng-show="allowed == false">
									<pre class="alert alert-danger">Incorrect login</pre>
								</div>
								<div class="form-group">
									<input type="text" class="form-control" id="usuario"
										ng-model="loginCtrl.credentials.username" placeholder="User"
										required>
								</div>
								<div class="form-group">
									<input type="password" class="form-control" id="password"
										ng-model="loginCtrl.credentials.password"
										placeholder="Password" required>
								</div>
								<button type="submit" class="btn btn-lg btn-primary btn-block" id="submit" >Login</button>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>