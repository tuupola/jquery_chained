(function($) {

    $.fn.chained = function(parent_selector, options) { 
        
        return this.each(function() {
            
            /* Save this to self because this changes when scope changes. */            
            var self   = this;
            var backup = $(self).clone();
            
            /* Handles maximum two parents now. */
            $(parent_selector).each(function() {
                $(this).bind("change", function() {
                    $(self).html($(backup).html());
                    
                    /* If multiple parents build classname like foo\bar. */
                    var selected = "";         
                    $(parent_selector).each(function() {
                        selected += "\\" + $(":selected", this).val();
                    });
                    selected = selected.substr(1);
                
                    $("option", self).each(function() {
                        /* Remove unneeded items but save the default value. */
                        if (!$(this).hasClass(selected) && $(this).val() !== "") {
                            $(this).remove();
                        }                        
                    });
                
                    /* If we have only the default value disable select. */
                    if (1 == $("option", self).size()) {
                        $(self).attr("disabled", "disabled");
                    } else {
                        $(self).removeAttr("disabled");
                    }
                
                    /* Force updating the children. */
                    $(self).trigger("change");
                });
            });
                        
        });  
    };
    
    /* Alias for those who like to use more English like syntax. */
    $.fn.chainedTo = $.fn.chained;
    
})(jQuery);