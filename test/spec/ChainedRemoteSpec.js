/*global describe:false, beforeEach:false, it:false, expect:false, sandbox:false, setFixtures:false, loadFixtures:false, jasmine:true */
/*jshint devel:true, jquery:true */




describe("Remote Chained", function() {
    "use strict";

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = "spec";

        loadFixtures("remote.html");

        $.ajaxSetup({
            async: false
        });

        $("#series").remoteChained("#mark", "json.php");
        $("#model").remoteChained("#series", "json.php");
    });

    describe("test updating works properly", function(){

        beforeEach(function(){
            $("#engine").remoteChained("#series, #model", "json.php");
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

            expect($("#engine > option").size()).toBe(3);
            expect($("#engine > option:last").val()).toBe("30-petrol");

            $("#model").val("sedan").trigger("change");
            expect($("#engine > option").size()).toBe(4);
            expect($("#engine > option:last").val()).toBe("30-diesel");

            $("#series").val("series-6").trigger("change");
            $("#model").val("coupe").trigger("change");
            expect($("#engine > option").size()).toBe(2);
        });

        it("should honour selected attribute in json", function() {
            $("#mark").val("audi").trigger("change");
            expect($("#series > option:selected").val()).toBe("s6");
        });
    });

    describe("remote petitions works properly", function(){

        beforeEach(function(){
            this.server = sinon.fakeServer.create();
        });

        afterEach(function(){
            this.server.restore();
        });

        it("select makes request for every change in every parent", function() {
            $("#engine").remoteChained("#series, #model", "json.php");
            expect(this.server.requests.length).toEqual(3);
            $('#series').val('series-3').change();
            expect(this.server.requests.length).toEqual(5);
        });

        it("select makes request for changes in the firing component", function() {
            $("#engine_2").remoteChained("#series, #model", "json.php", "#model");
            expect(this.server.requests.length).toEqual(1);
            $('#series').val('series-3').change();
            expect(this.server.requests.length).toEqual(2);
        });

    });

});
