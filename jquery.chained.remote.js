/*
 * Remote Chained - jQuery AJAX(J) chained selects plugin
 *
 * Copyright (c) 2010-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  0.9.2
 *
 */

(function($) {

    $.fn.remoteChained = function(parent_selector, url, options) {

        return this.each(function() {

            /* Save this to self because this changes when scope changes. */
            var self   = this;
            var backup = $(self).clone();

            var settings = $.extend({
                posted_attribute_id: $(this).attr("id"),
                include_blank: true,
                disable_if_default: false,
                default_value: ""
            }, options||{})  ;

            /* Handles maximum two parents now. */
            $(parent_selector).each(function() {
                $(this).bind("change", function() {

                    /* Build data array from parents values. */
                    var data = {};
                    $(parent_selector).each(function() {
                        var id = settings.posted_attribute_id;
                        var value = $(":selected", this).val();
                        data[id] = value;
                    });

                    $.getJSON(url, data, function(json) {

                        /* Clear the select. */
                        $("option", self).remove();



                        /* Add new options from json. */
                        for (var index in json) {
                            if (!json.hasOwnProperty(index)) {
                                continue;
                            }

                            /* This sets the default selected.
                                                 if ("selected" == index) {
                                                 continue;
                                                 }*/

                            
                            $.each(json[index], function(key, value) {
                                var option = $("<option />").val(value).append(key);
                                $(self).append(option);
                            });





                        }

                        /* Loop option again to set selected. IE needed this... */
                        $(self).children().each(function() {
                            if ($(this).val() == settings["default_value"]) {
                                $(this).attr("selected", "selected");
                            }
                        });

                        /* If we have only the default value disable select. */
                        if (1 == $("option", self).size() && $(self).val() === "" && settings.disable_if_default == true) {
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
