app.controller('productList', function ($rootScope,$scope,$state,$http,PRODUCT_STATUS_OPTION) {
	console.log("products-list scope running");
	// CHECK AUTHORIZEDROLE
	(!$scope.checkRoleMatchPath()) && ($state.go('signin'));
	// PAGE SETTING
	$scope.$parent.config = {title: '商品查詢',subtitle: '您可以在此查詢、編輯、新增、設置您的商品！',class: {editor: false,hfull: false}};
	// INTERFACE OPERATING
	$scope.interface = {
		supplierData: null,
		statusOptions: PRODUCT_STATUS_OPTION,
		itemsPerPage: 10,
		totalItems: null,
		currentPage: 1,
		selectedAll: false,
		selectedID: [],
		alerts : [],
		search: {
			supplierID: null,
			string: null,
			status: null,
			start: function (params) {
				if (!params) {
					var params = {
						sessionID: $rootScope.app.currentUser.sessionID,
						currentRole: $rootScope.app.currentUser.userRole,
						num:10
					};
				};
				$http({
					method: 'GET',url: $scope.app.apiurl + 'products',params: params
				}).then( function (res) {
					var data = res.data;
					// ASSIGN DATA
					$scope.products = data.rows;
					$scope.interface.totalItems = data.totalItems;
					(!$scope.interface.supplierData) && ($scope.interface.supplierData = data.supplierList);
					//$scope.interface.currentPage = data.currentPage;
				});
			}
		},
		searchProduct: function () {
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID,
				string: $scope.interface.search.string,
				currentRole: $rootScope.app.currentUser.userRole,
				pagenumber: 1
			};
			$scope.interface.search.supplierID = null;
			$scope.interface.search.status = null;
			$scope.interface.search.start(options);
		},
		changeCondition: function () {
			$scope.interface.search.string = "";
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID,
				supplierID: (function (){
					if (!!$scope.interface.search.supplierID) {
						return $scope.interface.search.supplierID.supplierID;
					} else {
						return null;
					};
				})(),
				status: (function () {
					if ( !!$scope.interface.search.status ) {
						return $scope.interface.search.status.status;
					} else {
						return null;
					};
				})(),
				currentRole: $rootScope.app.currentUser.userRole,
				num: $scope.interface.itemsPerPage,
				pagenumber: 1
			};
			$scope.interface.search.start(options);
			$scope.interface.currentPage = 1;
		},
		changePage: function () {
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID,
				supplierID: (function (){
					if (!!$scope.interface.search.supplierID) {
						return $scope.interface.search.supplierID.supplierID;
					} else {
						return null;
					};
				})(),
				status: (function () {
					if ( !!$scope.interface.search.status ) {
						return $scope.interface.search.status.status;
					} else {
						return null;
					};
				})(),
				currentRole: $rootScope.app.currentUser.userRole,
				num: $scope.interface.itemsPerPage,
				pagenumber: $scope.interface.currentPage
			};
			$scope.interface.search.start(options);
		},
		changeStatus: function (status) {
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID,
				ids: $scope.interface.selectedID,
				status: status
			};
			$http({
				method: 'POST',url: $scope.app.apiurl + 'products/modify',data: options
			}).then(function (res) {
				var data = res.data;
				if ( data == 'success' ) {
					angular.forEach($scope.products, function (value,key) {
						if ( options.ids.indexOf(value.productID) != -1 ) {
							$scope.products[key].status = status;
						}
					});
					$scope.interface.addAlert('商品狀態已變更！','success');
					$scope.interface.selectedID = [];
					$scope.interface.selectedAll = false;
				} else {
					$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
				};
			});
		},
		deleteProduct: function () {
			//console.log($scope.interface.selectedID);
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID,
				selectedID: $scope.interface.selectedID
			};
			$http({
				method: 'POST',url: $scope.app.apiurl + 'products/delete',data: options
			}).then(function (res) {
				var data = res.data;
				if ( data == 'success' ) {
					$scope.interface.addAlert('商品已刪除！','success');
					// RELOAD DATA
					/*
					$scope.interface.search.start({
						num: $scope.interface.itemsPerPage,
						page: $scope.interface.currentPage
					});
					*/
					$scope.interface.selectedAll = false;
				} else {
					$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
				};
			});
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
				$scope.interface.selectedID = $scope.products.map(function(item) { return item.productID; });
			}
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