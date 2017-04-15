app.controller('nowSell', function ($scope,$modalInstance,place) {
	$scope.place = place;
	$scope.ok = function () {
		$modalInstance.close($scope.place);
	};
	$scope.cancel = function () {
    	$modalInstance.dismiss('cancel');
	};
});