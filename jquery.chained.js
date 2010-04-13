(function($) {

    $.fn.chained = function(parent_selector, options) { 
        
        return this.each(function() {
            
            /* Save this to self because this changes when scope changes. */            
            /* Create a backup for future use. */            
            var self = this;
            var backup = $(self).clone();
            
            /* Should use #foo for now. */
            var parent = $(parent_selector);
            
            parent.bind("change", function() {
                $(self).html($(backup).html());
                var selected = $(":selected", this).val();
                $("option", self).each(function() {
                    /* Remove unneeded items but save the default value. */
                    if (!$(this).hasClass(selected) && $(this).val() !== "") {
                        $(this).remove();
                    }                        
                });
                
                /* Force updating the children. */
                $(self).trigger("change");
            });
            
            
        });  
    };
    
})(jQuery);