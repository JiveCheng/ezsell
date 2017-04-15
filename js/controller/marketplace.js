app.controller('marketPlace', function ($rootScope,$scope,$state,$http,$uibModal,$log,PLACE_TYPE_OPTION,PLACE_STATUS_OPTION) {
	console.log("marketplace scope running");
	// CHECK AUTHORIZEDROLE
	(!$scope.checkRoleMatchPath()) && ($state.go('signin'));
	// PAGE SETTING
	$scope.$parent.config = {title: '賣場查詢',subtitle: '您可以在此查詢、編輯、新增、設置您的賣場！',class: {editor: false,hfull: false}};
	// INTERFACE OPERATING
	$scope.interface = {
		sellerData: null,
		typeOptions: PLACE_TYPE_OPTION,
		statusOptions: PLACE_STATUS_OPTION,
		itemsPerPage: 10,
		totalItems: null,
		currentPage: 1,
		selectedAll: false,
		selectedID: [],
		alerts : [],
		modalSetting: { animationsEnabled: true },
		search: {
			sellerID: null,
			string: null,
			status: null,
			type:null,
			start: function (params) {
				if (!params) {
					params = {
						sessionID: $rootScope.app.currentUser.sessionID,
						currentRole: $rootScope.app.currentUser.userRole,
						num:10
					};
				};
				$http({
					method: 'GET',url: $scope.app.apiurl +  'marketplace',params: params
				}).then( function (res) {
					var data = res.data;
					// ASSIGN DATA
					$scope.places = data.rows;
					$scope.interface.totalItems = data.totalItems;
					(!$scope.interface.sellerData) && ($scope.interface.sellerData = data.sellerList);
					if	($rootScope.app.currentUser.userRole == "seller") {
						$scope.interface.search.sellerID = $scope.interface.sellerData[0];
					}
				});
			}
		},
		searchPlace: function () {
			$scope.interface.search.sellerID = null;
			$scope.interface.search.status = null;
			$scope.interface.search.type = null;
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID,
				num: $scope.interface.itemsPerPage,
				string: $scope.interface.search.string,
				currentRole: $rootScope.app.currentUser.userRole,
				pagenumber: 1
			};
			$scope.interface.search.start(options);
		},
		changeCondition: function () {
			$scope.interface.search.string = "";
			var sellerID = function () {
				if (!!$scope.interface.search.sellerID) {
					return $scope.interface.search.sellerID.sellerID;
				} else if ($rootScope.app.currentUser.userRole == "seller") {
					return $scope.interface.sellerData[0].sellerID;
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
			var type = function () {
				if (!!$scope.interface.search.type) {
					return $scope.interface.search.type.type;
				} else {
					return null;
				}
			};
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID || null,
				sellerID: sellerID(),
				status: status(),
				type: type(),
				num: $scope.interface.itemsPerPage,
				pagenumber: 1
			};
			$scope.interface.search.start(options);
			$scope.interface.currentPage = 1;
		},
		changePage: function () {
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
			var type = function () {
				if (!!$scope.interface.search.type) {
					return $scope.interface.search.type.type;
				} else {
					return null;
				}
			};
			var options = {
				sessionID: $rootScope.app.currentUser.sessionID || null,
				sellerID: sellerID(),
				status: status(),
				type: type(),
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
				method: 'POST',url: $scope.app.apiurl +  'marketplace/update',data: options
			}).then(function (res) {
				var data = res.data;
				if ( data == 'success' ) {
					angular.forEach($scope.places, function (value,key) {
						if ( options.ids.indexOf(value.productID) != -1 ) {
							$scope.places[key].status = status;
						}
					});
					$scope.interface.addAlert('賣場狀態已變更！','success');
					$scope.interface.selectedID = [];
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
				$scope.interface.selectedID = $scope.places.map(function(item) { return item.placeID; });
			}
		},
		addAlert: function(msgString,msgType) {
			$scope.interface.alerts.push({msg: msgString,type: msgType});
		},
		closeAlert: function(index) {
			$scope.interface.alerts.splice(index, 1);
		},
		nowSellModal: function (size,index) {
			var modalInstance = $uibModal.open({
				animation: $scope.interface.modalSetting.animationsEnabled,
				templateUrl: '/views/pages/cs.nowsell.html',
				controller: 'nowSell',
				size: size,
				resolve: {
					place: function () {
						return $scope.places[index];
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
		editorModal: function (size,index) {
			var modalInstance = $uibModal.open({
				animation: $scope.interface.modalSetting.animationsEnabled,
				templateUrl: '/views/pages/cs.place.simple.editor.html',
				controller: 'placeEditor',
				size: size,
				resolve: {
					place: function () {
						return $scope.places[index];
					}
				}
			});
			modalInstance.result.then(function (res) {
				$scope.places[index] = res;
				$log.info('Modal close at: ' + new Date());
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		},
		createShortenURL: function (longString,index,pid) {
			$http({
				method: 'POST',
				data: {"longUrl": longString},
				url: 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAg3wHIuZKKlGoz2zYKNL8YClHnvnV62wk'
			}).then( function (res) {
				var shorturl = res.data.id;
				$scope.places[index].placeShortenUrl = shorturl;
				$scope.places[index].qrcodeData = shorturl;
				$scope.interface.storeShortenURL(shorturl,pid);
			});
		},
		storeShortenURL: function (googlurl,placeID) {
			var data = {
				sessionID: $rootScope.app.currentUser.sessionID,
				placeID: placeID,
				url: googlurl
			};
			$http({
				method: 'POST',data: data,url: $scope.app.apiurl +  'marketplace/add/shortenurl'
			}).then( function (res) {
				console.log(res.data);
			});
		},
		qrDownload: function (string,index,name) {
			var qr = qrcode(2,'M');
			qr.addData(string);
			qr.make();
			var qrString;
			qrString = qr.createImgTag(30,0).split(" ")[1].substr(4);
			qrString = qrString.substr(1);
			qrString = qrString.substr(0,qrString.length - 1);
			download( qrString , name + ".gif","image/gif");
		}
	};
	// INPUT PRODUCT DATA
	$scope.places = [];
});