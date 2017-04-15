app.controller('productEditor', function ($rootScope,$scope,$http,$filter,$stateParams,$uibModal,$log,PRODUCT_STATUS_OPTION) {
	console.log("products-editor scope running");
	// CHECK AUTHORIZEDROLE
	(!$scope.checkRoleMatchPath()) && ($state.go('signin'));
	// PAGE SETTING
	!!$stateParams.productID ? ($scope.$parent.config = {title: '編輯商品',subtitle: '維護商品'}) : ($scope.$parent.config = {title: '新增商品',subtitle: '新商品'});
	$scope.$parent.config.class = {editor: true,hfull: true};
	// FUNCTIONS
	function generateID(l) {
		var x="123456789poiuytrewqasdfghjklmnbvcxzQWERTYUIPLKJHGFDSAZXCVBNM";
		var id="";
		for( var i = 0 ; i < l ; i++ ){
			id += x.charAt(Math.ceil(Math.random()*10000000000)%x.length);
		}
		return id;
	}
	// INTERFACE OPERATING
	$scope.interface = {
		editMain: true,
		editSpecs: false,
		statusOptions: PRODUCT_STATUS_OPTION,
		specs: {
			categories: {
				all: [],
				selected: []
			},
			attributes: []
		},
		selectedSpecs: null,
		supplierData: null,
		selectedSupplier: null,
		alerts: [],
		addAlert: function(msgString,msgType) {
			$scope.interface.alerts.push({msg: msgString,type: msgType});
		},
		closeAlert: function(index) {
			$scope.interface.alerts.splice(index, 1);
		},
		changeEditMode: function (mode,specID) {
			// MODE : MAIN OR SPECS
			if ( mode == "main" ) {
				$scope.interface.editMain = true;
				$scope.interface.editSpecs = false;
				$scope.product.active = true;
			}else if ( mode == "specs" ) {
				$scope.interface.editMain = false;
				$scope.interface.editSpecs = true;
				$scope.product.active = false;
				// SHOW SELECTED SPEC TOGGLE
				$scope.interface.selectedSpecs = specID || null;
			}else{
				$scope.interface.editMain = !$scope.interface.editMain;
				$scope.interface.editSpecs = !$scope.interface.editSpecs;
			}
			// CONTROL ACTIVE
			angular.forEach($scope.product.specs, function(spec) {
				if (spec.skuID == specID) {
					spec.active = true;
				} else {
					spec.active = false;
				};				
			});
		},
		specsAvailableUpdate: function () {
			var selected = $scope.interface.specs.categories.selected;
			var queryArray = selected;
			var params = {
				sessionID: $rootScope.app.currentUser.sessionID,
				categories: queryArray
			};
			$http({
				method: 'POST',url: $scope.app.apiurl + 'specs/attrs',data: params
			}).then( function (res) {
				// ASSIGN DATA
				$scope.interface.specs.attributes = res.data;
			});
		},
		createSpecs: function () {
			var newSpec = {
				skuID: generateID(10),
				attrs: [],
				imgs: [],
				stock: null,
				safeStock: null,
				cost: null,
				refPrice: null,
				sellPrice: null,
				shareProfit: null,
				salesNum: 0,
				shelves: true,
				createrID: null,
				createDate: null,
				updateDate: null,
				updateIP: null,
				active: false
			};
			$scope.product.specs.push(newSpec);
		},
		deleteSpecs: function (id) {
			var rows = $scope.product.specs;
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].skuID == id) {rows[i].shelves = false};
			};
			$scope.interface.addAlert('單品（' + id + '）已刪除','success');
		},
		startLoad: function () {
			if ( !!$stateParams.productID ) {
				var params = {
					sessionID: $rootScope.app.currentUser.sessionID,
					pid: $stateParams.productID
				};
				$http({
					method: 'GET',url: $scope.app.apiurl + 'product',params: params
				}).then( function (res) {
					var data = res.data;
					// ASSIGN DATA
					$scope.product = data.product;
					$scope.interface.specs.categories.all = data.interface.categories;
					$scope.interface.selectedSupplier = {supplierID:data.product.supplierID,name:data.product.supplierName};
					for (var i = 0;i < $scope.product.specs.length;i++) {
						for (var x = 0;x < $scope.product.specs[i].attrs.length;x++) {
							var id = $scope.product.specs[i].attrs[x].categoryID;
							var n = $scope.product.specs[i].attrs[x].category;
							var obj = {id: id,name: n};
							if ( $scope.interface.specs.categories.selected.indexOf(obj) === -1) {
								$scope.interface.specs.categories.selected.push(obj);
							};
						}
					}
					$scope.interface.specsAvailableUpdate();
				});
			} else {
				var params = {
					sessionID: $rootScope.app.currentUser.sessionID,
					currentRole: $rootScope.app.currentUser.userRole,
					reqRole: 'supplier'
				};
				$http({
					method: 'GET',url: $scope.app.apiurl + 'product',params: params
				}).then( function (res) {
					var data = res.data;
					// ASSIGN DATA
					$scope.product = data.product;
					(!$scope.interface.supplierData) && ($scope.interface.supplierData = data.supplierList);
					$scope.interface.specs.categories.all = data.interface.categories;
					for (var i = 0;i < $scope.product.specs.length;i++) {
						for (var x = 0;x < $scope.product.specs[i].attrs.length;x++) {
							var id = $scope.product.specs[i].attrs[x].categoryID;
							var n = $scope.product.specs[i].attrs[x].category;
							var obj = {id: id,name: n};
							if ( $scope.interface.specs.categories.selected.indexOf(obj) === -1) {
								$scope.interface.specs.categories.selected.push(obj);
							};
						}
					}
				});
			};
		},
		imgRemove: function (index) {
			angular.forEach($scope.product.specs, function(spec) {
				if (spec.active) {
					spec.imgs.splice(index,1);
				}
			});
		},
		editorDone: function () {
			var checkpass = true;
			// CHECK FIELD START
			var target = $scope.product;
			if ( !$scope.interface.selectedSupplier ) {
				$scope.interface.addAlert('請選擇商品所屬供應商！','danger');
			} else if ( !target.mainName ) {
				$scope.interface.addAlert('請輸入商品主標！','danger');
			} else if ( !target.description ) {
				$scope.interface.addAlert('請輸入商品詳情介紹！','danger');
			} else if ( !target.specs || target.specs.length == 0 ) {
				$scope.interface.addAlert('請新增商品規格！','danger');
			} else if ( target.specs.length != 0 ) {
				var rows = target.specs;
				var rowsCheckStatus = [];
				for (var x = 0; x < rows.length; x++) {
					var rowCheckStatus = false;
					if ( rows[x].shelves ) {
						if ( !rows[x].attrs || rows[x].attrs.length == 0 ) {
							$scope.interface.addAlert('請選擇SKU編號：' + rows[x].skuID + '的規格！','danger');
						} else if ( !rows[x].cost ) {
							$scope.interface.addAlert('請選擇SKU編號：' + rows[x].skuID + '的成本！','danger');
						} else if ( !rows[x].imgs || rows[x].imgs.length == 0 ) {
							$scope.interface.addAlert('請上傳SKU編號：' + rows[x].skuID + '的圖片！','danger');
						} else if ( !rows[x].refPrice ) {
							$scope.interface.addAlert('請上傳SKU編號：' + rows[x].skuID + '的原價！','danger');
						} else if ( !rows[x].sellPrice ) {
							$scope.interface.addAlert('請輸入SKU編號：' + rows[x].skuID + '的銷售價！','danger');
						} else if ( !rows[x].stock ) {
							$scope.interface.addAlert('請輸入SKU編號：' + rows[x].skuID + '的庫存！','danger');
						} else {
							rowCheckStatus = true;
							rowsCheckStatus.push(rowCheckStatus);
						}
					}
				}
				if ( rowsCheckStatus.indexOf(false) == -1 && rowsCheckStatus.length > 0) {
					console.log("run update");
					if ( $scope.currentRole.isAdmin ) {
						$scope.product.supplierID = $scope.interface.selectedSupplier.supplierID;
						$scope.product.supplierName = $scope.interface.selectedSupplier.name;
					};
					var data = {
						sessionID: $rootScope.app.currentUser.sessionID,
						userID:  $rootScope.app.currentUser.userID,
						data: $scope.product
					};
					$http({method: 'POST',url: $scope.app.apiurl + 'product/editor',data: data}).then( function (res) {
						if ( res.data == 'success' ) {
							var d = new Date();
							d = $filter('date')(d,'yyyy-MM-dd HH:mm:ss');
							$scope.interface.addAlert('商品已更新 ' + d,'success');
						} else {
							$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
						}
					});
				}
			}
		},
		modal: function (size) {
			var modalInstance = $uibModal.open({
				animation: $scope.interface.modalSetting.animationsEnabled,
				templateUrl: '/views/pages/cs.upload.html',
				controller: 'uploadImages',
				size: size,
				resolve:{}
			});
			modalInstance.result.then(function (uploadItems) {
				angular.forEach($scope.product.specs, function(spec) {
					if (spec.active) {
						spec.imgs = spec.imgs.concat(uploadItems);
					}
				});
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
			$scope.toggleAnimation = function () {
				$scope.interface.modalSetting.animationsEnabled = !$scope.interface.modalSetting.animationsEnabled;
			};
		},
		modalSetting: {
			animationsEnabled: true,
		}
	};
	$scope.interface.stateParams = $stateParams.productID || null;
	// DATA INPUT
	$scope.product = {};
});