module.exports = function(grunt) {
    "use strict";

    require("time-grunt")(grunt);
    require("load-grunt-tasks")(grunt);

    grunt.registerTask("test", ["jshint", "jasmine"]);
    grunt.registerTask("default", ["test", "uglify"]);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify : {
            options: {
                report: "gzip",
                banner: "/*! Chained <%= pkg.version %> - MIT license - Copyright 2010-2017 Mika Tuupola */\n"
            },
            target: {
                files: {
                    "jquery.chained.min.js" : "jquery.chained.js",
                    "jquery.chained.remote.min.js" : "jquery.chained.remote.js"
                }
            }
        },
        watch: {
            files: ["*.js", "!*.min.js" ,"test/spec/*Spec.js"],
            tasks: ["test"],
        },
        jshint: {
            files: ["*.js", "!*.min.js" ,"test/spec/*Spec.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },
        jasmine: {
            "jquery-1.12.4": {
                src: ["jquery.chained.js", "jquery.chained.remote.js"],
                options: {
                    helpers: "test/spec/*Helper.js",
                    specs: "test/spec/*Spec.js",
                    vendor: ["test/vendor/jquery-1.12.4.js", "test/vendor/jasmine-jquery.js",
                             "test/vendor/sinon-1.8.2.js"]
                }
            },
            "jquery-2.2.4": {
                src: ["jquery.chained.js", "jquery.chained.remote.js"],
                options: {
                    helpers: "test/spec/*Helper.js",
                    specs: "test/spec/*Spec.js",
                    vendor: ["test/vendor/jquery-2.2.4.js", "test/vendor/jasmine-jquery.js",
                             "test/vendor/sinon-1.8.2.js"]
                }
            },
            "jquery-3.2.1": {
                src: ["jquery.chained.js", "jquery.chained.remote.js"],
                options: {
                    helpers: "test/spec/*Helper.js",
                    specs: "test/spec/*Spec.js",
                    vendor: ["test/vendor/jquery-3.2.1.js", "test/vendor/jasmine-jquery.js",
                             "test/vendor/sinon-1.8.2.js"]
                }
            }//,
            // "zepto-1.0.1": {
            //     src: ["jquery.chained.js", "jquery.chained.remote.js"],
            //     options: {
            //         helpers: "test/spec/*Helper.js",
            //         specs: "test/spec/*Spec.js",
            //         vendor: ["test/vendor/zepto-1.0.1.js", "test/vendor/zepto-selector.js",
            //                  "test/vendor/jasmine-zepto.js", "test/vendor/sinon-1.8.2.js"]
            //     }
            // }
        }
    });

};