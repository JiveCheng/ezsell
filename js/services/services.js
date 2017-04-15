app.service('session', function () {
	this.create = function (sessionId, userId, userRole) {
		this.id = sessionId;
		this.userId = userId;
		this.userRole = userRole;
	};
	this.destroy = function () {
		this.id = null;
		this.userId = null;
		this.userRole = null;
	};
	return this;
}).factory('authService', function ($http,$sessionStorage,session) {
	var auth = {};
	//var loginApiUrl = 'https://rockpays.com/sdkMobile/chk_id_pass.ashx';
	var loginApiUrl = './api/login';
	auth.login = function (credentials) {
		return $http.post(loginApiUrl, credentials).then(function (res) {
			if (res.data != "error") {
				session.create(res.data.sessionID, res.data.userID,res.data.userRole);
				console.log(session.id,session.userId,session.userRole);
				// STORE SESSION
				$sessionStorage.sessionID = res.data.sessionID;
				console.log($sessionStorage.sessionID);
				return {sessionID:res.data.sessionID,userID:res.data.userID,userRole:res.data.userRole};				
			} else {
				return null;
			};
		});
	};
	auth.logout = function () {
		session.destroy();
		console.log(session.id,session.userId,session.userRole);
		delete $sessionStorage.sessionID;
		console.log($sessionStorage.sessionID);
	};
	auth.isAuthenticated = function (credentials) {
		return $http.post('./api/sessionCheck', credentials).then(function (res) {
			if (res.data != "error") {
				session.create(res.data.sessionID, res.data.userID,res.data.userRole);
				$sessionStorage.sessionID = res.data.sessionID;
				return {sessionID:res.data.sessionID,userID:res.data.userID,userRole:res.data.userRole};
			}else{
				return null;
			};
		}, function (res) {
			return null;
		});
		// return !!session.userId;
	};
	auth.isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (auth.isAuthenticated() && authorizedRoles.indexOf(session.userRole) !== -1);
	};
	auth.isExistSessionStorage = function () {
		// CHECK SESSION STORAGE
		return !!$sessionStorage.sessionID;
	};
	return auth;
}).filter('propsFilter', function() {
	return function(items, props) {
		var out = [];
		if (angular.isArray(items)) {
			items.forEach(function(item) {
				var itemMatches = false;
				var keys = Object.keys(props);
				for (var i = 0; i < keys.length; i++) {
					var prop = keys[i];
					var text = props[prop].toLowerCase();
					if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
						itemMatches = true;
						break;
					}
				}
				if (itemMatches) {
					out.push(item);
				}
			});
		} else {
			// Let the output be the input untouched
			out = items;
		}
		return out;
	};
}).filter('statuFilter', function() {
	return function(number, rows) {
		var name = null; 
		for (var i = 0; i < rows.length; i++) {
			if (rows[i].status == number) {
				name = rows[i].name;
			};
		};
		return name;
	};
});
