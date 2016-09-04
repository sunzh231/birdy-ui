'use strict';

/* BaseControllers */
/*
 * 列表页面通用Controller，如果有特殊需求重新写一个即可
 * 	其中的方法可以重用
 */
managerApp.controller('ListCtrl', ['$scope', '$routeParams',
                                 '$location', 'CrudService',
                function ListCtrl($scope, $routeParams, 
                		$location, CrudService) {
	initDataList($scope, $routeParams, CrudService);
	
	removeHandler($scope, CrudService);
	
	addAndBatchRemoveBtnHandler($scope, $routeParams, $location, CrudService);
 }]);

/*
 *	录入和修改页面通用控制页面
 *	主要功能包括：
 *	(1)如果为修改操作，根据参数中传入的id获取对象的内容，并显示在页面
 *	(2)添加保存方法
 *	(3)保存完成处理方法，默认为返回列表页面 
 */
managerApp.controller('DetailCtrl', ['$scope', '$routeParams', '$location', 'CrudService',
                function DetailCtrl($scope, $routeParams, $location, CrudService) {
	
	initDetailPage($scope, $routeParams, CrudService);
	
	saveHandler($scope, $routeParams, CrudService);
	
	backToListAfterSaved($scope, $routeParams, $location, CrudService);
 }]);



/*
 * 管理页面列表初始化，根据url的target参数获取不同实体的列表
 */
function initDataList($scope, $routeParams,CrudService) {
 	$scope.target = $routeParams.target;
 	CrudService.list($scope.target + '/list');
 }

/*
 * 行内删除按钮处理方法，与pageTable标签配合使用
 */
function removeHandler($scope, CrudService){
	$scope.remove = function(id, dataTableCallback){
   		if(confirm('确定要删除该行数据？')){
   			var removeUrl = $scope.target + '/remove/' + id;
   	   		CrudService.remove(removeUrl, dataTableCallback);
   		}
   	};
}
/*
 * 列表页面通常有的新增和批量删除按钮处理方法
 * 	之前采用标签的方式，有点滥用
 */
function addAndBatchRemoveBtnHandler($scope, $routeParams, 
		$location, CrudService){
	$scope.addBtnClick = function(){
		$location.path($routeParams.target + '/add');
	};
	$scope.batchRemoveBtnClick = function(){
		var ids = $scope.getSelected();
    	if(ids){
    		var url = $routeParams.target + '/multi-remove/'+ids;
    		CrudService.batchRemove(url);
    	}else{
    		alert("请至少选择一行数据");
    	}
	};
}

/*
 * detail页面初始化页面
 * 主要做了如下工作：（1）根据url是否传输id参数判断是否为更新操作或者添加操作
 * （2）如果为更新操作，根据id获取相应的实体对象
 * （3）定义了$scope.$on消息处理方法，
 * 		在CrudService的get方法中，当成功获取到实体对象时发送该消息
 * 		这种方式可以避免经常出现的进入实体修改页面时内容都为空的情况
 */
function initDetailPage($scope, $routeParams, CrudService){
	if($routeParams && $routeParams.id){
		var getUrl = $routeParams.target + '/' + $routeParams.id;
   	  	CrudService.get(getUrl);
   		
   		$scope.update = true;
   		
   		$scope.$on('entity.got', function(event, data){
   			$scope.entity = data;
   		});
   	}else{
   		$scope.entity={};
   		$scope.update = false;
   	}
}
/*
 * 保存处理方法，包括两个功能：
 * （1）构造保存或更新Url，并调用CrudService提交数据进行保存
 * （2）增加了保存成功的消息处理方法，用于保存成功后的页面返回处理
 */
function saveHandler($scope, $routeParams, CrudService){
	$scope.saveData = function() {
		var target = $routeParams.target;
   		var saveUrl = target + '/add';
   		
   		if($scope.update){
   			saveUrl = target + '/update';
   		}

   		CrudService.save(saveUrl, $scope.entity);
   	};
}
/*
 * 保存成功后的处理方法
 * 本方法主要接收保存成功的消息，并返回到列表页面
 */
function backToListAfterSaved($scope, $routeParams, $location,  CrudService){
   	$scope.$on('data.saveSuccess', function(event){
   		$location.path($routeParams.target + '/list');
   	});
}

 /*
  * 权限认证
  */
 function authenticate($scope, $routeParams, CheckService){
 	CheckService.check();
 	
 	$scope.$on('authenticated', function(event, data){
 		if(data.success){
 			if(data.data.type == 0){
				$scope.btnAdmin = 0;
				$scope.btnUser = 0;
				$scope.btnProduct = 0;
				$scope.btnStore = 0;
				$scope.btnArticle = 0;
				$scope.btnOrder = 0;
			}else if(data.data.type == 1){
				$scope.btnAdmin = 1;
				$scope.btnUser = 0;
				$scope.btnProduct = 1;
				$scope.btnStore = 1;
				$scope.btnArticle = 1;
				$scope.btnOrder = 1;
				location.href = '/index#/user/list';
			}else if(data.data.type == 2){
				$scope.btnAdmin = 1;
				$scope.btnUser = 1;
				$scope.btnProduct = 0;
				$scope.btnStore = 1;
				$scope.btnArticle = 1;
				$scope.btnOrder = 1;
				location.href = '/index#/product/list';
			}else if(data.data.type == 3){
				$scope.btnAdmin = 1;
				$scope.btnUser = 1;
				$scope.btnProduct = 1;
				$scope.btnStore = 0;
				$scope.btnArticle = 1;
				$scope.btnOrder = 1;
				location.href = '/index#/store/list';
			}else if(data.data.type == 4){
				$scope.btnAdmin = 1;
				$scope.btnUser = 1;
				$scope.btnProduct = 1;
				$scope.btnStore = 1;
				$scope.btnArticle = 0;
				$scope.btnOrder = 1;
				location.href = '/index#/article/list';
			}else{
				$scope.btnAdmin = 1;
				$scope.btnUser = 1;
				$scope.btnProduct = 1;
				$scope.btnStore = 1;
				$scope.btnArticle = 1;
				$scope.btnOrder = 0;
				location.href = '/index#/order/list';
			}
			
		}else{
			location.href = '/login';
		}
 		
 	});
 }