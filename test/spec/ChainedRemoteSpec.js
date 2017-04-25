/* jshint -W108 */
/* global describe, beforeEach, expect, sinon */

describe("Remote version of plugin", function() {
    "use strict";

    var server;

    beforeEach(function() {

        /* https://github.com/cjohansen/Sinon.JS/issues/319 */
        if (navigator.userAgent.indexOf("PhantomJS") !== -1){
            window.ProgressEvent = function(type, params) {
                params = params || {};

                this.lengthComputable = params.lengthComputable || false;
                this.loaded = params.loaded || 0;
                this.total = params.total || 0;
            };
        }

        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.autoRespondAfter = 10;

        server.respondWith("GET", "/api/series?mark=bmw",
                          [200, {"Content-Type": "application/json"},
                           '{"":"--","series-1":"1 series","series-3":"3 series","series-5":"5 series","series-6":"6 series","series-7":"7 series"}']);
        server.respondWith("GET", "/api/series?mark=audi",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--","a1":"A1","a3":"A3","s3":"S3","a4":"A4","s4":"S4","a5":"A5","s5":"S5","a6":"A6","s6":"S6","rs6":"RS6","a8":"A8", "selected":"s6"}']);
        server.respondWith("GET", "/api/series?mark=",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--"}']);

        server.respondWith("GET", "/api/models?series=series-3",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--","coupe":"Coupe","cabrio":"Cabrio","sedan":"Sedan","touring":"Touring"}']);
        server.respondWith("GET", "/api/models?series=series-6",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--","coupe":"Coupe","cabrio":"Cabrio"}']);
        server.respondWith("GET", "/api/models?series=a5",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--","sportback":"Sportback","cabriolet":"Cabriolet","coupe":"Coupe"}']);
        server.respondWith("GET", "/api/models?series=",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--"}']);

        server.respondWith("GET", "/api/engines?series=series-6&model=coupe",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--","30-petrol":"3.0 petrol"}']);
        server.respondWith("GET", "/api/engines?series=series-3&model=sedan",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--","25-petrol":"2.5 petrol","30-petrol":"3.0 petrol","30-diesel":"3.0 diesel"}']);
        server.respondWith("GET", "/api/engines?series=series-3&model=",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--","25-petrol":"2.5 petrol","30-petrol":"3.0 petrol"}']);
        server.respondWith("GET", "/api/engines?series=a5&model=sportback",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--","30-petrol":"3.0 petrol","30-diesel":"3.0 diesel"}']);
        server.respondWith("GET", "/api/engines?series=&model=",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--"}']);
        server.respondWith("GET", "/api/engines?series=&model=",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--"}']);
        server.respondWith("GET", "/api/engines?series=&model=",
                           [200, {"Content-Type": "application/json"},
                           '{"":"--"}']);

    });

    afterEach(function() {
        server.restore();
    });

    describe("having single set of selects", function() {

        beforeEach(function() {
            jasmine.getFixtures().set('<form>' +
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
            '    <select class="mark" id="mark2" name="mark">' +
            '      <option value="">--</option>' +
            '      <option value="bmw" selected>BMW</option>' +
            '      <option value="audi">Audi</option>' +
            '    </select>' +
            '    <select class="series" id="series2" name="series">' +
            '      <option value="">--</option>' +
            '    </select>' +
            '    <select class="model" id="model2" name="model">' +
            '      <option value="">--</option>' +
            '    </select>' +
            '    <select class="engine" id="engine2" name="engine">' +
            '      <option value="">--</option>   ' +
            '    </select>' +
            '    <select class="mark" id="mark3" name="mark">' +
            '      <option value="">--</option>' +
            '      <option value="bmw" selected>BMW</option>' +
            '      <option value="audi">Audi</option>' +
            '    </select>' +
            '    <select  id="series3" name="series">' +
            '      <option value="">--</option>' +
            '    </select>' +
            '    <input type="text" class="mark" id="mark4" name="mark">' +
            '    <select class="series" id="series4" name="series">' +
            '      <option value="">--</option>' +
            '    </select>' +
            '    <select class="mark" id="mark5" name="mark">' +
            '      <option value="">--</option>' +
            '      <option value="bmw" selected>BMW</option>' +
            '      <option value="audi">Audi</option>' +
            '    </select>' +
            '    <select class="series" id="series5" name="series">' +
            '      <option value="">--</option>' +
            '    </select>' +
            '</form>');
        });

        describe("and using new syntax", function() {

            beforeEach(function() {
                $("#series").remoteChained({
                    parents: "#mark",
                    url: "/api/series"
                });

                $("#model").remoteChained({
                    parents: "#series",
                    url: "/api/models"
                });

                $("#engine").remoteChained({
                    parents: "#series, #model",
                    url: "/api/engines"
                });

                $("#series2").remoteChained({
                    parents: "#mark2",
                    url: "/api/series",
                    bootstrap : {
                        "--":"--",
                        "series-2":"2 series",
                        "series-3":"3 series",
                        "series-5":"5 series",
                        "series-6":"6 series",
                        "series-7":"7 series",
                        "selected":"series-3"
                    },
                    clear: true,
                });

                $("#model2").remoteChained({
                    parents: "#series2",
                    url: "/api/models",
                    clear: true
                });

                $("#engine2").remoteChained({
                    parents: "#series2, #model2",
                    url: "/api/engines",
                    clear: true,
                    loading: "Loading..."
                });

                /* https://github.com/tuupola/jquery_chained/issues/30 */
                $("#series3").remoteChained({
                    parents: "#mark3",
                    url: "/api/series",
                    bootstrap : {
                        "--":"--",
                        2 : "2 series",
                        3 : "3 series",
                        5 : "5 series",
                        6 : "6 series",
                        7 : "7 series",
                        "selected" : 3
                    },
                    clear: true
                });

                $("#series4").remoteChained({
                    parents: "#mark4",
                    url: "/api/series",
                });

            });

            it("should be chainable as jQuery plugin", function() {
                var select = $("#mark").remoteChained("#foo").addClass("bar");
                expect(select.hasClass("bar")).toBe(true);
            });

            it("should make initial update", function(done) {
                $("#mark").trigger("change");

                setTimeout(function() {
                    expect($("#mark > option").length).toBe(3);
                    expect($("#series > option").length).toBe(1);
                    expect($("#series")).toBeDisabled();
                    expect($("#model > option").length).toBe(1);
                    expect($("#model")).toBeDisabled();
                    done();
                }, 1000);
            });

            it("should update series when mark changes", function(done) {

                $("#mark").val("audi").trigger("change");

                setTimeout(function() {
                    expect($("#mark > option").length).toBe(3);
                    expect($("#series > option").length).toBe(12);
                    /* This fails wxith setFixtures() but works wxith loadFixtures() */
                    /* expect($("#model > option").length).toBe(3); */

                    $("#mark").val("bmw").trigger("change");
                }, 100);

                setTimeout(function() {
                    expect($("#mark > option").length).toBe(3);
                    expect($("#series > option").length).toBe(6);
                    expect($("#model > option").length).toBe(1);
                    done();
                }, 200);
            });

            it("should update model when series changes", function(done) {
                $("#mark").val("bmw").trigger("change");

                setTimeout(function() {
                    $("#series").val("series-3").trigger("change");
                }, 100);

                setTimeout(function() {
                    expect($("#mark > option").length).toBe(3);
                    expect($("#series > option").length).toBe(6);
                    expect($("#model > option").length).toBe(5);
                    done();
                }, 200);
            });

            it("should reset series and model when mark changes", function(done) {
                $("#mark").val("audi").trigger("change");
                setTimeout(function() {
                    $("#series").val("a6").trigger("change");
                }, 10);

                setTimeout(function() {
                    $("#mark").val("bmw").trigger("change");
                }, 200);

                setTimeout(function() {
                    expect($("#mark > option").length).toBe(3);
                    expect($("#series > option").length).toBe(6);
                    expect($("#model > option").length).toBe(1);
                    done();
                }, 300);
            });

            it("should disable input if only default value exists", function(done) {
                $("#mark").val("audi").trigger("change");
                $("#series").val("a6").trigger("change");
                $("#mark").val("bmw").trigger("change");

                setTimeout(function() {
                    expect($("#model > option:first").val()).toBe("");
                    expect($("#model").val()).toBe("");
                    expect($("#model")).toBeDisabled();
                    done();
                }, 100);
            });

           it("should be chained to two parents", function(done) {

                $("#mark").val("bmw").trigger("change");

                setTimeout(function() {
                    $("#series").val("series-3").trigger("change");
                }, 100);

                setTimeout(function() {
                    $("#model").val("coupe").trigger("change");
                }, 200);


                setTimeout(function() {
                    expect($("#engine > option").length).toBe(3);
                    expect($("#engine > option:last").val()).toBe("30-petrol");

                    $("#model").val("sedan").trigger("change");
                }, 300);

                setTimeout(function() {
                    expect($("#engine > option").length).toBe(4);
                    expect($("#engine > option:last").val()).toBe("30-diesel");
                    $("#series").val("series-6").trigger("change");
                    $("#model").val("coupe").trigger("change");
                }, 400);

                setTimeout(function() {
                    expect($("#engine > option").length).toBe(2);
                    done();
                }, 500);
            });

            it("should honour selected attribute in json", function(done) {
                $("#mark").val("audi").trigger("change");

                setTimeout(function() {
                    expect($("#series > option:selected").val()).toBe("s6");
                    done();
                }, 100);
            });

            it("should be able to bootstrap with array of objects", function() {
                $("#series5").remoteChained({
                    parents : "#mark5",
                    url: "/api/series",
                    loading : "--",
                    bootstrap : [
                        {"--":"--"},
                        {"series-2":"2 series"},
                        {"series-3":"3 series"},
                        {"series-5":"5 series"},
                        {"series-6":"6 series"},
                        {"series-7":"7 series"},
                        {"selected":"series-3"}
                    ]
                });

                expect($("#series5 > option").length).toBe(6);
                expect($("#series5 > option:selected").val()).toBe("series-3");
            });

            it("should be able to bootstrap with object", function() {
                $("#series5").remoteChained({
                    parents : "#mark5",
                    url: "/api/series",
                    loading : "--",
                    bootstrap : {
                        "--":"--",
                        "series-2":"2 series",
                        "series-3":"3 series",
                        "series-5":"5 series",
                        "series-6":"6 series",
                        "series-7":"7 series",
                        "selected":"series-6"
                    }
                });

                expect($("#series5 > option").length).toBe(6);
                expect($("#series5 > option:selected").val()).toBe("series-6");
            });

            it("should honour selected attribute in bootstrapped values", function() {
                expect($("#mark2 > option:selected").val()).toBe("bmw");
                expect($("#series2 > option:selected").val()).toBe("series-3");
                expect($("#series3 > option:selected").val()).toBe("3");
            });

            it("should clear selects while loading", function(done) {

                server.autoRespondAfter = 200;

                $("#mark2").val("bmw").trigger("change");
                expect($("#mark2 > option").length).toBe(3);

                setTimeout(function() {
                    expect($("#series2 > option").length).toBe(0);
                    expect($("#model2 > option").length).toBe(0);
                }, 100);

                /* Should have values now. */
                setTimeout(function() {
                    expect($("#series2 > option").length).toBe(6);
                    done();
                }, 300);

                setTimeout(function() {
                    expect($("#model2 > option").length).toBe(1);
                    done();
                }, 400);
            });

            it("should show disabled loading text while loading", function(done) {
                $("#mark2").val("bmw").trigger("change");

                expect($("#engine2 > option").length).toBe(1);
                expect($("#engine2 > option:first").text()).toBe("Loading...");

                setTimeout(function() {
                    expect($("#mark2 > option").length).toBe(3);
                    expect($("#engine2 > option").length).toBe(1);
                    expect($("#engine2 > option:first").text()).toBe("--");
                    done();
                }, 100);

            });

            it("should be chained to normal text input", function(done) {
                $("#mark4").val("bmw").trigger("change");

                setTimeout(function() {
                    expect($("#series4 > option").length).toBe(6);
                    expect($("#series4 > option:first").text()).toBe("--");
                    done();
                }, 100);
            });

        });
    });

    describe("having multiple set of selects", function() {

        beforeEach(function() {
            jasmine.getFixtures().set('<form>' +
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

        describe("and using new syntax", function() {
            beforeEach(function() {
                $(".series").each(function() {
                    $(this).remoteChained({
                        parents: $(".mark", $(this).parent()),
                        url: "/api/series"
                    });
                });
                $(".model").each(function() {
                    $(this).remoteChained({
                        parents: $(".series", $(this).parent()),
                        url: "/api/models"
                    });
                });
                $(".engine").each(function() {
                    $(this).remoteChained({
                        parents: [
                            $(".series", $(this).parent()),
                            $(".model", $(this).parent())
                        ],
                        url: "/api/engines"
                    });
                });
            });

            it("should be chainable as jQuery plugin", function() {
                var select = $("#mark").remoteChained("#foo").addClass("bar");
                expect(select.hasClass("bar")).toBe(true);
            });

            it("should make initial update", function(done) {
                $("#mark").trigger("change");

                setTimeout(function() {
                    expect($("#mark > option").length).toBe(3);
                    expect($("#series > option").length).toBe(1);
                    expect($("#series")).toBeDisabled();
                }, 100);

                setTimeout(function() {
                    expect($("#model > option").length).toBe(1);
                    expect($("#model")).toBeDisabled();
                    done();
                }, 200);

            });

            it("should update series when mark changes", function(done) {

                $("#mark").val("audi").trigger("change");

                setTimeout(function() {
                    expect($("#mark > option").length).toBe(3);
                    expect($("#series > option").length).toBe(12);
                    /* This fails wxith setFixtures() but works wxith loadFixtures() */
                    /* expect($("#model > option").length).toBe(3); */

                    $("#mark").val("bmw").trigger("change");
                }, 100);

                setTimeout(function() {
                    expect($("#mark > option").length).toBe(3);
                    expect($("#series > option").length).toBe(6);
                    expect($("#model > option").length).toBe(1);
                    done();
                }, 200);
            });

            it("should update model when series changes", function(done) {
                $("#mark").val("bmw").trigger("change");

                setTimeout(function() {
                    $("#series").val("series-3").trigger("change");
                }, 100);

                setTimeout(function() {
                    expect($("#mark > option").length).toBe(3);
                    expect($("#series > option").length).toBe(6);
                    expect($("#model > option").length).toBe(5);
                    done();
                }, 200);
            });

            it("should reset series and model when mark changes", function(done) {
                $("#mark").val("audi").trigger("change");
                setTimeout(function() {
                    $("#series").val("a6").trigger("change");
                }, 100);

                setTimeout(function() {
                    $("#mark").val("bmw").trigger("change");
                }, 200);

                setTimeout(function() {
                    expect($("#mark > option").length).toBe(3);
                    expect($("#series > option").length).toBe(6);
                    expect($("#model > option").length).toBe(1);
                    done();
                }, 300);
            });

            it("should disable input if only default value exists", function(done) {
                $("#mark").val("audi").trigger("change");
                $("#series").val("a6").trigger("change");
                $("#mark").val("bmw").trigger("change");

                setTimeout(function() {
                    expect($("#model > option:first").val()).toBe("");
                    expect($("#model").val()).toBe("");
                    expect($("#model")).toBeDisabled();
                    done();
                }, 100);
            });


            it("should be chained to two parents", function(done) {

                $("#mark").val("bmw").trigger("change");
                $("#mark-2").val("audi").trigger("change");

                setTimeout(function() {
                    $("#series").val("series-3").trigger("change");
                    $("#series-2").val("a5").trigger("change");
                }, 100);

                setTimeout(function() {
                    $("#model").val("coupe").trigger("change");
                    $("#model-2").val("sportback").trigger("change");
                }, 200);


                setTimeout(function() {
                    expect($("#engine > option").length).toBe(3);
                    expect($("#engine > option:last").val()).toBe("30-petrol");
                    expect($("#engine-2 > option").length).toBe(3);
                    expect($("#engine-2 > option:last").val()).toBe("30-diesel");

                    $("#model").val("sedan").trigger("change");
                }, 300);

                setTimeout(function() {
                    expect($("#engine > option").length).toBe(4);
                    expect($("#engine > option:last").val()).toBe("30-diesel");
                    $("#series").val("series-6").trigger("change");
                    $("#model").val("coupe").trigger("change");
                }, 400);

                setTimeout(function() {
                    expect($("#engine > option").length).toBe(2);
                    $("#mark-3").trigger("change");
                }, 500);

                setTimeout(function() {
                    expect($("#engine-3")).toBeDisabled();
                    done();
                }, 600);
            });

            it("should honour selected attribute in json", function(done) {
                $("#mark").val("audi").trigger("change");

                setTimeout(function() {
                    expect($("#series > option:selected").val()).toBe("s6");
                    done();
                }, 500);
            });

            /* TODO: Test for clear and loading. */
        });
    });
});

var asyncCheck = function(done, wait, verify) {
    if (wait()) {
        verify();
        done();
    } else {
        setTimeout(function() {
            asyncCheck(done, wait, verify);
        }, 500);
    }
};
