/*
 * Remote Chained - jQuery AJAX(J) chained selects plugin
 *
 * Copyright (c) 2010-2011 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 */

(function($) {

    $.fn.remoteChained = function(parent_selector, url, options) { 
        
        return this.each(function() {
            
            /* Save this to self because this changes when scope changes. */            
            var self   = this;
            var backup = $(self).clone();
                        
            /* Handles maximum two parents now. */
            $(parent_selector).each(function() {
                $(this).bind("change", function() {

                    /* Build data array from parents values. */
                    var data = {};
                    $(parent_selector).each(function() {
                        var id = $(this).attr("id");
                        var value = $(":selected", this).val();
                        data[id] = value;
                    });
                    
                    $.getJSON(url, data, function(json) {

                        /* Clear the select. */
                        $("option", self).remove();

                        // json may already be an array (which preserves the ordering of options)

                        var option_list = [];
                        if ($.isArray(json)) {
                            option_list = json;
                        } else {
                            for (var key in json) {
                                if (json.hasOwnProperty(key)) {
                                    option_list.push([key, json[key]]);
                                }
                            }
                        }

                        /* Add new options from json. */
                        var selected_key = null;
                        var options_len = option_list.length;
                        for (var i=0; i<options_len; i+=1) {
                            /* This sets the default selected. */
                            key = option_list[i][0];
                            if ("selected" === key) {
                                selected_key = key;
                                continue;
                            }
                            var option = $("<option />").val(key).append(option_list[i][1]);
                            $(self).append(option);    
                        }
                        
                        /* Loop option again to set selected. IE needed this... */ 
                        $(self).children().each(function() {
                            if ($(this).val() === selected_key) {
                                $(this).attr("selected", "selected");
                            }
                        });

                        /* If we have only the default value disable select. */
                        if (1 == $("option", self).size() && $(self).val() === "") {
                            $(self).attr("disabled", "disabled");
                        } else {
                            $(self).removeAttr("disabled");
                        }
                        
                        /* Force updating the children. */
                        $(self).trigger("change");
                        
                    });
                });

                /* Force updating the children. */
                $(this).trigger("change");             

            });
        });
    };
    
    /* Alias for those who like to use more English like syntax. */
    $.fn.remoteChainedTo = $.fn.remoteChained;
    
})(jQuery);
