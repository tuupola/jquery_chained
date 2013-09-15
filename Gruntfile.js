module.exports = function(grunt) {
  "use strict";
  
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    uglify : {
      options: {
        banner: "/*\n" +
                " * Chained - jQuery non AJAX(J) chained selects plugin\n" +
                " *\n" +
                " * Copyright (c) 2010-2013 Mika Tuupola\n" +
                " *\n" +
                " * Licensed under the MIT license:\n" +
                " *   http://www.opensource.org/licenses/mit-license.php\n" +
                " *\n" +
                " * Project home:\n" +
                " *   http://www.appelsiini.net/projects/lazyload\n" +
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
    jshint: {
      files: ["Gruntfile.js", "jquery.chained.js", "jquery.chained.remote.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    jasmine: {
      src: ["jquery.chained.js", "jquery.chained.remote.js"],
      options: {
        //  specs: 'spec/*Spec.js',
        helpers: "test/spec/*Helper.js",
        specs: ["test/spec/ChainedSpec.js"],
        vendor: ["test/vendor/jquery-1.9.0.js", "test/vendor/jasmine-jquery.js"]
        //        vendor: "test/vendor/**/*.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-jasmine");

  grunt.registerTask("test", ["jshint", "jasmine"]);
  grunt.registerTask("default", ["test", "uglify"]);

};