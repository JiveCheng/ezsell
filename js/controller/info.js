app.controller('accountInfo', function ($rootScope,$scope,$http,$filter) {
	console.log("info scope running");
	// CHECK AUTHORIZEDROLE
	(!$scope.checkRoleMatchPath()) && ($state.go('signin'));
	// PAGE SETTING
	$scope.$parent.config = {title: '基本資料設置',subtitle: '在此您可以設置與更新您的基本資料、銀行帳號資料，以利爾後作業喔！',class: {editor: true,hfull: true}};
	// FUNCTIONS
	// INTERFACE OPERATING
	$scope.interface = {
		accountTabs: [true, false],
		accountTab: function (index) {
			var el = $scope.interface.accountTabs;
			for (var i = 0; i < el.length; i++) {el[i] = false};
			el[index] = true;
		},
		alerts: [],
		addAlert: function(msgString,msgType) {
			$scope.interface.alerts.push({msg: msgString,type: msgType});
		},
		closeAlert: function(index) {
			$scope.interface.alerts.splice(index, 1);
		},
		query: function (queryType,identity) {
			if ( !queryType ) {
				if ( $scope.currentRole.isAdmin ) {
					var queryType = 'accounts';
				} else if ( $scope.currentRole.isSupplier || $scope.currentRole.isSeller ) {
					var queryType = 'info';
					var identity = $rootScope.app.currentUser.userID;
				};
			};
			var params = {
				sessionID: $rootScope.app.currentUser.sessionID,
				queryType: queryType,
				userID: identity || null
			};
			$http({method: 'GET',url: $scope.app.apiurl + 'account/query',params: params}).then( function (res) {
				if (queryType == 'accounts') {
					$scope.accounts = res.data;
				} else {
					$scope.info = res.data;
				};
			});
		},
		update: function () {
			var data = {
				sessionID: $rootScope.app.currentUser.sessionID,
				data: $scope.info
			};
			$http({method: 'POST',url: $scope.app.apiurl +  'billing/update',data: data}).then( function (res) {
				var data = res.data;
				if (data == 'success') {
					var d = new Date();
					d = $filter('date')(d,'yyyy-MM-dd HH:mm:ss');
					$scope.interface.addAlert('資料已更新！ ' + d,'success');
				} else {
					$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
				};
			}, function (res) {
				$scope.interface.addAlert('系統錯誤，請重新登入或聯絡我們','danger');
			});
		}
	};
	$scope.dataChangeStatus = false;
	$scope.edit = [];
	$scope.info = {};
	$scope.accounts = [];
});