module.exports = function(grunt) {
    "use strict";
  
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify : {
            options: {
                report: "gzip",
                banner: "/*\n" +
                        " * Chained - jQuery non AJAX(J) chained selects plugin\n" +
                        " *\n" +
                        " * Copyright (c) 2010-2013 Mika Tuupola\n" +
                        " *\n" +
                        " * Licensed under the MIT license:\n" +
                        " *   http://www.opensource.org/licenses/mit-license.php\n" +
                        " *\n" +
                        " * Project home:\n" +
                        " *   http://www.appelsiini.net/projects/chained\n" +
                        " *\n" +
                        " * Version: <%= pkg.version %>\n" +
                        " *\n" +
                        " */\n"
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
            "jquery-1.9.1": {
                src: ["jquery.chained.js", "jquery.chained.remote.js"],
                options: {
                    helpers: "test/spec/*Helper.js",
                    specs: "test/spec/*Spec.js",
                    vendor: ["test/vendor/jquery-1.9.1.js", "test/vendor/jasmine-jquery.js"]
                }
            },
            "jquery-1.10.2": {
                src: ["jquery.chained.js", "jquery.chained.remote.js"],
                options: {
                    helpers: "test/spec/*Helper.js",
                    specs: "test/spec/*Spec.js",
                    vendor: ["test/vendor/jquery-1.10.2.js", "test/vendor/jasmine-jquery.js"]
                }
            },
            "jquery-2.0.3": {
                src: ["jquery.chained.js", "jquery.chained.remote.js"],
                options: {
                    helpers: "test/spec/*Helper.js",
                    specs: "test/spec/*Spec.js",
                    vendor: ["test/vendor/jquery-2.0.3.js", "test/vendor/jasmine-jquery.js"]
                }
            },
            "zepto-1.0.1": {
                src: ["jquery.chained.js", "jquery.chained.remote.js"],
                options: {
                    helpers: "test/spec/*Helper.js",
                    specs: "test/spec/*Spec.js",
                    vendor: ["test/vendor/zepto-1.0.1.js", "test/vendor/zepto-selector.js",
                             "test/vendor/jasmine-zepto.js"]
                }
            }
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("test", ["jshint", "jasmine"]);
    grunt.registerTask("default", ["test", "uglify"]);

};