app.controller('productBrowser', function ($rootScope,$scope,$state,$http,$uibModal,$log) {
	console.log("products-browser scope running");
	// CHECK AUTHORIZEDROLE
	(!$scope.checkRoleMatchPath()) && ($state.go('signin'));
	// PAGE SETTING
	$scope.$parent.config = {title: '商品瀏覽',subtitle: '您可以在此查詢您要賣的商品！',class: {editor: false,hfull: false}};
	// INTERFACE OPERATING
	$scope.interface = {
		itemsPerPage: 40,
		totalItems: null,
		currentPage: 1,
		alerts : [],
		modalSetting: { animationsEnabled: true },
		search: {
			start: function (params) {
				if (!params) {
					var params = {
						sessionID: $rootScope.app.currentUser.sessionID,
						num: $scope.interface.itemsPerPage
					};
				};
				$http({
					method: 'GET',url: $scope.app.apiurl + 'products/browser',params: params
				}).then( function (res) {
					var data = res.data;
					// ASSIGN DATA
					$scope.products = data.rows;
					$scope.interface.totalItems = data.totalItems;
				});
			}
		},
		changePage: function () {
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID,
				pagenumber: $scope.interface.currentPage,
				num: $scope.interface.itemsPerPage
			};
			$scope.interface.search.start(options);
		},
		addPlace: function (pid) {
			var data = {
				sessionID: $rootScope.app.currentUser.sessionID,
				userID: $rootScope.app.currentUser.userID,
				productID: pid
			};
			console.log(data);
			$http({
				method: 'POST',url: $scope.app.apiurl + 'products/browser/addplace',data: data
			}).then( function (res) {
				var data = res.data;
				if ( data.status == 'success' ) {
					$scope.interface.addAlert('已新增賣場，' + data.placeUrl,'success');
				} else{
					$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
				};
			});
		},
		nowSell: function (url) {
			console.log(url);
			var modalInstance = $uibModal.open({
				animation: $scope.interface.modalSetting.animationsEnabled,
				templateUrl: './views/pages/cs.nowsell.html',
				controller: 'nowSell',
				size: '',
				resolve: {
					place: function () {
						return {qrcodeData: url};
					}
				}
			});
			modalInstance.result.then(function () {
				$log.info('Modal close at: ' + new Date());
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
			$scope.toggleAnimation = function () {
				$scope.interface.modalSetting.animationsEnabled = !$scope.interface.modalSetting.animationsEnabled;
			};
		},
		addAlert: function(msgString,msgType) {
			$scope.interface.alerts.push({msg: msgString,type: msgType});
		},
		closeAlert: function(index) {
			$scope.interface.alerts.splice(index, 1);
		}
	};
	// INPUT PRODUCT DATA
	$scope.products = [];
});