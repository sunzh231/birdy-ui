'use strict';

/* Service */
managerApp.service('CrudService', ['$rootScope', '$http', function($rootScope, $http) {
	var service = {
		list: function(url){
			$rootScope.entities = [];
			$http.post(url).success(function(data){
				if(data){
					$rootScope.$broadcast('data.list',data);
					$rootScope.entities = data;
				} 
			});
		},
		get : function(url){
			$http.get(url).success(function(data){
				if(data && data.success){
					$rootScope.$broadcast('entity.got', data.data);
				}else{
					alert(data.data);
				}
			});
		},
		remove : function(url, callback) {
			$http.get(url).success(function(data){
	  			if(data && data.success){
	  				callback();
	  				alert('删除成功!');
	  			}
	  		});
		},
		batchRemove : function(url){
			$http.get(url).success(function(data){
	  			if(data && data.success){
	  				$rootScope.$broadcast('data.batchRemove');
	  		  		alert('批量删除成功！');
	  			}
	  		});
		},
		save : function(url, entity){
			$http.post(url, entity).success(function(data){
	  			if(data && data.success){
	  				alert("数据添加成功！");
	  				entity=null;
	  				$rootScope.$broadcast('data.saveSuccess',data);
	  			}else{
	  				alert("数据添加出错,错误原因为：" + data && data.data ? data.data : "未知");
	  			}
	  		});
		},
		update:function(url){
			$http.post(url).success(function(data){
	  			if(data && data.success){
	  				alert("数据编辑成功！");
	  				$rootScope.$broadcast('data.saveSuccess');
	  			}else{
	  				alert("数据编辑出错,错误原因为：" + data && data.data ? data.data : "未知");
	  			}
	  		});
		},
		removeFile : function(filename){
			//删除文件
			$http.post('/fileupload/remove', filename).success(function(data){
				if(data.success){
					alert('文件删除成功！');
				}else{
					if(data.msg){
						alert(data.msg);
					}else{
						alert('服务器内部错误！请稍后重试');
					}
					
				}
			});
		}
	};
	
	return service;
}]);

/* 用户管理相关service */
managerApp.service('UserService', ['$rootScope', '$http', function($rootScope, $http) {
	var service = {
		/*查询所有黄金用户和钻石用户，因为vip用户不会有子用户 */
		listParents: function(type){
			$http.post('/user/parent/' + type).success(function(data){
				if(data){
					//$rootScope.$broadcast('parent.got', data);
					$rootScope.parents = data;
				}
			});
		},
		listHierarchy : function(){
			$http.post('/user/hierarchy').success(function(data){
				$rootScope.$broadcast('treeData.got', data);
			});
		},
		checkExisted : function(userId){
			$http.post('/user/' + userId).success(function(data){
				if(data.success){
					if(data.data != null){
						alert('该用户ID已存在，请改用其他名称');
					}else{
						alert('该用户ID可以使用！');
					}
				}else{
					alert(data.data);
				}
			});
		}
	};
	
	return service;
}]);

/* 权限认证相关操作 */
managerApp.service('CheckService', ['$rootScope', '$http', function($rootScope, $http) {
	var service = {
		check: function(){
			$http.post('/authenticate').success(function(data){
				if(data){
					$rootScope.$broadcast('authenticated', data);
				}
			});
		}
	};
	
	return service;
}]);