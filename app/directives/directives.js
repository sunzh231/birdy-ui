'use strict';

/* Directives */
/*
 * 分页列表directive,整合了datatables控件
 */
managerApp.directive('pageTable', ['$location', function($location) {
    return {
    	restrict: 'E, A, C',
    	link: function(scope, element, attrs, controller) {
	        // apply DataTable options, use defaults if none specified by admin
	        var options = {
	                "iCookieDuration": 2419200, /* 1 month */
	                "bJQueryUI": true,
	                "bPaginate": true,
	                "sPaginationType": "full_numbers",
	                "bLengthChange": true,
	                "bFilter": true,
	                "bInfo": false,
	                'bSort': true,
	                "bDestroy": true,
	        		"oLanguage": {
	        			"sLengthMenu": "每页显示 _MENU_ 条记录",
	        			"sZeroRecords": "对不起，没有符合条件的记录！",
	        			"sSearch": "查询",
	        			"oPaginate":{
	        				"sPrevious":"上一页",
	        				"sNext": "下一页",
	        				"sFirst":"首页",
	        				"sLast":"末页"
	        			}
	        		}
	        };

	        var explicitColumns = [];
	        element.find('th').each(function(index, elem) {
	        	if($(elem).attr('field')){
	        		var colInfo = {'mData':$(elem).attr('field'),'bSortable':true};
	        		explicitColumns.push(colInfo);
	        	}else if($(elem).attr('checked')){
	        		//如果指定了checked属性，渲染为复选框，复选框的值为id
	        		explicitColumns.push({'mData':'id', 'bSortable':false,
	        			'mRender': function(data, type, full){
	        				return '<input type="checkbox" class="chk" name=ids value='+data+'>';
	        			}});
	        	}
	        });
	        
	        explicitColumns.push({'mData':'id','bSortable':false,
	        	'mRender' : function(data, type, full){
	        		return	'<a class="edit-btn" href="#' + scope.target + '/edit/'+data+'"><i class="icon-edit"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;'+
	        		'<a class="remove-btn" href="javascript:void(0);" attr=' + data + '><i class="icon-trash"></i></a>';
    	        }
    	    });
	        
	        options["aoColumns"] = explicitColumns;
	        
	       
	        // apply the plugin
	        //var dataTable = element.dataTable(options);
			var dataTable = element.DataTable(options);
	        
	        $(".remove-btn").die('click');
	        $(".remove-btn").live('click', function(){
	        	var id = $(this).attr('attr');
	        	var trNode = this.parentNode.parentNode;
	        	scope.remove(id, function(){
	        		dataTable.fnDeleteRow(trNode);
	        	});
	        });
	        
	        //获取选择的行的ID，以逗号分隔的字符串返回
	        scope.getSelected = function(){
	        	var idArr = [];
	        	$('input', dataTable.fnGetNodes()).each(function(){
	        		if(this.checked){
	        			idArr.push(this.value);
	        		}
	        	});
	        	return idArr.join(',');
	        };
	        
	        scope.refresh = function(){
	        	dataTable.fnClearTable();
        		dataTable.fnAddData(scope.$eval(attrs.aaData));
	        };
	        
	        //删除选择的多行，用于多行删除成功后
	        scope.$on('data.batchRemove', function(){
	        	$('input', dataTable.fnGetNodes()).each(function(){
	        		if(this.checked){
	        			dataTable.fnDeleteRow(this.parentNode.parentNode);
	        		}
	        	});
	        });
	        
	        $('select[name="dt_length"]').select2();
	        
	        scope.$watch(attrs.aaData, function(value){
	        	var val = value || null;
	        	if(val) {
	        		if(scope.dataPreHandler){
	        			scope.dataPreHandler();
	        		}
	        		dataTable.fnClearTable();
	        		dataTable.fnAddData(scope.$eval(attrs.aaData));
	        	}
	        });
    	}
    };
}]);
/**
 * 下拉列表美化指令，采用select2控件实现
 */
managerApp.directive('select2', function() {
    return {
    	restrict: 'E, A, C',
    	link: function() {
	        $('select').select2();
    	}
    };
});

managerApp.directive('hasPermission', function(permissions) {
	  return {
	    link: function(scope, element, attrs) {
	      if(!_.isString(attrs.hasPermission))
	        throw "hasPermission value must be a string";
	  
	      var value = attrs.hasPermission.trim();
	      var notPermissionFlag = value[0] === '!';
	      if(notPermissionFlag) {
	        value = value.slice(1).trim();
	      }
	  
	      function toggleVisibilityBasedOnPermission() {
	        var hasPermission = permissions.hasPermission(value);
	  
	        if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag)
	          element.show();
	        else
	          element.hide();
	      }
	      toggleVisibilityBasedOnPermission();
	      scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
	    }
	  };
	});


/*
 * 上传按钮
 * 主要完成整合jquery file upload控件实现相应的操作
 */
managerApp.directive('fileuploadBtn', ['$location','CrudService', '$parse', function($location, CrudService, $parse){
	return {
    	restrict: 'A',
    	link: function(scope, element, attrs) {
	        element.uniform();
	        
	        var uploadBtn = $('<button/>').text('开始上传')
	        	.attr('type', 'button')
	        	.attr('class', 'btn btn-mini');
	        
	        var removeBtn = $('<button/>').text('删除文件')
        	.attr('type', 'button')
        	.attr('class', 'btn btn-mini');
	        
	        //uniform控件将input[file]包装了一层
	        uploadBtn.appendTo($(element).parent().parent());
	        removeBtn.appendTo($(element).parent().parent());
	        var path="";
	        //删除按钮处理方法
	        $(removeBtn).click(function(){
	        	
	        	CrudService.removeFile(path);
	        });

	        //构造上传url
	        var type = attrs.ftype;
	        var url = '/fileupload/upload/';
	        if(type != null){
	        	url += type;
	        }else{
	        	url += 'img';
	        }
	       
	        //初始化fileupload控件
	        $(element).fileupload({
	        	url : url,
	        	dataType : 'json',
	        	previewMaxWidth: 100,
	            previewMaxHeight: 100,
	            previewCrop: true,
	            
	        	add : function (e, data) {
	        		uploadBtn.click(function() {
	        			uploadBtn.text("正在上传...");
	        			data.submit();
	        		});
	        	},
	        	change: function (e, data) {
	        		 $("tr:has(td)").remove();
	               /*  $.each(data.result, function (index, file) {
	                	 console.log(file);
	                    
	                 }); */
	        		/* if($('#img-preview') == undefined){
	        			 return ;
	        		 }
	        		 
	        		 $('#img-preview').empty();
	        		 data.context = $('<li class="span2"/>').appendTo('#img-preview');
	        		 */
	        		 $.each(data.files, function (index, file) {
	        			 //if()
	        			
	                    $("#uploaded-files").show();
	                    $("#uploaded-files").append(
	                             $('<tr/>')
	                             /*.append($('<td/>').html("<img src='"+file.mozFullPath+"'/>")*/
	                             .append($('<td/>').text(file.name))
	                             .append($('<td/>').text(file.size+"kB"))
	                             .append($('<td/>').text(file.type))
	                             .append($('<td/>').html("<a href='/fileupload/upload/img"+index+"'>Click</a>"))
	                             );//end $("#uploaded-files").append()
	                });
	            },
	        	done : function (e, data) {
	        		
	        		if(data._response.result.success){
		        		uploadBtn.text('已上传');
		        		if(path != undefined &&
		        				path.length > 0){
		        			path += ',';
		        		}
		        		path += data._response.result.data;
		        		
		        		setTimeout(function(){
		        			scope.$apply(function(){
		        				$parse(attrs.fileuploadBtn).assign(scope, path);
		        			});
		        		}, 50);
		        		
		        		/*path="";*/
		        		return;
	        		} else {
	        			uploadBtn.text('重新上传');
	        		}
	        	},
	        	drop: function (e, data) {
	                $.each(data.files, function (index, file) {
	                    alert('Dropped file: ' + file.name);
	                });
	            },
	        	 progressall: function (e, data) {
	                 var progress = parseInt(data.loaded / data.total * 100, 10);
	                 $('#progress .bar').css(
	                     'width',
	                     progress + '%'
	                 );
	             },
	      
	             dropZone: $('#dropzone')
	        });
    	}
    };
}]);

/*
 * ckedit文本编辑
 * */
managerApp.directive('ckeditor', function() {
	  return {
	    require : '?ngModel',
	    link : function(scope, element, attrs, ngModel) {
	      var ckeditor = CKEDITOR.replace(element[0], {
	        
	      });
	      if (!ngModel) {
	        return;
	      }
	      ckeditor.on('instanceReady', function() {
	        ckeditor.setData(ngModel.$viewValue);
	      });
	      ckeditor.on('pasteState', function() {
	        scope.$apply(function() {
	          ngModel.$setViewValue(ckeditor.getData());
	        });
	      });
	      ngModel.$render = function(value) {
	        ckeditor.setData(ngModel.$viewValue);
	      };
	    }
	  };
	});

/*
 * 菜单链接按钮，主要实现菜单点击后的样式激活操作
 * 该指令使用与<li>下的<a>标签中
 */
managerApp.directive('menuLink', function(){
	return {
		restrict: 'A',
		link : function(scope, element) {
			$(element).click(function(){
				//先删除父节点原有class为'active'的节点的class属性
				var container = $(element).parent().parent();
				
				$(container).find('.active').each(function(){
					$(this).removeClass('active');
				});
				//当前节点添加'active'class
				$(element).parent().addClass('active');
			});
		}
	};
});


/*
 * 
 * 
 */
managerApp.directive('tabLink', function(){
	return {
		restrict: 'A',
		link : function(scope, element ,attrs) {
			$(element).click(function(){
				
				var id='#'+attrs.tabLink;
				
				$(id).parent().find('.active').each(function(){
					$(this).removeClass('active');
				});
			
				$(id).addClass('active');
			});
		}
	};
});


managerApp.directive('bsPopup', function ($parse) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(function () {
                return $parse(ctrl.$modelValue)(scope);
            }, function (newValue) {
                if (newValue ==0) {
                    $(elem).modal('hide');
                    return;
                }
                if (newValue == 1) {
                    $(elem).modal('show');
                    return;
                }
            });
        }
    }
});


managerApp.directive('treeGrid', [
  '$timeout', function($timeout) {
    return {
      restrict: 'E',
      //templateUrl:'tree-grid-template.html',
      //template:"<div><table class=\"table table-bordered table-striped tree-grid\"><thead class=\"text-primary\"><tr><th>{{expandingProperty}}</th><th ng-repeat=\"col in colDefinitions\">{{col.displayName || col.field}}</th></tr></thead><tbody><tr ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\" ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\" class=\"tree-grid-row\"><td class=\"text-primary\"><a ng-click=\"user_clicks_branch(row.branch)\"><i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon\"></i></a><span class=\"indented tree-label\">{{row.branch[expandingProperty]}}</span></td><td ng-repeat=\"col in colDefinitions\">{{row.branch[col.field]}}</td></tr></tbody><table></div>",
      template:
        "<div>\
            <table class=\"table table-bordered table-striped tree-grid\">\
                <thead class=\"text-primary\">\
                <tr>\
                	<th>选择</th>\
                    <th>{{expandingProperty}}</th>\
                    <th ng-repeat=\"col in colDefinitions\">{{col.displayName || col.field}}</th>\
                </tr>\
                </thead>\
                <tbody>\
                <tr ng-repeat=\"row in tree_rows | filter:{visible:true} | filter: search track by row.branch.uid\"\
                    ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\" class=\"tree-grid-row\">\
                    <td><input type=\"checkbox\" class=\"user-checked\" value={{row.branch['id']}} utype={{row.branch['type']}}>\
                    <td class=\"text-primary\"><a ng-click=\"user_clicks_branch(row.branch)\"><i ng-class=\"row.tree_icon\"\
                               ng-click=\"row.branch.expanded = !row.branch.expanded\"\
                               class=\"indented tree-icon\"></i>\
                        </a><span class=\"indented tree-label\" ng-click=\"user_clicks_branch(row.branch)\">\
                          {{row.branch[expandingProperty]}}</span>\
                    </td>\
                    <td ng-repeat=\"col in colDefinitions\">{{row.branch[col.field]}}</td>\
                </tr>\
                </tbody>\
            </table>\
        </div>",
      replace: true,
      /*scope: {
        treeData: '=',
        colDefs:'=',
        expandOn:'=',
        onSelect: '&',
        initialSelection: '@',
        treeControl: '='
      },*/
      link: function(scope, element, attrs) {


        for_each_branch = function(f) {
          var do_f, root_branch, _i, _len, _ref, _results;
          do_f = function(branch, level) {
            var child, _i, _len, _ref, _results;
            f(branch, level);
            if (branch.children != null) {
              _ref = branch.children;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                _results.push(do_f(child, level + 1));
              }
              return _results;
            }
          };
          _ref = scope.treeData;
          _results = [];
          if(_ref != undefined || _ref != null){
        	  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  root_branch = _ref[_i];
                  _results.push(do_f(root_branch, 1));
                }  
          }
          
          return _results;
        };
        selected_branch = null;
        select_branch = function(branch) {
          if (!branch) {
            if (selected_branch != null) {
              selected_branch.selected = false;
            }
            selected_branch = null;
            return;
          }
          if (branch !== selected_branch) {
            if (selected_branch != null) {
              selected_branch.selected = false;
            }
            branch.selected = true;
            selected_branch = branch;
            expand_all_parents(branch);
            if (branch.onSelect != null) {
              return $timeout(function() {
                return branch.onSelect(branch);
              });
            } else {
              if (scope.onSelect != null) {
                return $timeout(function() {
                  return scope.onSelect({
                    branch: branch
                  });
                });
              }
            }
          }
        };
        scope.user_clicks_branch = function(branch) {
          if (branch !== selected_branch) {
            return select_branch(branch);
          }
        };
        get_parent = function(child) {
          var parent;
          parent = void 0;
          if (child.parent_uid) {
            for_each_branch(function(b) {
              if (b.uid === child.parent_uid) {
                return parent = b;
              }
            });
          }
          return parent;
        };
        for_all_ancestors = function(child, fn) {
          var parent;
          parent = get_parent(child);
          if (parent != null) {
            fn(parent);
            return for_all_ancestors(parent, fn);
          }
        };
        expand_all_parents = function(child) {
          return for_all_ancestors(child, function(b) {
            return b.expanded = true;
          });
        };

        scope.tree_rows = [];

        on_treeData_change = function() {
          var add_branch_to_list, root_branch, _i, _len, _ref, _results;
          for_each_branch(function(b, level) {
            if (!b.uid) {
              return b.uid = "" + Math.random();
            }
          });
          for_each_branch(function(b) {
            var child, _i, _len, _ref, _results;
            if (angular.isArray(b.children)) {
              _ref = b.children;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                _results.push(child.parent_uid = b.uid);
              }
              return _results;
            }
          });
          scope.tree_rows = [];
          for_each_branch(function(branch) {
            var child, f;
            if (branch.children) {
              if (branch.children.length > 0) {
                f = function(e) {
                  if (typeof e === 'string') {
                    return {
                      label: e,
                      children: []
                    };
                  } else {
                    return e;
                  }
                };
                return branch.children = (function() {
                  var _i, _len, _ref, _results;
                  _ref = branch.children;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    child = _ref[_i];
                    _results.push(f(child));
                  }
                  return _results;
                })();
              }
            } else {
              return branch.children = [];
            }
          });
          add_branch_to_list = function(level, branch, visible) {
            var child, child_visible, tree_icon, _i, _len, _ref, _results;
            if (branch.expanded == null) {
              branch.expanded = false;
            }
            if (!branch.children || branch.children.length === 0) {
              tree_icon = attrs.iconLeaf;
            } else {
              if (branch.expanded) {
                tree_icon = attrs.iconCollapse;
              } else {
                tree_icon = attrs.iconExpand;
              }
            }
            branch.level = level;
            scope.tree_rows.push({
              level: level,
              branch: branch,                
              label: branch[expandingProperty],                
              tree_icon: tree_icon,
              visible: visible
            });
            if (branch.children != null) {
              _ref = branch.children;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                child_visible = visible && branch.expanded;
                _results.push(add_branch_to_list(level + 1, child, child_visible));
              }
              return _results;
            }
          };
          _ref = scope.treeData;
          _results = [];
          if(_ref != undefined && _ref != null){
        	  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  root_branch = _ref[_i];
                  _results.push(add_branch_to_list(1, root_branch, true));
                }
          }
          
          return _results;
        };
        
        //TODO:Beging..
        var error, expandingProperty, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree;

        error = function(s) {
          console.log('ERROR:' + s);
          debugger;
          return void 0;
        };

        if (attrs.iconExpand == null) {
          attrs.iconExpand = 'icon-plus  glyphicon glyphicon-plus  fa fa-plus';
        }
        if (attrs.iconCollapse == null) {
          attrs.iconCollapse = 'icon-minus glyphicon glyphicon-minus fa fa-minus';
        }
        if (attrs.iconLeaf == null) {
          attrs.iconLeaf = 'icon-file  glyphicon glyphicon-file  fa fa-file';
        }
        if (attrs.expandLevel == null) {
          attrs.expandLevel = '3';
        }

        expand_level = parseInt(attrs.expandLevel, 10);
        //TODO: move here!!
        scope.$watch('treeData', on_treeData_change, true);
        
        if (!scope.treeData) {
          return;
        }
        if (scope.treeData.length == null) {
          if (treeData.label != null) {
            scope.treeData = [treeData];
          } else {
            alert('treeData should be an array of root branches');
            return;
          }
        }
        if(attrs.expandOn){            
          expandingProperty = scope.expandOn;
          scope.expandingProperty = scope.expandOn;
        }
        else{
          var _firstRow = scope.treeData[0], 
              _keys = Object.keys(_firstRow);
          for(var i =0, len = _keys.length; i<len; i++){
            if(typeof(_firstRow[_keys[i]])=='string'){
              expandingProperty = _keys[i];
              break;
            }
          }
          if(!expandingProperty) expandingProperty = _keys[0];
          scope.expandingProperty = expandingProperty;
        }

        if(!attrs.colDefs){
          var _col_defs = [], _firstRow = scope.treeData[0], _unwantedColumn = ['children', 'level', 'expanded', expandingProperty];
          for(var idx in _firstRow){
            if(_unwantedColumn.indexOf(idx)==-1)
              _col_defs.push({field:idx});
          }            
          scope.colDefinitions = _col_defs;
        }
        else{
          console.log(scope.colDefs);
          scope.colDefinitions = scope.colDefs;
        }
        
        if (attrs.initialSelection != null) {
          for_each_branch(function(b) {
            if (b.label === attrs.initialSelection) {
              return $timeout(function() {
                return select_branch(b);
              });
            }
          });
        }
        n = scope.treeData.length;
        for_each_branch(function(b, level) {
          b.level = level;
          return b.expanded = b.level < expand_level;
        });
        if (scope.treeControl != null) {
          if (angular.isObject(scope.treeControl)) {
            tree = scope.treeControl;
            tree.expand_all = function() {
              return for_each_branch(function(b, level) {
                return b.expanded = true;
              });
            };
            tree.collapse_all = function() {
              return for_each_branch(function(b, level) {
                return b.expanded = false;
              });
            };
            tree.get_first_branch = function() {
              n = scope.treeData.length;
              if (n > 0) {
                return scope.treeData[0];
              }
            };
            tree.select_first_branch = function() {
              var b;
              b = tree.get_first_branch();
              return tree.select_branch(b);
            };
            tree.get_selected_branch = function() {
              return selected_branch;
            };
            tree.get_parent_branch = function(b) {
              return get_parent(b);
            };
            tree.select_branch = function(b) {
              select_branch(b);
              return b;
            };
            tree.get_children = function(b) {
              return b.children;
            };
            tree.select_parent_branch = function(b) {
              var p;
              if (b == null) {
                b = tree.get_selected_branch();
              }
              if (b != null) {
                p = tree.get_parent_branch(b);
                if (p != null) {
                  tree.select_branch(p);
                  return p;
                }
              }
            };
            tree.add_branch = function(parent, new_branch) {
              if (parent != null) {
                parent.children.push(new_branch);
                parent.expanded = true;
              } else {
                scope.treeData.push(new_branch);
              }
              return new_branch;
            };
            tree.add_root_branch = function(new_branch) {
              tree.add_branch(null, new_branch);
              return new_branch;
            };
            tree.expand_branch = function(b) {
              if (b == null) {
                b = tree.get_selected_branch();
              }
              if (b != null) {
                b.expanded = true;
                return b;
              }
            };
            tree.collapse_branch = function(b) {
              if (b == null) {
                b = selected_branch;
              }
              if (b != null) {
                b.expanded = false;
                return b;
              }
            };
            tree.get_siblings = function(b) {
              var p, siblings;
              if (b == null) {
                b = selected_branch;
              }
              if (b != null) {
                p = tree.get_parent_branch(b);
                if (p) {
                  siblings = p.children;
                } else {
                  siblings = scope.treeData;
                }
                return siblings;
              }
            };
            tree.get_next_sibling = function(b) {
              var i, siblings;
              if (b == null) {
                b = selected_branch;
              }
              if (b != null) {
                siblings = tree.get_siblings(b);
                n = siblings.length;
                i = siblings.indexOf(b);
                if (i < n) {
                  return siblings[i + 1];
                }
              }
            };
            tree.get_prev_sibling = function(b) {
              var i, siblings;
              if (b == null) {
                b = selected_branch;
              }
              siblings = tree.get_siblings(b);
              n = siblings.length;
              i = siblings.indexOf(b);
              if (i > 0) {
                return siblings[i - 1];
              }
            };
            tree.select_next_sibling = function(b) {
              var next;
              if (b == null) {
                b = selected_branch;
              }
              if (b != null) {
                next = tree.get_next_sibling(b);
                if (next != null) {
                  return tree.select_branch(next);
                }
              }
            };
            tree.select_prev_sibling = function(b) {
              var prev;
              if (b == null) {
                b = selected_branch;
              }
              if (b != null) {
                prev = tree.get_prev_sibling(b);
                if (prev != null) {
                  return tree.select_branch(prev);
                }
              }
            };
            tree.get_first_child = function(b) {
              var _ref;
              if (b == null) {
                b = selected_branch;
              }
              if (b != null) {
                if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                  return b.children[0];
                }
              }
            };
            tree.get_closest_ancestor_next_sibling = function(b) {
              var next, parent;
              next = tree.get_next_sibling(b);
              if (next != null) {
                return next;
              } else {
                parent = tree.get_parent_branch(b);
                return tree.get_closest_ancestor_next_sibling(parent);
              }
            };
            tree.get_next_branch = function(b) {
              var next;
              if (b == null) {
                b = selected_branch;
              }
              if (b != null) {
                next = tree.get_first_child(b);
                if (next != null) {
                  return next;
                } else {
                  next = tree.get_closest_ancestor_next_sibling(b);
                  return next;
                }
              }
            };
            tree.select_next_branch = function(b) {
              var next;
              if (b == null) {
                b = selected_branch;
              }
              if (b != null) {
                next = tree.get_next_branch(b);
                if (next != null) {
                  tree.select_branch(next);
                  return next;
                }
              }
            };
            tree.last_descendant = function(b) {
              var last_child;
              if (b == null) {
                debugger;
              }
              n = b.children.length;
              if (n === 0) {
                return b;
              } else {
                last_child = b.children[n - 1];
                return tree.last_descendant(last_child);
              }
            };
            tree.get_prev_branch = function(b) {
              var parent, prev_sibling;
              if (b == null) {
                b = selected_branch;
              }
              if (b != null) {
                prev_sibling = tree.get_prev_sibling(b);
                if (prev_sibling != null) {
                  return tree.last_descendant(prev_sibling);
                } else {
                  parent = tree.get_parent_branch(b);
                  return parent;
                }
              }
            };
            return tree.select_prev_branch = function(b) {
              var prev;
              if (b == null) {
                b = selected_branch;
              }
              if (b != null) {
                prev = tree.get_prev_branch(b);
                if (prev != null) {
                  tree.select_branch(prev);
                  return prev;
                }
              }
            };
          }
        }
        
      }
    };
  }
]);



