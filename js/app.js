'use strict';
var app = angular.module('app', [
	'ngStorage',
	'ngSanitize',
	'ui.router',
	'ui.select',
	'ui.bootstrap',
	'cfp.loadingBar',
	'textAngular',
	'checklist-model',
	'flow',
	'monospaced.qrcode'
]).run([
	'$rootScope',
	'$state',
	'$stateParams',
	'$sessionStorage',
	'$location',
	'authService',
	function ($rootScope,$state,$stateParams,$sessionStorage,$location,authService) {
		console.log("run running");
		// DETECT SESSIONID IS STOREED OR NOT
		if ( !!$sessionStorage.sessionID ) {
			// IF SESSIONID IS EXIST AND POST TO SERVER FOR CHECK
			authService.isAuthenticated({sessionID:$sessionStorage.sessionID}).then(function (userData) {
				$rootScope.app = {};
				$rootScope.app.currentUser = userData;
				var accessConsolePath = ($location.path().indexOf('cs') != -1);
				var currentUserDataExist = (!!$rootScope.app.currentUser);
				if ( accessConsolePath && !currentUserDataExist ) {
					$location.path('/signin');
				};
				console.log("sessiong checked");
			});
		} else {
			$rootScope.app = {};
			($location.path().indexOf('cs') != -1) && ($location.path('/signin'));
		}
		console.log("run done");
	}
]).controller('AppCtrl',[
	'$rootScope',
	'$scope',
	'$state',
	'$location',
	'$http',
	'cfpLoadingBar',
	function ($rootScope,$scope,$state,$location,$http,cfpLoadingBar) {
		// BASESCOPE
		console.log("basescope running");
		$scope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams){
			cfpLoadingBar.start();
			$scope.app.loaded = false;
		});
		$scope.$on('$viewContentLoaded',function(event,toState,toParams,fromState,fromParams){
			cfpLoadingBar.complete();
			$scope.app.loaded = true;
		});
		$scope.app = {};
		$scope.app.loaded = false;
		$scope.app.settings = {
			headerFixed: false,
			asideFixed: true,
			asideFolded: false,
			asideDock: false,
			dateFormats: ['yyyy-MM-dd','yyyy-MM-dd HH:mm:ss']
		};
		$scope.app.apiurl = './api/';
		//$scope.app.apiurl = 'https://rockpays.com/sdkMobile/';
		// LOUOUT AFTER FUNCTION
		$scope.afterLogout = function () {
			$rootScope.app.currentUser = null;
		};
		// LOGIN AFTER FUNCTION
		$scope.afterLoggin = function (userData) {
			$rootScope.app.currentUser = userData;
			if( !!$rootScope.app.currentUser && $rootScope.app.currentUser.userRole == 'admin' ) {
				$state.go('cs.admin.dashboard');
			}else if( !!$rootScope.app.currentUser && $rootScope.app.currentUser.userRole == 'supplier' ) {
				$state.go('cs.supplier.dashboard');
			}else if( !!$rootScope.app.currentUser && $rootScope.app.currentUser.userRole == 'seller' ) {
				$state.go('cs.seller.dashboard');
			}else{
				$state.go('signin');
			}
		};
		$scope.checkCurrentRole = function (role) {
			if ( !!role ) {
				return (!!$rootScope.app.currentUser && $rootScope.app.currentUser.userRole == role) ? true : false;
			} else {
				return (!!$rootScope.app.currentUser) && ($rootScope.app.currentUser.userRole);
			};
		};
		$scope.checkRoleMatchPath = function () {
			var currPathArray = $location.path().split('/');
			return (currPathArray.indexOf($scope.checkCurrentRole()) != -1) ? true : false ;
		};
	}
]);