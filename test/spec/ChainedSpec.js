/*global describe:false, beforeEach:false, it:false, expect:false, sandbox:false, setFixtures:false, loadFixtures:false, jasmine:true */
/*jshint devel:true, jquery:true */

describe("Chained", function() {
    "use strict";

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = "spec";
        loadFixtures("chained.html");
        $("#series").chained("#mark");
        $("#model").chained("#series");
        $("#engine").chained("#series, #model");
        $("#engine_2").chained("#series, #model", "#model");
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
        expect($("#model").attr("disabled")).toBe("disabled");
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

    it("should update values when firing select changes", function() {
        var spyEvent1 = spyOnEvent('#model', 'change');
        var spyEvent2 = spyOnEvent('#engine', 'change');
        var spyEvent3 = spyOnEvent('#engine_2', 'change');
        $('#series').val('series-3').change();
        expect('change').toHaveBeenTriggeredOn('#model');
        expect('change').toHaveBeenTriggeredOn('#engine');
        expect('change').toHaveBeenTriggeredOn('#engine_2');
    });

    it("should only update values when firing select changes", function() {
        var callback_change_series = sinon.spy();
        var callback_change_model = sinon.spy();
        var callback_change_engine = sinon.spy();
        var callback_change_engine_2 = sinon.spy();
        $('#series').bind("change", callback_change_series);
        $('#model').bind("change", callback_change_model);
        $('#engine').bind("change", callback_change_engine);
        $('#engine_2').bind("change", callback_change_engine_2);
        $('#series').val('series-3').change();
        expect(callback_change_series.calledOnce).toBeTruthy();
        expect(callback_change_model.calledOnce).toBeTruthy();
        expect(callback_change_engine.callCount).toEqual(2);
        expect(callback_change_engine_2.callCount).toEqual(1);
    });

});
