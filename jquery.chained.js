/*
 * Chained - jQuery / Zepto chained selects plugin
 *
 * Copyright (c) 2010-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/chained
 *
 * Version: 0.9.9
 *
 */

;(function($, window, document, undefined) {
    "use strict";

    $.fn.chained = function(parent_selector, options) {

        return this.each(
            function( index, element ) {

                /* Save this to child because this changes when scope changes. */
                var child   = element;
                var backup = $(child).clone();

                /* Handles maximum two parents now. */
                $(parent_selector).each( function( index, element ) {
                    $(element).bind("change", function() {
                        updateChildren();
                    });

                    /* Force IE to see something selected on first page load, */
                    /* unless something is already selected */
                    if (!$("option:selected", element).length) {
                        $("option", element).first().attr("selected", "selected");
                    }

                    /* Force updating the children. */
                    updateChildren();
                } );

                function updateChildren() {
                    var trigger_change = true;
                    var currently_selected_value = $("option:selected", child).val();

                    $(child).html(backup.html());

                    /* If multiple parents build classname like foo\bar. */
                    var selected = "";
                    $(parent_selector).each(function() {
                        var selectedClass = $("option:selected", this).val();
                        if (selectedClass) {
                            if (selected.length > 0) {
                                if (window.Zepto) {
                                    /* Zepto class regexp dies with classes like foo\bar. */
                                    selected += "\\\\";
                                } else {
                                    selected += "\\";
                                }
                            }
                            selected += selectedClass;
                        }
                    });

                    /* Also check for first parent without subclassing. */
                    /* TODO: This should be dynamic and check for each parent */
                    /*       without subclassing. */
                    var first;
                    if ($.isArray(parent_selector)) {
                        first = $(parent_selector[0]).first();
                    } else {
                        first = $(parent_selector).first();
                    }
                    var selected_first = $("option:selected", first).val();

                    $("option", child).each( function( index, element ) {
                        var hasprop = false;
                        var isselfirst = false;
                        var e = $(element);
                        if ( e.attr('data-chained') ) {
                            var d = e.data( 'chained' );
                            if ( d == selected ) {
                                hasprop = true;
                            }
                            if ( d == selected_first ) {
                                isselfirst = true;
                            }
                        } else {
                            if ( $(element).hasClass( selected ) ) {
                                hasprop = true;
                            }
                            if ( e.hasClass(selected_first) ) {
                                isselfirst = true;
                            }
                        }
                        /* Remove unneeded items but save the default value. */
                        if ( hasprop && e.val() === currently_selected_value) {
                            e.prop("selected", true);
                            trigger_change = false;
                        } else if (!hasprop && !isselfirst && e.val() !== "") {
                            e.remove();
                        }
                    } );

                    /* If we have only the default value disable select. */
                    if (1 === $("option", child).size() && $(child).val() === "") {
                        $(child).attr("disabled", "disabled");
                    } else {
                        $(child).removeAttr("disabled");
                    }
                    if (trigger_change) {
                        $(child).trigger("change");
                    }
                }
            }
        );
    };

    /* Alias for those who like to use more English like syntax. */
    $.fn.chainedTo = $.fn.chained;

    /* Default settings for plugin. */
    $.fn.chained.defaults = {};

})(window.jQuery || window.Zepto, window, document);