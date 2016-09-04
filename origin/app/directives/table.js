 
$(document).ready(function() {
    /* Add a click handler to the rows - this could be used as a callback */
    $("#dt tbody tr").click( function( e ) {
        if ( $(this).hasClass('row_selected') ) {
            $(this).removeClass('row_selected');
        }
        else {
            $(this).addClass('row_selected');
        }
    });
     
} );
 
