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
                " * Version: <%= pkg.version %> (<%= grunt.template.today('yyyy-mm-dd') %>)\n" +
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
    }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask("test", ["jshint"]);
  grunt.registerTask("default", ["test", "uglify"]);

};