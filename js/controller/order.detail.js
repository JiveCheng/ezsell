app.controller('orderDetail', function ($rootScope,$scope,$http,$stateParams,$timeout,ORDER_STATUS_OPTION) {
	console.log("orders scope running");
	// CHECK AUTHORIZEDROLE
	(!$scope.checkRoleMatchPath()) && ($state.go('signin'));
	// PAGE SETTING
	$scope.$parent.config = {title: '訂單明細',subtitle: '列出該筆訂單的所有資訊',class: {editor: false,hfull: false}};
	// INTERFACE OPERATING
	$scope.interface = {
		orderStatusData: ORDER_STATUS_OPTION,
		search: {
			start: function () {
				if ( !!$stateParams.orderID ) {
					var params = {
						sessionID: $rootScope.app.currentUser.sessionID,
						oid: $stateParams.orderID
					};
					$http({
						method: 'GET',url: $scope.app.apiurl + 'order',params: params
					}).then( function (res) {
						var data = res.data;
						// ASSIGN DATA
						$scope.order = data.order;
						$scope.order.productsTotal = $scope.interface.sumTotal();
					});
				} else {
					console.log('error');
				}
			}
		},
		sumTotal: function () {
			var total = 0;
			for (var i = 0;i < $scope.order.products.length;i++) {
				var product = $scope.order.products[i];
				total += (product.sellPrice * product.quantity);
			}
			return total;
		},
		orderUpdate: function () {
			var data = {
				sessionID: $rootScope.app.currentUser.sessionID,
				oid: $stateParams.orderID,
				orderInternalNotice: $scope.order.summary.orderInternalNotice,
				shipTrackingNumber: $scope.order.summary.shipTrackingNumber
			};
			$http({
				method: 'POST',url: $scope.app.apiurl + 'order/update',data: data
			}).then( function (res) {
				var data = res.data;
				var clearUpdateMsg = function () {
					$scope.interface.orderUpdateTrigger = false;
				};
				if (data == 'success') {
					$scope.interface.orderUpdateMsg = '已更新！';
					$scope.interface.orderUpdateTrigger = true;
					$timeout(clearUpdateMsg, 2000);
				} else {
					$scope.interface.orderUpdateMsg = '系統錯誤！';
					$scope.interface.orderUpdateTrigger = true;
					$timeout(clearUpdateMsg, 2000);
				};
			});
		},
		orderUpdateMsg: null,
		orderUpdateTrigger: false
	};
	// INPUT ORDERS DATA
	$scope.order = {};
});