/* jshint -W108 */
/* global describe, beforeEach, setFixtures, it, expect, spyOn */

describe("Remote version of plugin", function() {
    "use strict";

    beforeEach(function() {
        spyOn($, "getJSON").andCallFake(function(url, data, callback) {
            if (undefined !== data.series && undefined !== data.model) {
                if ("series-3" === data.series && "coupe" === data.model) {
                } else if ("series-6" === data.series && "coupe" === data.model) {
                    callback({"":"--","30-petrol":"3.0 petrol"});
                } else if ("series-3" === data.series && "sedan" === data.model) {
                    callback({"":"--","25-petrol":"2.5 petrol","30-petrol":"3.0 petrol","30-diesel":"3.0 diesel"});
                } else if ("series-3" === data.series) {
                    callback({"":"--","25-petrol":"2.5 petrol","30-petrol":"3.0 petrol"});
                } else if ("a5" === data.series && "sportback" === data.model) {
                    callback({"":"--","30-petrol":"3.0 petrol","30-diesel":"3.0 diesel"});
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
                } else if ("a5" === data.series) {
                    callback({"":"--","sportback":"Sportback","cabriolet":"Cabriolet","coupe":"Coupe"});
                } else {
                    callback({"":"--"});
                }
            } else {
                callback({"":"--"});
            }
        });
    });

    describe("having single set of selects", function() {

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

            '    <select class="mark2" id="mark2" name="mark2">' +
            '      <option value="">--</option>' +
            '      <option value="bmw" selected>BMW</option>' +
            '      <option value="audi">Audi</option>' +
            '    </select>' +
            '    <select class="series2" id="series2" name="series2">' +
            '      <option value="">--</option>' +
            '    </select>' +
            '</form>');
        });

        describe("and using old syntax", function() {

            beforeEach(function() {
                $("#series").remoteChained("#mark", "json.php");
                $("#model").remoteChained("#series", "json.php");
                $("#engine").remoteChained("#series, #model", "json.php");

                $("#series2").remoteChained("#mark2", "json.php", {
                    "bootstrap" : {"--":"--","series-2":"2 series","series-3":"3 series","series-5":"5 series","series-6":"6 series","series-7":"7 series","selected":"series-3"}
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

            it("should honour selected attribute in json", function() {
                $("#mark").val("audi").trigger("change");
                expect($("#series > option:selected").val()).toBe("s6");
            });

            it("should be able to bootstrap values", function() {
                expect($("#mark2 > option").size()).toBe(3);
                expect($("#series2 > option").size()).toBe(6);
            });

            it("should honour selected attribute in bootstrapped values", function() {
                expect($("#mark2 > option:selected").val()).toBe("bmw");
                expect($("#series2 > option:selected").val()).toBe("series-3");
            });
        });

        describe("and using new syntax", function() {

            beforeEach(function() {
                $("#series").remoteChained({
                    parents: "#mark",
                    url: "json.php"
                });

                $("#model").remoteChained({
                    parents: "#series",
                    url: "json.php"
                });

                $("#engine").remoteChained({
                    parents: "#series, #model",
                    url: "json.php"
                });

                $("#series2").remoteChained({
                    parents: "#mark2",
                    url: "json.php",
                    bootstrap : {
                        "--":"--",
                        "series-2":"2 series",
                        "series-3":"3 series",
                        "series-5":"5 series",
                        "series-6":"6 series",
                        "series-7":"7 series",
                        "selected":"series-3"
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

            it("should honour selected attribute in json", function() {
                $("#mark").val("audi").trigger("change");
                expect($("#series > option:selected").val()).toBe("s6");
            });

            it("should be able to bootstrap values", function() {
                expect($("#mark2 > option").size()).toBe(3);
                expect($("#series2 > option").size()).toBe(6);
            });

            it("should honour selected attribute in bootstrapped values", function() {
                expect($("#mark2 > option:selected").val()).toBe("bmw");
                expect($("#series2 > option:selected").val()).toBe("series-3");
            });
        });

    });

    describe("having multiple set of selects", function() {

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
            '</form>' +
            '<form>' +
            '    <select class="mark" id="mark-2" name="mark">' +
            '      <option value="">--</option>' +
            '      <option value="bmw">BMW</option>' +
            '      <option value="audi">Audi</option>' +
            '    </select>' +
            '    <select class="series" id="series-2" name="series">' +
            '      <option value="">--</option>' +
            '    </select>' +
            '    <select class="model" id="model-2" name="model">' +
            '      <option value="">--</option>' +
            '    </select>' +
            '    <select class="engine" id="engine-2" name="engine">' +
            '      <option value="">--</option>   ' +
            '    </select>' +
            '</form>' +
            '<form>' +
            '    <select class="mark" id="mark-3" name="mark">' +
            '      <option value="">--</option>' +
            '      <option value="bmw">BMW</option>' +
            '      <option value="audi">Audi</option>' +
            '    </select>' +
            '    <select class="series" id="series-3" name="series">' +
            '      <option value="">--</option>' +
            '    </select>' +
            '    <select class="model" id="model-3" name="model">' +
            '      <option value="">--</option>' +
            '    </select>' +
            '    <select class="engine" id="engine-3" name="engine">' +
            '      <option value="">--</option>   ' +
            '    </select>' +
            '</form>');

        });


        describe("and using old syntax", function() {
            beforeEach(function() {
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
                expect($("#model")).toBeDisabled();
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

                $("#mark-3").trigger("change");
                expect($("#engine-3")).toBeDisabled();

            });

            it("should honour selected attribute in json", function() {
                $("#mark").val("audi").trigger("change");
                expect($("#series > option:selected").val()).toBe("s6");
            });
        });

        describe("and using new syntax", function() {
            beforeEach(function() {
                $(".series").each(function() {
                    $(this).remoteChained({
                        parents: $(".mark", $(this).parent()),
                        url: "json.php"
                    });
                });
                $(".model").each(function() {
                    $(this).remoteChained({
                        parents: $(".series", $(this).parent()),
                        url: "json.php"
                    });
                });
                $(".engine").each(function() {
                    $(this).remoteChained({
                        parents: [
                            $(".series", $(this).parent()),
                            $(".model", $(this).parent())
                        ],
                        url: "json.php"
                    });
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
                expect($("#model")).toBeDisabled();
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

                $("#mark-3").trigger("change");
                expect($("#engine-3")).toBeDisabled();

            });

            it("should honour selected attribute in json", function() {
                $("#mark").val("audi").trigger("change");
                expect($("#series > option:selected").val()).toBe("s6");
            });

        });


    });

});