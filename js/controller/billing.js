app.controller('billingOperation', function ($rootScope,$scope,$http,$filter,BILLING_STATUS_OPTION) {
	console.log("billing scope running");
	// CHECK AUTHORIZEDROLE
	(!$scope.checkRoleMatchPath()) && ($state.go('signin'));
	// PAGE SETTING
	$scope.$parent.config = {title: '帳務管理',subtitle: '查看你每期的帳務',class: {editor: true,hfull: true}};
	// FUNCTIONS
	function showMonthFirstDay () {
		var Nowdate = new Date();
		var MonthFirstDay = new Date(Nowdate.getFullYear(),Nowdate.getMonth(),1);
		return MonthFirstDay;
	};
	function showMonthLastDay () {
		var Nowdate=new Date();
		var MonthNextFirstDay = new Date(Nowdate.getFullYear(),Nowdate.getMonth()+1,1);
		var MonthLastDay = new Date(MonthNextFirstDay - (24*60*60*1000));
		return MonthLastDay;
	};
	function showRemittancesDay () {
		var Nowdate=new Date();
		var MonthNextFirstDay = new Date(Nowdate.getFullYear(),Nowdate.getMonth()+1,1);
		var d = new Date(MonthNextFirstDay - (24*60*60*1000) + (10*24*60*60*1000));
		return d;
	};
	function showReqInoviceDay () {
		var Nowdate=new Date();
		var MonthNextFirstDay = new Date(Nowdate.getFullYear(),Nowdate.getMonth()+1,1);
		var d = new Date(MonthNextFirstDay - (24*60*60*1000) + (5*24*60*60*1000));
		return d;
	};
	// INTERFACE OPERATING
	$scope.interface = {
		billingEditor: {
			opened: true,
			data: {
				userID: null,
				username: null,
				bankAccountNumber: null,
				dateStart: showMonthFirstDay(),
				dateEnd: showMonthLastDay(),
				dateRemittances: showRemittancesDay(),
				dateReqInovice: showReqInoviceDay(),
				rows: null
			},
			datePicker: {
				minDate: new Date(2015, 1, 1),
				maxDate: new Date(2020, 5, 22),
				dateOptions: {
					formatYear: 'yyyy',
					startingDay: 0,
					showWeeks: false
				},
				status: {
					dateStartOpened: false,
					dateEndOpened: false,
					dateRemittancesOpened: false,
					dateReqInoviceOpened: false
				},
				open: function ($event,target) {
					$scope.interface.billingEditor.datePicker.status[target] = true;
				}
			},
			totalRevenue: function () {
				var sum = 0;
				var sumTarget = $scope.interface.billingEditor.data.rows;
				if (!!sumTarget) {
					for(var i = 0;i < sumTarget.length;i++){
						var num = sumTarget[i].revenue;
						sum += num;
					}
					return sum;
				} else {
					return sum;
				}
			},
			totalbilling: function () {
				var sum = 0;
				if (!!$scope.interface.billingEditor.data.rows) {
					var rows = $scope.interface.billingEditor.data.rows;
					for(var i = 0;i < rows.length;i++){
						var num = rows[i].profit;
						sum += num;
					}
					return sum;
				} else {
					return sum;
				}
			},
			done: function () {
				console.log("done");
				var data = {
					sessionID: $rootScope.app.currentUser.sessionID,
					data: $scope.interface.billingEditor.data
				};
				$http({method: 'POST',url: $scope.app.apiurl + 'billing/send',data: data}).then( function (res) {
					var data = res.data;
					if (data.status == 'success') {
						var d = new Date();
						d = $filter('date')(d,'yyyy-MM-dd HH:mm:ss');
						$scope.interface.addAlert('已出帳！ ' + d,'success','alerts2');
						// INIT BILLINGEDITOR DATA
						$scope.interface.billingEditor.data.rows = null;
						// ADD NEW DATA TO BILLINGLIST
						$scope.billingList.rows.unshift(data.row);
					} else {
						$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger','alerts2');
					};
				});
			}
		},
		billingStatus: BILLING_STATUS_OPTION,
		billingPanelWrapShow: false,
		billingPanelShow: false,
		billingUpdate: function (status) {
			var data = {
				sessionID: $rootScope.app.currentUser.sessionID,
				updateStatus: status,
				id: $scope.billing.billingID
			};
			$http({method: 'POST',url: $scope.app.apiurl + 'billing/update',data: data}).then( function (res) {
				var data = res.data
				if ( data == 'success' ) {
					if (status == '3') {
						$scope.interface.addAlert('狀態已更新，帳務已結款！','success');
						$scope.billing.billingStatus = status;
					} else if(status == '0'){
						var rows = $scope.billingList.rows;
						for (var i = 0; i < rows.length; i++) {
							if(rows[i].billingID == $scope.billing.billingID) {
								var index = i;
							};
						};
						console.log(index);
						$scope.interface.addAlert('狀態已更新，帳務已刪除！','success');
						rows.splice(index, 1);
						$scope.interface.billingPanelShow = false;
					};
				} else {
					$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
				};
			});
		},
		eidtorBillingStart: function () {
			$scope.interface.billingPanelWrapShow = true;
			$scope.interface.billingEditor.opened = true;
			// CONTROL LIST ACITVE CLASS
			for (var i = 0; i < $scope.billingList.rows.length; i++) {
				$scope.billingList.rows[i].active = false;
			};
		},
		editorBillingQuery: function () {
			var ds = $filter('date')($scope.interface.billingEditor.data.dateStart, 'yyyy-MM-dd');
			var de = $filter('date')($scope.interface.billingEditor.data.dateEnd, 'yyyy-MM-dd');
			var params = {
				sessionID: $rootScope.app.currentUser.sessionID,
				userID: $scope.interface.billingEditor.data.userID,
				currentRole: $rootScope.app.currentUser.userRole,
				dateStart: ds,
				dateEnd: de
			};
			$http({method: 'GET',url: $scope.app.apiurl + 'billing/query',params: params}).then(function (res) {
				if (res.data != 'error') {
					// DATA ASSIGN
					$scope.interface.billingEditor.data.rows = res.data.rows;
				} else {
					$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger','alerts2');
				};
			});
		},
		query: function (queryType,identity) {
			if ( !queryType ) {
				if ( $scope.currentRole.isAdmin ) {
					var queryType = 'accounts';
				} else if ( $scope.currentRole.isSupplier || $scope.currentRole.isSeller ) {
					var queryType = 'billingList';
					var identity = $rootScope.app.currentUser.userID;
				};
			};
			var params = {
				sessionID: $rootScope.app.currentUser.sessionID,
				queryType: queryType,
				id: identity || null,
				currentRole: $rootScope.app.currentUser.userRole
			};
			// CONTROL LIST ACITVE CLASS
			switch(queryType) {
				case 'accounts':
					var rows = null;
					break;
				case 'billingList':
					var rows = $scope.accounts;
					var idName = 'id';
					break;
				case 'billing':
					var rows = $scope.billingList.rows;
					var idName = 'billingID';
					break;
				default:
					var rows = null;
			};
			if (!!rows) {
				for (var i = 0; i < rows.length; i++) {
					if(rows[i][idName] == identity) {
						rows[i].active = true;
					} else {
						rows[i].active = false;
					};
				};
			};
			$http({method: 'GET',url: $scope.app.apiurl + 'billing',params: params}).then( function (res) {
				switch(queryType) {
					case 'accounts':
						$scope.accounts = res.data;
						break;
					case 'billingList':
						// DATA ASSIGN
						$scope.billingList = res.data;
						$scope.interface.billingEditor.data.userID = $scope.billingList.userID;
						$scope.interface.billingEditor.data.username = $scope.billingList.username;
						$scope.interface.billingEditor.data.bankAccountNumber = $scope.billingList.bankAccountNumber;
						break;
					case 'billing':
						// DATA ASSIGN
						$scope.billing = res.data;
						// INTERFACE CONTORL
						$scope.interface.billingPanelWrapShow = true;
						$scope.interface.billingPanelShow = true;
						$scope.interface.billingEditor.opened = false;
						break;
				};
			}, function (res) {
				console.log(res);
			});
		},
		alerts: [],
		alerts2: [],
		addAlert: function(msgString,msgType,target) {
			if (!target) {var target = 'alerts'};
			$scope.interface[target].push({msg: msgString,type: msgType});
		},
		closeAlert: function(index,target) {
			if (!target) {var target = 'alerts'};
			$scope.interface[target].splice(index, 1);
		},
		accountTabs: [true, false],
		accountTab: function (index) {
			var el = $scope.interface.accountTabs;
			for (var i = 0; i < el.length; i++) {
				el[i] = false;
			};
			el[index] = true;
		},
		totalbilling: function () {
			var sum = 0;
			if (!!$scope.billing) {
				if ( $scope.billing.billingRole == 'supplier' ) {
					var rows = $scope.billing.rows;
					for(var i = 0;i < rows.length;i++){
						var num = rows[i].profit;
						sum += num;
					}
				} else if ( $scope.billing.billingRole == 'seller' ) {
					var rows = $scope.billing.rows;
					for(var i = 0;i < rows.length;i++){
						var num = rows[i].sellercost;
						sum += num;
					}
				};
				return sum;
			} else {
				return sum;
			}
		}
	};
	$scope.accounts = [];
	$scope.billingList = null;
	$scope.billing = null;
});