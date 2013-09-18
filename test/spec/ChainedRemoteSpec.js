/* jshint -W108 */
/* global describe, beforeEach, setFixtures, it, expect, spyOn */

describe("Remote Chained", function() {
    "use strict";

    beforeEach(function() {
        setFixtures('<form>' +
        '    <select class="mark" id="mark" name="mark">' +
        '      <option value="">--</option>' +
        '      <option value="bmw">BMW</option>' +
        '      <option value="audi">Audi</option>' +
        '    </select>' +
        '    <select class="series" id="series" name="series">' +
        '      <option value="">--</option>' +
        '    </select>' +
        '    <select class="model" id="model" name="model">' +
        '      <option value="">--</option>' +
        '    </select>' +
        '    <select class="engine" id="engine" name="engine">' +
        '      <option value="">--</option>   ' +
        '    </select>' +
        '</form>');
        
        $("#series").remoteChained("#mark", "json.php");
        $("#model").remoteChained("#series", "json.php");
        $("#engine").remoteChained("#series, #model", "json.php");
        
        spyOn($, "getJSON").andCallFake(function(url, data, callback) {
            if (undefined !== data.series && undefined !== data.model) {
                if ("series-3" === data.series && "coupe" === data.model) {
                } else if ("series-6" === data.series && "coupe" === data.model) {
                    callback({"":"--","30-petrol":"3.0 petrol"});
                } else if ("series-3" === data.series && "sedan" === data.model) {
                    callback({"":"--","25-petrol":"2.5 petrol","30-petrol":"3.0 petrol","30-diesel":"3.0 diesel"}
);
                } else if ("series-3" === data.series) {
                    callback({"":"--","25-petrol":"2.5 petrol","30-petrol":"3.0 petrol"});
                } else {
                    callback({"":"--"});
                }
            } else if (data.mark) {
                if ("bmw" === data.mark) {
                    callback({"":"--","series-1":"1 series","series-3":"3 series","series-5":"5 series","series-6":"6 series","series-7":"7 series"});
                } else if ("audi" === data.mark) {
                    callback({"":"--","a1":"A1","a3":"A3","s3":"S3","a4":"A4","s4":"S4","a5":"A5","s5":"S5","a6":"A6","s6":"S6","rs6":"RS6","a8":"A8", "selected":"s6"});
                } else {
                    callback({"":"--"});
                }
            } else if (data.series) {
                if ("series-3" === data.series) {
                    callback({"":"--","coupe":"Coupe","cabrio":"Cabrio","sedan":"Sedan","touring":"Touring"});
                } else if ("series-6" === data.series) {
                    callback({"":"--","coupe":"Coupe","cabrio":"Cabrio"});
                } else {
                    callback({"":"--"});
                }
            } else {
                callback({"":"--"});
            }
        });
    });
    
    it("should be chainable as jQuery plugin", function() {
        var select = $("#mark").remoteChained("#foo").addClass("bar");
        expect(select.hasClass("bar")).toBe(true);
    });
    
    it("should make initial update", function() {
        $("#mark").trigger("change");
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
        /* This fails with setFixtures() but works with loadFixtures() */
        //expect($("#model > option").size()).toBe(3);

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