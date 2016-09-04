/**
 * 自定义标签，整合angularJs与jquery DataTables插件
 */
$.fn.dataTableExt.oPagination.four_button = {
    /*
     * Function: oPagination.four_button.fnInit
     * Purpose:  Initalise dom elements required for pagination with a list of the pages
     * Returns:  -
     * Inputs:   object:oSettings - dataTables settings object
     *           node:nPaging - the DIV which contains this pagination control
     *           function:fnCallbackDraw - draw function which must be called on update
     */
    "fnInit": function ( oSettings, nPaging, fnCallbackDraw )
    {
        nFirst = document.createElement( 'a' );
        nPrevious = document.createElement( 'a' );
        nNext = document.createElement( 'a' );
        nLast = document.createElement( 'a' );
         
        nFirst.appendChild( document.createTextNode( oSettings.oLanguage.oPaginate.sFirst ) );
        nPrevious.appendChild( document.createTextNode( oSettings.oLanguage.oPaginate.sPrevious ) );
        nNext.appendChild( document.createTextNode( oSettings.oLanguage.oPaginate.sNext ) );
        nLast.appendChild( document.createTextNode( oSettings.oLanguage.oPaginate.sLast ) );
         
        nFirst.className = "first ui-corner-tl ui-corner-bl fg-button ui-button ui-state-default";
        nPrevious.className = "previous fg-button ui-button ui-state-default";
        nNext.className="next fg-button ui-button ui-state-default";
        nLast.className = "last ui-corner-tl ui-corner-br fg-button ui-button ui-state-default";
         
        nPaging.appendChild( nFirst );
        nPaging.appendChild( nPrevious );
        nPaging.appendChild( nNext );
        nPaging.appendChild( nLast );
         
        $(nFirst).click( function () {
            oSettings.oApi._fnPageChange( oSettings, "first" );
            fnCallbackDraw( oSettings );
        } );
         
        $(nPrevious).click( function() {
            oSettings.oApi._fnPageChange( oSettings, "previous" );
            fnCallbackDraw( oSettings );
        } );
         
        $(nNext).click( function() {
            oSettings.oApi._fnPageChange( oSettings, "next" );
            fnCallbackDraw( oSettings );
        } );
         
        $(nLast).click( function() {
            oSettings.oApi._fnPageChange( oSettings, "last" );
            fnCallbackDraw( oSettings );
        } );
         
        /* Disallow text selection */
        $(nFirst).bind( 'selectstart', function () { return false; } );
        $(nPrevious).bind( 'selectstart', function () { return false; } );
        $(nNext).bind( 'selectstart', function () { return false; } );
        $(nLast).bind( 'selectstart', function () { return false; } );
    },
     
    /*
     * Function: oPagination.four_button.fnUpdate
     * Purpose:  Update the list of page buttons shows
     * Returns:  -
     * Inputs:   object:oSettings - dataTables settings object
     *           function:fnCallbackDraw - draw function which must be called on update
     */
    "fnUpdate": function ( oSettings, fnCallbackDraw )
    {
        if ( !oSettings.aanFeatures.p )
        {
            return;
        }
         
        /* Loop over each instance of the pager */
        var an = oSettings.aanFeatures.p;
        for ( var i=0, iLen=an.length ; i<iLen ; i++ )
        {
            var buttons = an[i].getElementsByTagName('a');
            if ( oSettings._iDisplayStart === 0 )
            {
                //buttons[0].className = "paginate_disabled_previous";
                //buttons[1].className = "paginate_disabled_previous";
            	$(buttons[0]).addClass("ui-state-disabled");
            	$(buttons[1]).addClass("ui-state-disabled");
            }
            else
            {
                //buttons[0].className = "paginate_enabled_previous";
                //buttons[1].className = "paginate_enabled_previous";
            	$(buttons[0]).removeClass("ui-state-disabled");
            	$(buttons[1]).removeClass("ui-state-disabled");
            }
             
            if ( oSettings.fnDisplayEnd() == oSettings.fnRecordsDisplay() )
            {
                //buttons[2].className = "paginate_disabled_next";
                //buttons[3].className = "paginate_disabled_next";
            	$(buttons[2]).addClass("ui-state-disabled");
            	$(buttons[3]).addClass("ui-state-disabled");
            }
            else
            {
                //buttons[2].className = "paginate_enabled_next";
                //buttons[3].className = "paginate_enabled_next";
            	$(buttons[2]).removeClass("ui-state-disabled");
            	$(buttons[3]).removeClass("ui-state-disabled");
            }
        }
    }
};
(function(){
	"use strict";
	
	var options = {
            "iCookieDuration": 2419200, /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
            /*"bServerSide": true,*/
            "sPaginationType": "four_button",
            "bLengthChange": true,
            "bFilter": true,
            "bInfo": false,
            "bDestroy": true,
    		/*"bProcessing": true,*/
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
	var dataTable;
	managerApp.directive('pageTable', function() {
	    return {
	    	restrict: 'A',
	    	link: function(scope, element, attrs, controller) {
		        // apply DataTable options, use defaults if none specified by user
		        // Tell the dataTables plugin what columns to use
		        // We can either derive them from the dom, or use setup from the controller
		        var explicitColumns = [];
		        element.find('th').each(function(index, elem) {
		        	if($(elem).attr('field')){
		        		explicitColumns.push({'mData':$(elem).attr('field')});
		        	}else if($(elem).attr('checked')){
		        		explicitColumns.push({'mData':'id',
		        			'mRender': function(data, type, full){
		        				return '<input type="checkbox" name=ids value='+data+'>';
		        			}});
		        	}
		        });
		        explicitColumns.push({'mData':'id',
		        	'mRender' : function(){
		        		return	'<button class="btn btn-success edit-btn">编辑</button>'+
		                '<button class="btn btn-warning remove-btn">删除</button>';
	    	        }
	    	    });
		        
		        options["aoColumns"] = explicitColumns;
		        
		        options["fnRowCallback"] = function(nRow, aData, iDisplayIndex) {
		        	$('.edit-btn', nRow).click(function(){
		        		//scope.edit(aData['id']);
		        		location.href = '#edit/'+aData['id'];
		        	});
		        	$(".remove-btn", nRow).click(function(){
		        		scope.remove(aData['id']);
		        	});
		        };
		        
		        /*options["fnServerData"] = function(sSource, aoData, fnCallback){
	    			
		        	if(dataTable){
		        		dataTable.aaData = scope.members;
		        		var oSettings = dataTable.fnSettings();
		        		oSettings._iTotal = scope.total;
		        		oSettings._iTotalRecords = scope.total;
		        		oSettings._iTotalDisplayRecords = scope.total;
		        	}
		        	fnCallback();
		        };*/
		        // apply the plugin
		        dataTable = element.dataTable(options);
		        
		        scope.getSelected = function(){
		        	$('input', dataTable.fnGetNodes()).each(function(){
		        		if(this.checked){
		        			alert(this.value);
		        		}
		        	});
		        };
		        scope.removeRow = function(rowIndex){
		        	dataTable.fnDeleteRow(rowIndex);
		        };
		        $('select').select2();
		        
		        scope.getData();
		        scope.$watch(attrs.aaData, function(value){
		        	var val = value || null;
		        	if(val) {
		        		alert(scope.total);
		        		var oSettings = dataTable.fnSettings();
		        		oSettings._iTotalRecords = scope.total;
		        		oSettings._iTotalDisplayRecords = scope.total;
		        		//oSettings._iRecordsDisplay = scope.total;
		        		//oSettings.oApi._fnCallbackDraw(oSettings);
		        		//oSettings.oApi._fnPageChange(oSettings);
		        		dataTable.fnClearTable();
		        		
		        		dataTable.fnAddData(scope.$eval(attrs.aaData));
		        		//dataTable.fnUpdate();
		        		//dataTable._fnUpdateInfo();
		        	}
		        });
	    	}
	    };
	});
})();