app.controller('placeEditor', function ($scope,$http,$modalInstance,place,PLACE_TYPE_OPTION) {
	$scope.place = place;
	$scope.typeOptions = PLACE_TYPE_OPTION;
	$scope.ok = function () {
		$http({
			method: 'POST',data: $scope.place, url: $scope.app.apiurl + 'marketplace/update'
		}).then( function (res) {
			console.log(res.data);
			$modalInstance.close($scope.place);
		});
	};
	$scope.cancel = function () {
    	$modalInstance.dismiss('cancel');
	};
});