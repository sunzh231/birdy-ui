'use strict';

/* Controllers */

managerApp.controller('LoginCtrl', ['$scope','$http',
                                function LoginCtrl($scope, $http) {

	$scope.login = function(id, dataTableCallback){
		
  		$http.post('user/loginSubmit', $scope.user).success(function(data){
  			if(data && data.success){

  				location.href = '/index';

  			}else{
  				$(".flash_message").text(data.msg);
			    $(".flash_message").addClass("error");

  			    setTimeout(function() {
  			    	$(".flash_message").removeClass("error");
  			    }, 2500);
  				
  			}
  		});
  	};
}]);
