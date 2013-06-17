/*global describe:false, beforeEach:false, it:false, expect:false, sandbox:false, setFixtures:false, loadFixtures:false, jasmine:true */
/*jshint devel:true, jquery:true */

describe("Multiple Remote Chained", function() {
    "use strict";

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = "spec";
        
        loadFixtures("remote.html");
        
        $.ajaxSetup({
            async: false
        });
        
        $(".series").each(function() {
            $(this).remoteChained($(".mark", $(this).parent()), "json.php");
        });
        $(".model").each(function() {
            $(this).remoteChained($(".series", $(this).parent()), "json.php");
        });
        $(".engine").each(function() {
            $(this).remoteChained([
                $(".series", $(this).parent()),
                $(".model", $(this).parent())
            ], "json.php");
        });
    });
    
    it("should be chainable as jQuery plugin", function() {
        var select = $("#mark").remoteChained("#foo").addClass("bar");
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
        
        $("#mark-2").val("audi").trigger("change");
        $("#series-2").val("a5").trigger("change");
        $("#model-2").val("sportback").trigger("change");
        
        expect($("#engine > option").size()).toBe(3);
        expect($("#engine > option:last").val()).toBe("30-petrol");
        
        expect($("#engine-2 > option").size()).toBe(3);
        expect($("#engine-2 > option:last").val()).toBe("30-diesel");
        
        $("#model").val("sedan").trigger("change");
        expect($("#engine > option").size()).toBe(4);
        expect($("#engine > option:last").val()).toBe("30-diesel");
        
        $("#series").val("series-6").trigger("change");
        $("#model").val("coupe").trigger("change");
        expect($("#engine > option").size()).toBe(2);
        
        expect($("#engine-3").attr("disabled")).toBe("disabled");
        
    });

    it("should honour selected attribute in json", function() {
        $("#mark").val("audi").trigger("change");
        expect($("#series > option:selected").val()).toBe("s6");
    });
    
});