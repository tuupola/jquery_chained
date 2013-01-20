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
    $.fn.remoteChained = function(parent_selector, url, options){
		var default_options = {
			invalid_data : ['', '0', '--'],
			query_key : 'chained_query_key',
			query_lambda : false,
			json_converter : false,
			response_received : 'chained_remote_response_received',	//false
			response_processed : 'chained_remote_response_processed'	//false
		};
		options = $.extend(default_options, options);
        return this.each(function() {
			/*	Save this to self because this changes when scope changes. */
            var self   = this;
            var backup = $(self).clone();
            var id;
            /* Handles maximum two parents now. */
            $(parent_selector).each(function() {
                $(this).bind("change", function() {
                    /* Build data array from parents values. */
                    var data = {}, value = $(":selected", this).val();
					if( $.inArray(value, options.invalid_data ) !== -1 ){ return; }
                    $(parent_selector).each(function() {
						if( options.query_lambda ){ data = options.query_lambda( $(this) ); }
						else{
							if( options.query_key){ id = $(this).attr(options.query_key); }
							if( ! id ){ id = $(this).attr("id"); }
                        	data[id] = value;
						}
                    });
					if( $(parent_selector).attr('multiple') ){ return; }
					$.getJSON(url, data, function(json) {
						if( options.response_received){
							$('body').trigger(options.response_received, [url, data, json]);
						}
						/* Clear the select. */
						$("option", self).remove();
						/* Add new options from json. */
						if( options.json_converter ){ json = options.json_converter(json, $(self) ); }
						else{
							for (var key in json) {
								if (!json.hasOwnProperty(key)) { continue; }
								/* This sets the default selected. */
								if ("selected" == key) { continue; }
								var option = $("<option />").val(key).append(json[key]);
								$(self).append(option);
							}
						}
						/* Loop option again to set selected. IE needed this... */
						$(self).children().each(function() {
							if ($(this).val() == json["selected"]) {
							$(this).attr("selected", "selected");
							}
						});
						/* If we have only the default value disable select. */
						if (1 == $("option", self).size() && $(self).val() === "") { $(self).attr("disabled", "disabled"); }
						else { $(self).removeAttr("disabled"); }
						/* Force updating the children. */
						$(self).trigger("change");
						if( options.response_processed ){
							$('body').trigger(options.response_processed, [id, json]);
						}
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
