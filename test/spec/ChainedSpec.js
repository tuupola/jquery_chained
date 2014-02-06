/* jshint -W108 */
/* global describe, beforeEach, setFixtures, it, expect */

describe("Class based version of plugin", function() {
    "use strict";

    describe("having single set of selects", function() {

        beforeEach(function() {
            setFixtures('<select id="mark" name="mark">' +
            '  <option value="">--</option>' +
            '  <option value="bmw">BMW</option>' +
            '  <option value="audi">Audi</option>' +
            '</select>' +
            '<select id="series" name="series">' +
            '  <option value="">--</option>' +
            '  <option value="series-1" class="bmw">1 series</option>' +
            '  <option value="series-3" class="bmw">3 series</option>' +
            '  <option value="series-5" class="bmw">5 series</option>' +
            '  <option value="series-6" class="bmw">6 series</option>' +
            '  <option value="series-7" class="bmw">7 series</option>' +
            '  <option value="a1" class="audi">A1</option>' +
            '  <option value="a3" class="audi">A3</option>' +
            '  <option value="s3" class="audi">S3</option>' +
            '  <option value="a4" class="audi">A4</option>' +
            '  <option value="s4" class="audi">S4</option>' +
            '  <option value="a5" class="audi">A5</option>' +
            '  <option value="s5" class="audi">S5</option>' +
            '  <option value="a6" class="audi">A6</option>' +
            '  <option value="s6" class="audi" selected="selected">S6</option>' +
            '  <option value="rs6" class="audi">RS6</option>' +
            '  <option value="a8" class="audi">A8</option>' +
            '</select>' +
            '<select id="model" name="model">' +
            '  <option value="">--</option>' +
            '  <option value="3-doors"       class="series-1">3 doors</option>' +
            '  <option value="5-doors"       class="series-1">5 doors</option>' +
            '  <option value="coupe"         class="series-1 series-3 series-6 a5 s5">Coupe</option>' +
            '  <option value="cabrio"        class="series-1 series-3 series-6">Cabrio</option>' +
            '  <option value="touring"       class="series-3 series-5">Touring</option>' +
            '  <option value="gran-tourismo" class="series-5">Gran Tourismo</option>' +
            '  <option value="sedan"         class="series-3 series-5 series-7 a1 a3 s3 a4 s4 a6 s6 rs6">Sedan</option>' +
            '  <option value="sportback"     class="a3 s3 a5 s5">Sportback</option>' +
            '  <option value="cabriolet"     class="a3 a5 s5">Cabriolet</option>' +
            '  <option value="avant"         class="a4 s4 a6 s6 rs6">Avant</option>' +
            '  <option value="allroad"       class="a4 a6">Allroad</option>' +
            '</select>' +
            '<select id="engine" name="engine">' +
            '  <option value="">--</option>   ' +
            '  <option value="25-petrol" class="series-3 a3 a4">2.5 petrol</option>' +
            '  <option value="30-petrol" class="series-3 series-5 series-6 a3 a4 a5">3.0 petrol</option>' +
            '  <option value="30-diesel" class="series-3\\sedan series-5\\sedan a5">3.0 diesel</option>' +
            '</select>');

            $("#series").chained("#mark");
            $("#model").chained("#series");
            $("#engine").chained("#series, #model");
        });

        it("should be chainable as jQuery plugin", function() {
            var select = $("#mark").chained("#foo").addClass("bar");
            expect(select.hasClass("bar")).toBe(true);
        });

        it("should make initial update", function() {
            expect($("#mark > option").size()).toBe(3);
            expect($("#series > option").size()).toBe(1);
            expect($("#series")).toBeDisabled();
            expect($("#model > option").size()).toBe(1);
            expect($("#model")).toBeDisabled();
        });

        it("should update series when mark changes", function() {
            $("#mark").val("audi").trigger("change");
            expect($("#mark > option").size()).toBe(3);
            expect($("#series > option").size()).toBe(12);
            expect($("#model > option").size()).toBe(3);

            $("#mark").val("bmw").trigger("change");
            expect($("#mark > option").size()).toBe(3);
            expect($("#series > option").size()).toBe(6);
            expect($("#model > option").size()).toBe(1);
        });

        it("should update model when series changes", function() {
            $("#mark").val("bmw").trigger("change");
            $("#series").val("series-3").trigger("change");
            expect($("#mark > option").size()).toBe(3);
            expect($("#series > option").size()).toBe(6);
            expect($("#model > option").size()).toBe(5);
        });

        it("should reset series and model when mark changes", function() {
            $("#mark").val("audi").trigger("change");
            $("#series").val("a6").trigger("change");

            $("#mark").val("bmw").trigger("change");
            expect($("#mark > option").size()).toBe(3);
            expect($("#series > option").size()).toBe(6);
            expect($("#model > option").size()).toBe(1);
        });

        it("should disable input if only default value exists", function() {
            $("#mark").val("audi").trigger("change");
            $("#series").val("a6").trigger("change");

            $("#mark").val("bmw").trigger("change");
            expect($("#model > option:first").val()).toBe("");
            expect($("#model").val()).toBe("");
            expect($("#model")).toBeDisabled();
        });

        it("should be chained to two parents", function() {
            $("#mark").val("bmw").trigger("change");
            $("#series").val("series-3").trigger("change");
            $("#model").val("coupe").trigger("change");

            expect($("#engine > option").size()).toBe(3);
            expect($("#engine > option:last").val()).toBe("30-petrol");

            $("#model").val("sedan").trigger("change");

            expect($("#engine > option").size()).toBe(4);
            expect($("#engine > option:last").val()).toBe("30-diesel");

            $("#series").val("series-6").trigger("change");
            $("#model").val("coupe").trigger("change");
            expect($("#engine > option").size()).toBe(2);
        });

        it("should honour selected attribute in html", function() {
            $("#mark").val("audi").trigger("change");
            expect($("#series > option:selected").val()).toBe("s6");
        });

    });

    describe("having multiple set of selects", function() {

        beforeEach(function() {
            setFixtures('<select id="mark" class="mark" name="mark">' +
            '  <option value="">--</option>' +
            '  <option value="bmw">BMW</option>' +
            '  <option value="audi">Audi</option>' +
            '</select>' +
            '<select id="series" name="series" class="series">' +
            '  <option value="">--</option>' +
            '  <option value="series-1" class="bmw">1 series</option>' +
            '  <option value="series-3" class="bmw">3 series</option>' +
            '  <option value="series-5" class="bmw">5 series</option>' +
            '  <option value="series-6" class="bmw">6 series</option>' +
            '  <option value="series-7" class="bmw">7 series</option>' +
            '  <option value="a1" class="audi">A1</option>' +
            '  <option value="a3" class="audi">A3</option>' +
            '  <option value="s3" class="audi">S3</option>' +
            '  <option value="a4" class="audi">A4</option>' +
            '  <option value="s4" class="audi">S4</option>' +
            '  <option value="a5" class="audi">A5</option>' +
            '  <option value="s5" class="audi">S5</option>' +
            '  <option value="a6" class="audi">A6</option>' +
            '  <option value="s6" class="audi" selected="selected">S6</option>' +
            '  <option value="rs6" class="audi">RS6</option>' +
            '  <option value="a8" class="audi">A8</option>' +
            '</select>' +
            '<select id="model" class="model" name="model">' +
            '  <option value="">--</option>' +
            '  <option value="3-doors"       class="series-1">3 doors</option>' +
            '  <option value="5-doors"       class="series-1">5 doors</option>' +
            '  <option value="coupe"         class="series-1 series-3 series-6 a5 s5">Coupe</option>' +
            '  <option value="cabrio"        class="series-1 series-3 series-6">Cabrio</option>' +
            '  <option value="touring"       class="series-3 series-5">Touring</option>' +
            '  <option value="gran-tourismo" class="series-5">Gran Tourismo</option>' +
            '  <option value="sedan"         class="series-3 series-5 series-7 a1 a3 s3 a4 s4 a6 s6 rs6">Sedan</option>' +
            '  <option value="sportback"     class="a3 s3 a5 s5">Sportback</option>' +
            '  <option value="cabriolet"     class="a3 a5 s5">Cabriolet</option>' +
            '  <option value="avant"         class="a4 s4 a6 s6 rs6">Avant</option>' +
            '  <option value="allroad"       class="a4 a6">Allroad</option>' +
            '</select>' +
            '<select id="engine" class="engine" name="engine">' +
            '  <option value="">--</option>   ' +
            '  <option value="25-petrol" class="series-3 a3 a4">2.5 petrol</option>' +
            '  <option value="30-petrol" class="series-3 series-5 series-6 a3 a4 a5">3.0 petrol</option>' +
            '  <option value="30-diesel" class="series-3\\sedan series-5\\sedan a5">3.0 diesel</option>' +
            '</select>' +
            '<select id="mark-2" class="mark" name="mark">' +
            '  <option value="">--</option>' +
            '  <option value="bmw">BMW</option>' +
            '  <option value="audi">Audi</option>' +
            '</select>' +
            '<select id="series-2" class="series" name="series">' +
            '  <option value="">--</option>' +
            '  <option value="series-1" class="bmw">1 series</option>' +
            '  <option value="series-3" class="bmw">3 series</option>' +
            '  <option value="series-5" class="bmw">5 series</option>' +
            '  <option value="series-6" class="bmw">6 series</option>' +
            '  <option value="series-7" class="bmw">7 series</option>' +
            '  <option value="a1" class="audi">A1</option>' +
            '  <option value="a3" class="audi">A3</option>' +
            '  <option value="s3" class="audi">S3</option>' +
            '  <option value="a4" class="audi">A4</option>' +
            '  <option value="s4" class="audi">S4</option>' +
            '  <option value="a5" class="audi">A5</option>' +
            '  <option value="s5" class="audi">S5</option>' +
            '  <option value="a6" class="audi">A6</option>' +
            '  <option value="s6" class="audi" selected="selected">S6</option>' +
            '  <option value="rs6" class="audi">RS6</option>' +
            '  <option value="a8" class="audi">A8</option>' +
            '</select>' +
            '<select id="model-2" class="model" name="model">' +
            '  <option value="">--</option>' +
            '  <option value="3-doors"       class="series-1">3 doors</option>' +
            '  <option value="5-doors"       class="series-1">5 doors</option>' +
            '  <option value="coupe"         class="series-1 series-3 series-6 a5 s5">Coupe</option>' +
            '  <option value="cabrio"        class="series-1 series-3 series-6">Cabrio</option>' +
            '  <option value="touring"       class="series-3 series-5">Touring</option>' +
            '  <option value="gran-tourismo" class="series-5">Gran Tourismo</option>' +
            '  <option value="sedan"         class="series-3 series-5 series-7 a1 a3 s3 a4 s4 a6 s6 rs6">Sedan</option>' +
            '  <option value="sportback"     class="a3 s3 a5 s5">Sportback</option>' +
            '  <option value="cabriolet"     class="a3 a5 s5">Cabriolet</option>' +
            '  <option value="avant"         class="a4 s4 a6 s6 rs6">Avant</option>' +
            '  <option value="allroad"       class="a4 a6">Allroad</option>' +
            '</select>' +
            '<select id="engine-2" class="engine" name="engine">' +
            '  <option value="">--</option>   ' +
            '  <option value="25-petrol" class="series-3 a3 a4">2.5 petrol</option>' +
            '  <option value="30-petrol" class="series-3 series-5 series-6 a3 a4 a5">3.0 petrol</option>' +
            '  <option value="30-diesel" class="series-3\\sedan series-5\\sedan a5">3.0 diesel</option>' +
            '</select>' +
            '<select id="mark-3" class="mark" name="mark">' +
            '  <option value="">--</option>' +
            '  <option value="bmw">BMW</option>' +
            '  <option value="audi">Audi</option>' +
            '</select>' +
            '<select id="series-3" class="series" name="series">' +
            '  <option value="">--</option>' +
            '  <option value="series-1" class="bmw">1 series</option>' +
            '  <option value="series-3" class="bmw">3 series</option>' +
            '  <option value="series-5" class="bmw">5 series</option>' +
            '  <option value="series-6" class="bmw">6 series</option>' +
            '  <option value="series-7" class="bmw">7 series</option>' +
            '  <option value="a1" class="audi">A1</option>' +
            '  <option value="a3" class="audi">A3</option>' +
            '  <option value="s3" class="audi">S3</option>' +
            '  <option value="a4" class="audi">A4</option>' +
            '  <option value="s4" class="audi">S4</option>' +
            '  <option value="a5" class="audi">A5</option>' +
            '  <option value="s5" class="audi">S5</option>' +
            '  <option value="a6" class="audi">A6</option>' +
            '  <option value="s6" class="audi" selected="selected">S6</option>' +
            '  <option value="rs6" class="audi">RS6</option>' +
            '  <option value="a8" class="audi">A8</option>' +
            '</select>' +
            '<select id="model-3" class="model" name="model">' +
            '  <option value="">--</option>' +
            '  <option value="3-doors"       class="series-1">3 doors</option>' +
            '  <option value="5-doors"       class="series-1">5 doors</option>' +
            '  <option value="coupe"         class="series-1 series-3 series-6 a5 s5">Coupe</option>' +
            '  <option value="cabrio"        class="series-1 series-3 series-6">Cabrio</option>' +
            '  <option value="touring"       class="series-3 series-5">Touring</option>' +
            '  <option value="gran-tourismo" class="series-5">Gran Tourismo</option>' +
            '  <option value="sedan"         class="series-3 series-5 series-7 a1 a3 s3 a4 s4 a6 s6 rs6">Sedan</option>' +
            '  <option value="sportback"     class="a3 s3 a5 s5">Sportback</option>' +
            '  <option value="cabriolet"     class="a3 a5 s5">Cabriolet</option>' +
            '  <option value="avant"         class="a4 s4 a6 s6 rs6">Avant</option>' +
            '  <option value="allroad"       class="a4 a6">Allroad</option>' +
            '</select>' +
            '<select id="engine-3" class="engine" name="engine">' +
            '  <option value="">--</option>   ' +
            '  <option value="25-petrol" class="series-3 a3 a4">2.5 petrol</option>' +
            '  <option value="30-petrol" class="series-3 series-5 series-6 a3 a4 a5">3.0 petrol</option>' +
            '  <option value="30-diesel" class="series-3\\sedan series-5\\sedan a5">3.0 diesel</option>' +
            '</select>');

            $(".series").each(function() {
                $(this).chained($(".mark", $(this).parent()));
            });
            $(".model").each(function() {
                $(this).chained($(".series", $(this).parent()));
            });
            $(".engine").each(function() {
                $(this).chained([
                    $(".series", $(this).parent()),
                    $(".model", $(this).parent())
                ]);
            });

        });

        it("should be chainable as jQuery plugin", function() {
            var select = $("#mark").chained("#foo").addClass("bar");
            expect(select.hasClass("bar")).toBe(true);
        });

        it("should make initial update", function() {
            expect($("#mark > option").size()).toBe(3);
            expect($("#series > option").size()).toBe(1);
            expect($("#series")).toBeDisabled();
            expect($("#model > option").size()).toBe(1);
            expect($("#model")).toBeDisabled();
        });

        it("should update series when mark changes", function() {
            $("#mark").val("audi").trigger("change");
            expect($("#mark > option").size()).toBe(3);
            expect($("#series > option").size()).toBe(12);
            expect($("#model > option").size()).toBe(3);

            $("#mark").val("bmw").trigger("change");
            expect($("#mark > option").size()).toBe(3);
            expect($("#series > option").size()).toBe(6);
            expect($("#model > option").size()).toBe(1);
        });

        it("should update model when series changes", function() {
            $("#mark").val("bmw").trigger("change");
            $("#series").val("series-3").trigger("change");
            expect($("#mark > option").size()).toBe(3);
            expect($("#series > option").size()).toBe(6);
            expect($("#model > option").size()).toBe(5);
        });

        it("should reset series and model when mark changes", function() {
            $("#mark").val("audi").trigger("change");
            $("#series").val("a6").trigger("change");

            $("#mark").val("bmw").trigger("change");
            expect($("#mark > option").size()).toBe(3);
            expect($("#series > option").size()).toBe(6);
            expect($("#model > option").size()).toBe(1);
        });

        it("should disable input if only default value exists", function() {
            $("#mark").val("audi").trigger("change");
            $("#series").val("a6").trigger("change");

            $("#mark").val("bmw").trigger("change");
            expect($("#model > option:first").val()).toBe("");
            expect($("#model").val()).toBe("");
            expect($("#model")).toBeDisabled();
        });

        it("should be chained to two parents", function() {
            $("#mark").val("bmw").trigger("change");
            $("#series").val("series-3").trigger("change");
            $("#model").val("coupe").trigger("change");

            expect($("#engine > option").size()).toBe(3);
            expect($("#engine > option:last").val()).toBe("30-petrol");

            $("#model").val("sedan").trigger("change");

            expect($("#engine > option").size()).toBe(4);
            expect($("#engine > option:last").val()).toBe("30-diesel");

            $("#series").val("series-6").trigger("change");
            $("#model").val("coupe").trigger("change");
            expect($("#engine > option").size()).toBe(2);
        });

        it("should honour selected attribute in html", function() {
            $("#mark").val("audi").trigger("change");
            expect($("#series > option:selected").val()).toBe("s6");
        });

    });

});