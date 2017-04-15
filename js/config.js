app.config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
	// HOME PATH ===========================================================
	$stateProvider.state('home',{
		url: '/home'
	})
	// AUTHORIZE FUNCTION PATH =============================================
	.state('signin',{
		url: '/signin',
		templateUrl: './views/pages/signin.html',
		controller: function($scope,$rootScope,authService) {
			console.log("signin scope running");
			$scope.siteName = "ezSell";
			$scope.credentials = {
				username: '',
				password: ''
			};
			$scope.alerts = [];
			$scope.addLoginErrorAlert = function() {
				$scope.alerts.push({msg: '帳號或密碼不正確喔！'});
			};
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
			$scope.logout = function () {
				authService.logout();
				$scope.afterLogout(null);
			};
			$scope.login = function (credentials) {
				authService.login(credentials).then(function (user) {
					if ( !user ) {
						$scope.addLoginErrorAlert();
					} else {
						$scope.afterLoggin(user);						
					};
				},function () {console.log('login failure');});
			};
		}
	})
	.state('signup',{
		url: '/signup',
		templateUrl: './views/pages/signup.html',
		controller: function($scope,$http) {
			console.log("signup scope running");
			$scope.credentials = {};
			$scope.siteName = "ezSell";
			$scope.interface = {
				alerts: [],
				addAlert: function(msgString,msgType) {
					$scope.interface.alerts.push({msg: msgString,type: msgType});
				},
				closeAlert: function(index) {
					$scope.interface.alerts.splice(index, 1);
				}
			};
			$scope.signup = function () {
				var data = $scope.credentials;
				$http({method: 'POST',url: $scope.app.apiurl +  'signup',data: data}).then( function (res) {
					var data = res.data;
					if (data == 'success') {
						$scope.interface.addAlert('已提出申請！請待我們工作人員與您連絡！','success');
					} else {
						$scope.interface.addAlert('系統錯誤，請聯絡我們','danger');
					}
				});
			}
		}
	})
	// CONSOLE FUNCTION PATH ===============================================
	.state('cs',{
		abstract: true,
		url: '/cs',
		templateUrl: './views/pages/console.html',
		controller: function ($rootScope,$scope,$state,authService) {
			console.log("console scope running");
			// CONTORL NAV MENU DISPLAY MENU
			$scope.currentRole = {
				isAdmin: $scope.checkCurrentRole("admin"),
				isSupplier: $scope.checkCurrentRole("supplier"),
				isSeller: $scope.checkCurrentRole("seller")
			};
			while( !$rootScope.app ){
				console.log("wait for session check!");
			}
		}
	})
	// ADMIN FUNCTION PATH =================================================
	.state('cs.admin',{
		url: '/admin',
		templateUrl: './views/pages/admin.html',
		controller: function ($scope) {
			console.log("admin scope running");
			// CHECK AUTHORIZEDROLE
			(!$scope.checkCurrentRole("admin")) && ($state.go('signin'));
			$scope.config = {title: 'title',subtitle: 'subtitle',class: {editor: false,hfull: false}};
		}
	})
	.state('cs.admin.dashboard',{
		url: '/dashboard',
		templateUrl: './views/pages/cs.dashboard.html',
		controller: function ($scope,$state) {
			console.log("dashboard scope running");
			// CHECK AUTHORIZEDROLE
			(!$scope.checkCurrentRole("admin")) && ($state.go('signin'));
			$scope.$parent.config = {title: 'Dashboard',subtitle: '歡迎來到ezSell App',class: {editor: false,hfull: false}};
		}
	})
	.state('cs.admin.products-list',{
		url: '/products',
		templateUrl: './views/pages/cs.products.list.html',
		controller: 'productList'
	})
	.state('cs.admin.products-add',{
		url: '/add',
		templateUrl: './views/pages/cs.products.editor.html',
		controller: 'productEditor'
	})
	.state('cs.admin.products-editor',{
		url: '/editor/:productID',
		templateUrl: '/views/pages/cs.products.editor.html',
		controller: 'productEditor'
	})
	.state('cs.admin.products-bulkupload',{
		url: '/bulkupload',
		templateUrl: './views/pages/cs.bulkupload.html',
		controller: function () {
			console.log("products-bulkupload scope running");
		}
	})
	.state('cs.admin.marketplace',{
		url: '/marketplace',
		templateUrl: './views/pages/cs.marketplace.list.html',
		controller: 'marketPlace'
	})
	.state('cs.admin.orders',{
		url: '/orders',
		templateUrl: './views/pages/cs.order.list.html',
		controller: 'orderList'
	})
	.state('cs.admin.order-detail',{
		url: '/order-detail/:orderID',
		templateUrl: './views/pages/cs.order.detail.html',
		controller: 'orderDetail'
	})
	.state('cs.admin.billing',{
		url: '/billing',
		templateUrl: './views/pages/cs.billing.html',
		controller: 'billingOperation'
	})
	.state('cs.admin.info',{
		url: '/info',
		templateUrl: './views/pages/cs.info.html',
		controller: 'accountInfo'
	})
	// SUPPLIER FUNCTION PATH ==============================================
	.state('cs.supplier',{
		url: '/supplier',
		templateUrl: 'views/pages/supplier.html',
		controller: function ($scope) {
			console.log("supplier scope running");
			// CHECK AUTHORIZEDROLE
			(!$scope.checkCurrentRole("supplier")) && ($state.go('signin'));
			$scope.config = {title: 'title',subtitle: 'subtitle',class: {editor: false,hfull: false}}
		}
	})
	.state('cs.supplier.dashboard',{
		url: '/dashboard',
		templateUrl: './views/pages/cs.dashboard.html',
		controller: function ($scope,$state) {
			// CHECK AUTHORIZEDROLE
			(!$scope.checkRoleMatchPath()) && ($state.go('signin'));
			$scope.config = {title: 'title',subtitle: 'subtitle',class: {editor: false,hfull: false}};
		}
	})
	.state('cs.supplier.products-list',{
		url: '/products',
		templateUrl: './views/pages/cs.products.list.html',
		controller: 'productList'
	})
	.state('cs.supplier.products-add',{
		url: '/add',
		templateUrl: './views/pages/cs.products.editor.html',
		controller: 'productEditor'
	})
	.state('cs.supplier.products-editor',{
		url: '/editor/:productID',
		templateUrl: './views/pages/cs.products.editor.html',
		controller: 'productEditor'
	})
	.state('cs.supplier.products-bulkupload',{
		url: '/bulkupload',
		templateUrl: './views/pages/cs.bulkupload.html'
	})
	.state('cs.supplier.orders',{
		url: '/orders',
		templateUrl: './views/pages/cs.order.list.html',
		controller: 'orderList'
	})
	.state('cs.supplier.order-detail',{
		url: '/order-detail/:orderID',
		templateUrl: './views/pages/cs.order.detail.html',
		controller: 'orderDetail'
	})
	.state('cs.supplier.billing',{
		url: '/billing',
		templateUrl: './views/pages/cs.billing.html',
		controller: 'billingOperation'
	})
	.state('cs.supplier.info',{
		url: '/info',
		templateUrl: './views/pages/cs.info.html',
		controller: 'accountInfo'
	})
	// SELLER FUNCTION PATH ================================================
	.state('cs.seller',{
		url: '/seller',
		templateUrl: './views/pages/seller.html',
		controller: function ($scope) {
			console.log("seller scope running");
			// CHECK AUTHORIZEDROLE
			(!$scope.checkCurrentRole("seller")) && ($state.go('signin'));
			$scope.config = {title: 'title',subtitle: 'subtitle',class: {editor: false,hfull: false}}
		}
	})
	.state('cs.seller.dashboard',{
		url: '/dashboard',
		templateUrl: './views/pages/cs.dashboard.html',
		controller: function ($scope,$state) {
			// CHECK AUTHORIZEDROLE
			(!$scope.checkRoleMatchPath()) && ($state.go('signin'));
			$scope.config = {title: 'title',subtitle: 'subtitle',class: {editor: false,hfull: false}};
		}
	})
	.state('cs.seller.products-list',{
		url: '/products',
		templateUrl: './views/pages/cs.products.browser.html',
		controller: 'productBrowser'
	})
	.state('cs.seller.marketplace',{
		url: '/marketplace',
		templateUrl: './views/pages/cs.marketplace.list.html',
		controller: 'marketPlace'
	})
	.state('cs.seller.orders',{
		url: '/orders',
		templateUrl: '/views/pages/cs.order.list.html',
		controller: 'orderList'
	})
	.state('cs.seller.order-detail',{
		url: '/order-detail/:orderID',
		templateUrl: './views/pages/cs.order.detail.html',
		controller: 'orderDetail'
	})
	.state('cs.seller.billing',{
		url: '/billing',
		templateUrl: './views/pages/cs.billing.html',
		controller: 'billingOperation'
	})
	.state('cs.seller.info',{
		url: '/info',
		templateUrl: './views/pages/cs.info.html',
		controller: 'accountInfo'
	})	// OTHER FUNCTION PATH =================================================
	//$urlRouterProvider.otherwise('/home');
}]);