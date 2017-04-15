app.controller('orderList', function ($rootScope,$scope,$http,ORDER_STATUS_OPTION) {
	console.log("orders scope running");
	// CHECK AUTHORIZEDROLE
	(!$scope.checkRoleMatchPath()) && ($state.go('signin'));
	// PAGE SETTING
	$scope.$parent.config = {title: '訂單管理',subtitle: '開始管理您的訂單！',class: {editor: false,hfull: false}};
	// INTERFACE OPERATING
	$scope.interface = {
		supplierData: null,
		sellerData: null,
		orderStatusData: ORDER_STATUS_OPTION,
		itemsPerPage: 10,
		totalItems: null,
		currentPage: 1,
		selectedAll: false,
		selectedID: [],
		alerts: [],
		datePicker: {
			minDate: null,
			maxDate: new Date(2020, 5, 22),
			dateOptions: {
				formatYear: 'yy',
				startingDay: 1
			},
			status: {
				opened: false
			},
			dt: new Date(),
			today: function () {
				$scope.interface.datePicker.dt = new Date();
			},
			clear: function () {
				$scope.interface.datePicker.dt = null;
			},
			open: function ($event) {
				$scope.interface.datePicker.status.opened = true;
			},
			toggleMin: function () {
				$scope.interface.datePicker.minDate = $scope.interface.datePicker.minDate ? null : new Date();
			},
			disabled: function (date, mode) {
				return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
			},
			setDate: function (year, month, day) {
				$scope.interface.datePicker.dt = new Date(year, month, day);
			}
		},
		search: {
			supplierID: null,
			sellerID: null,
			status: null,
			string: null,
			start: function (params) {
				if (!params) {
					var params = {
						sessionID: $rootScope.app.currentUser.sessionID,
						currentRole: $rootScope.app.currentUser.userRole,
						num: 10
					};
				};
				$http({
					method: 'GET',
					url: $scope.app.apiurl + 'orders',
					params: params
				}).then(function (res) {
					var data = res.data
					// ASSIGN DATA
					$scope.orders = data.rows;
					(!$scope.interface.supplierData) && ($scope.interface.supplierData = data.supplierList);
					(!$scope.interface.sellerData) && ($scope.interface.sellerData = data.sellerList);
					$scope.interface.totalItems = data.totalItems;
				});
			}
		},
		searchPlace: function () {
			$scope.interface.search.supplierID = null;
			$scope.interface.search.sellerID = null;
			$scope.interface.search.status = null;
			$scope.interface.search.type = null;
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID,
				currentRole: $rootScope.app.currentUser.userRole,
				num: $scope.interface.itemsPerPage,
				string: $scope.interface.search.string,
				pagenumber: 1
			};
			$scope.interface.search.start(options);
		},
		changeCondition: function () {
			$scope.interface.search.string = "";
			var supplierID = function () {
				if (!!$scope.interface.search.supplierID) {
					return $scope.interface.search.supplierID.supplierID;
				} else {
					return null;
				}
			};
			var sellerID = function () {
				if (!!$scope.interface.search.sellerID) {
					return $scope.interface.search.sellerID.sellerID;
				} else {
					return null;
				}
			};
			var status = function () {
				if (!!$scope.interface.search.status) {
					return $scope.interface.search.status.status;
				} else {
					return null;
				}
			};
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID || null,
				supplierID: supplierID(),
				sellerID: sellerID(),
				status: status(),
				currentRole: $rootScope.app.currentUser.userRole,
				num: $scope.interface.itemsPerPage,
				pagenumber: 1
			};
			$scope.interface.search.start(options);
			$scope.interface.currentPage = 1;
		},
		changePage: function () {
			var supplierID = function () {
				if (!!$scope.interface.search.supplierID) {
					return $scope.interface.search.supplierID.supplierID;
				} else {
					return null;
				}
			};
			var sellerID = function () {
				if (!!$scope.interface.search.sellerID) {
					return $scope.interface.search.sellerID.sellerID;
				} else {
					return null;
				}
			};
			var status = function () {
				if (!!$scope.interface.search.status) {
					return $scope.interface.search.status.status;
				} else {
					return null;
				}
			};
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID || null,
				supplierID: supplierID(),
				sellerID: sellerID(),
				status: status(),
				currentRole: $rootScope.app.currentUser.userRole,
				num: $scope.interface.itemsPerPage,
				pagenumber: $scope.interface.currentPage
			};
			$scope.interface.search.start(options);
		},
		unSelected: function () {
			if ($scope.interface.selectedID.length == 0){
				return true;
			}else{
				return false;
			}
		},
		checkAll: function () {
			if ($scope.interface.selectedAll == true) {
				$scope.interface.selectedAll = false;
				$scope.interface.selectedID = [];
			}else{
				$scope.interface.selectedAll = true;
				$scope.interface.selectedID = $scope.orders.map(function(item) { return item.orderID; });
			}
		},
		addAlert: function(msgString,msgType) {
			$scope.interface.alerts.push({msg: msgString,type: msgType});
		},
		closeAlert: function(index) {
			$scope.interface.alerts.splice(index, 1);
		},
		shipOrder: function() {
			var selectedID = [];
			var flitered = [];
			var arraypos = null;
			for (var i = 0; i < $scope.orders.length; i++) {
				selectedID = $scope.interface.selectedID;
				arraypos = selectedID.indexOf($scope.orders[i].orderID);
				if ( (selectedID.indexOf($scope.orders[i].orderID) != -1) && ($scope.orders[i].status == 1) ) {
					flitered.push(selectedID[arraypos]);
				}
			}
			$scope.interface.selectedID = flitered;
			if ( flitered.length != 0 ) {
				var data = {
					sessionID: $rootScope.app.currentUser.sessionID,
					ids: flitered
				};
				$http({	method: 'POST',	url: $scope.app.apiurl + 'order/ship', data: data}).then(function (res) {
					var data = res.data
					if ( data == 'success' ) {
						$scope.interface.addAlert('訂單已出貨','success');
						for (var z = 0;z < $scope.orders.length;z++) {
							flitered.indexOf($scope.orders[z].orderID) != -1 && ($scope.orders[z].status = 2);
						};
					} else {
						$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
					}
				});
			} else {
				$scope.interface.addAlert('沒有可出貨的訂單！','danger');
			};
		},
		doneOrder: function () {
			var selectedID = [];
			var flitered = [];
			var arraypos = null;
			for (var i = 0; i < $scope.orders.length; i++) {
				selectedID = $scope.interface.selectedID;
				arraypos = selectedID.indexOf($scope.orders[i].orderID);
				if ( (selectedID.indexOf($scope.orders[i].orderID) != -1) && $scope.orders[i].status == 2 ) {
					flitered.push(selectedID[arraypos]);
				}
			}
			$scope.interface.selectedID = flitered;
			if ( flitered.length != 0 ) {
				var data = {
					sessionID: $rootScope.app.currentUser.sessionID,
					ids: flitered
				};
				$http({	method: 'POST',	url: $scope.app.apiurl + 'order/done', data: data}).then(function (res) {
					var data = res.data
					if ( data == 'success' ) {
						$scope.interface.addAlert('訂單已完成','success');
						for (var i = 0;i < $scope.orders.length;i++) {
							flitered.indexOf($scope.orders[i].orderID) != -1 && ($scope.orders[i].status = 3);
						};
					} else {
						$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
					}
				});
			} else {
				$scope.interface.addAlert('沒有可完成的訂單。','danger');
			};
		},
		cancelOrder: function() {
			var selectedID = [];
			var flitered = [];
			var arraypos = null;
			for (var i = 0; i < $scope.orders.length; i++) {
				selectedID = $scope.interface.selectedID;
				arraypos = selectedID.indexOf($scope.orders[i].orderID);
				if ( (selectedID.indexOf($scope.orders[i].orderID) != -1) && $scope.orders[i].status <= 1) {
					flitered.push(selectedID[arraypos]);
				}
			}
			$scope.interface.selectedID = flitered;
			if ( flitered.length != 0 ) {
				var data = {
					sessionID: $rootScope.app.currentUser.sessionID,
					ids: flitered
				};
				$http({	method: 'POST',	url: $scope.app.apiurl + 'order/cancel', data: data}).then(function (res) {
					var data = res.data
					if ( data == 'success' ) {
						$scope.interface.addAlert('訂單已取消','success');
						for (var i = 0;i < $scope.orders.length;i++) {
							flitered.indexOf($scope.orders[i].orderID) != -1 && ($scope.orders[i].status = 4);
						};
					} else {
						$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
					}
				});
			} else {
				$scope.interface.addAlert('沒有可取消的訂單，只有尚未出貨之商品可以取消訂單，已出貨訂單請走退貨流程','danger');
			};
		},
		returnOrder: function() {
			var selectedID = [];
			var flitered = [];
			var arraypos = null;
			for (var i = 0; i < $scope.orders.length; i++) {
				selectedID = $scope.interface.selectedID;
				arraypos = selectedID.indexOf($scope.orders[i].orderID);
				if ( (selectedID.indexOf($scope.orders[i].orderID) != -1) && $scope.orders[i].status > 1 && $scope.orders[i].status < 4 ) {
					flitered.push(selectedID[arraypos]);
				}
			}
			$scope.interface.selectedID = flitered;
			if ( flitered.length != 0 ) {
				var data = {
					sessionID: $rootScope.app.currentUser.sessionID,
					ids: flitered
				};
				$http({	method: 'POST',	url: $scope.app.apiurl + 'order/return', data: data}).then(function (res) {
					var data = res.data
					if ( data == 'success' ) {
						$scope.interface.addAlert('訂單已退貨','success');
						for (var i = 0;i < $scope.orders.length;i++) {
							flitered.indexOf($scope.orders[i].orderID) != -1 && ($scope.orders[i].status = 5);
						};
					} else {
						$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
					}
				});
			} else {
				$scope.interface.addAlert('沒有可退貨的訂單。','danger');
			};
		},
		returnOrderDone: function () {
			var selectedID = [];
			var flitered = [];
			var arraypos = null;
			for (var i = 0; i < $scope.orders.length; i++) {
				selectedID = $scope.interface.selectedID;
				arraypos = selectedID.indexOf($scope.orders[i].orderID);
				if ( (selectedID.indexOf($scope.orders[i].orderID) != -1) && $scope.orders[i].status == 5 ) {
					flitered.push(selectedID[arraypos]);
				}
			}
			$scope.interface.selectedID = flitered;
			if ( flitered.length != 0 ) {
				var data = {
					sessionID: $rootScope.app.currentUser.sessionID,
					ids: flitered
				};
				$http({	method: 'POST',	url: $scope.app.apiurl + 'order/returnDone', data: data}).then(function (res) {
					var data = res.data
					if ( data == 'success' ) {
						$scope.interface.addAlert('訂單退貨已完成','success');
						for (var i = 0;i < $scope.orders.length;i++) {
							flitered.indexOf($scope.orders[i].orderID) != -1 && ($scope.orders[i].status = 6);
						};
					} else {
						$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
					}
				});
			} else {
				$scope.interface.addAlert('沒有可完成退貨的訂單。','danger');
			};
		}
	};
	// INPUT ORDERS DATA
	$scope.orders = {};
});