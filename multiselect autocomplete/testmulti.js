$(function () {
    // Apply the plugin 
    $('#animals').on("optionselected", function(e) {
        
        console.log(e.detail);
        
    });
    $('#animals').on("optiondeselected", function(e) {
        
    });
    $('#animals').filterMultiSelect();

  });

