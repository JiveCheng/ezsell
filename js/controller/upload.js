app.controller('uploadImages', function ($rootScope,$scope,$modalInstance) {
	$scope.imgs = [];
	$scope.uploadSuccess = function (msg) {
		$scope.imgs.push(msg);
	};
	$scope.ok = function () {
		$modalInstance.close($scope.imgs);
	};
	$scope.cancel = function () {
    	$modalInstance.dismiss('cancel');
	};
});