(function () {
  'use strict';

  module.exports = function(grunt) {

    /** 
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');

    /**
     * Load in our build configuration file.
     */
    var userConfig = require( './build.config.js' );

    /**
     * This is the configuration object Grunt uses to give each plugin its 
     * instructions.
     */
    var taskConfig = {
      /**
       * We read in our `package.json` file so we can access the package name and
       * version. It's already there, so we don't repeat ourselves here.
       */
      pkg: grunt.file.readJSON('package.json'),

      /**
       * The banner is the comment that is placed at the top of our compiled 
       * source files. It is first processed as a Grunt template, where the `<%=`
       * pairs are evaluated based on this very configuration object.
       */
      meta: {
        banner:
          '/**\n' +
          ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' * <%= pkg.homepage %>\n' +
          ' *\n' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
          ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
          ' */\n'
      },

      /**
       * `grunt concat` concatenates multiple source files into a single file.
       */
      concat: {
        /**
         * The `buildCss` target concatenates compiled CSS and vendor CSS
         * together.
         */
        buildCss: {
          src: [
            '<%= vendorFiles.css %>'
          ],
          dest: 'public/git-reviewed.css'
        },

        /**
         * The `compileJs` target is the concatenation of our application source
         * code and all specified vendor source code into a single file.
         */
        compileJs: {
          options: {
            banner: '<%= meta.banner %>'
          },
          src: [
            '<%= vendorFiles.js %>',
            'public/templates-app.js',
            '<%= appFiles.main %>',
            '<%= appFiles.controllers %>',
            '<%= appFiles.services %>',
            '<%= appFiles.directives %>'
          ],
          dest: 'public/git-reviewed.js'
        }
      },

      /**
       * Minify the sources!
       */
      uglify: {
        compile: {
          options: {
            banner: '<%= meta.banner %>'
          },
          files: {
            '<%= concat.compileJs.dest %>': '<%= concat.compileJs.dest %>'
          }
        }
      },

      /**
       * `jshint` defines the rules of our linter as well as which files we
       * should check. This file, all javascript sources, and all our unit tests
       * are linted based on the policies listed in `options`. But we can also
       * specify exclusionary patterns by prefixing them with an exclamation
       * point (!); this is useful when code comes from a third party but is
       * nonetheless inside `src/`.
       */
      jshint: {
        src: [
          '<%= appFiles.main %>',
          '<%= appFiles.controllers %>',
          '<%= appFiles.services %>',
          '<%= appFiles.directives %>'
        ],
        gruntfile: [
          'Gruntfile.js'
        ],
        options: {
          //curly: true,
          //immed: true,
          //newcap: true,
          //noarg: true,
          //sub: true,
          //boss: true,
          //eqnull: true
        },
        globals: {}
      },

      /**
       * HTML2JS is a Grunt plugin that takes all of your template files and
       * places them into JavaScript files as strings that are added to
       * AngularJS's template cache. This means that the templates too become
       * part of the initial payload as one JavaScript file. Neat!
       */
      html2js: {
        /**
         * These are the templates from `src/app`.
         */
        options: {
        },
        main: {
          src: [ '<%= appFiles.partials %>' ],
          dest: 'public/templates-app.js'
        }
      },

      /**
       * And for rapid development, we have a watch set up that checks to see if
       * any of the files listed below change, and then to execute the listed 
       * tasks when they do. This just saves us from having to type "grunt" into
       * the command-line every time we want to see what we're working on; we can
       * instead just leave "grunt watch" running in a background terminal. Set it
       * and forget it, as Ron Popeil used to tell us.
       *
       * But we don't need the same thing to happen for all the files. 
       */
      delta: {
        /**
         * By default, we want the Live Reload to work for all tasks; this is
         * overridden in some tasks (like this file) where browser resources are
         * unaffected. It runs by default on port 35729, which your browser
         * plugin should auto-detect.
         */
        options: {
          livereload: true
        },

        /**
         * When the Gruntfile changes, we just want to lint it. In fact, when
         * your Gruntfile changes, it will automatically be reloaded!
         */
        gruntfile: {
          files: 'Gruntfile.js',
          tasks: [ 'jshint:gruntfile' ],
          options: {
            livereload: false
          }
        },

        /**
         * When our JavaScript source files change, we want to run lint them and
         * run our unit tests.
         */
        jssrc: {
          files: [
            '<%= vendorFiles.js %>',
            '<%= jshint.src %>'
          ],
          tasks: [ 'jshint:src', 'concat:compileJs' ]
        },

        /**
         * When our JavaScript source files change, we want to run lint them and
         * run our unit tests.
         */
        csssrc: {
          files: [
            '<%= vendorFiles.css %>'
          ],
          tasks: [ 'concat:buildCss' ]
        },

        /**
         * When our templates change, we only rewrite the template cache.
         */
        tpls: {
          files: [
            '<%= appFiles.partials %>'
          ],
          tasks: [ 'html2js', 'concat:compileJs' ]
        }
      }/*,

      watch: {
        js: {
          files: ['<%= compileJs.src %>'],
          tasks: ['jshint', 'concat:compileJs'],
          options: {
            livereload: true
          }
        },
        css: {
          files: ['<%= buildCss.src %>'],
          tasks: ['concat:buildCss'],
          options: {
            livereload: true
          }
        },
        tpls: {
          files: ['<%= appFiles.partials %>'],
          tasks: ['html2js'],
          options: {
            livereload: true
          }
        }
      }*/
    };

    grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

    /**
     * In order to make it safe to just compile or copy *only* what was changed,
     * we need to ensure we are starting from a clean, fresh build. So we rename
     * the `watch` task to `delta` (that's why the configuration var above is
     * `delta`) and then add a new task called `watch` that does a clean build
     * before watching for changes.
     */
    grunt.renameTask( 'watch', 'delta' );
    grunt.registerTask( 'default', [ 'concat:compileJs', 'concat:buildCss', 'html2js', 'delta' ] );

    /**
     * The default task is to build and compile.
     */
    grunt.registerTask( 'build', [ 'compile' ] );

    /**
     * The `compile` task gets your app ready for deployment by concatenating and
     * minifying your code.
     */
    grunt.registerTask( 'compile', [
      'concat:compileJs', 'uglify', 'concat:buildCss', 'html2js'
      //'concat:compileJs', 'concat:buildCss'
    ]);

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS ( files ) {
      return files.filter( function ( file ) {
        return file.match( /\.js$/ );
      });
    }

    /**
     * A utility function to get all app CSS sources.
     */
    function filterForCSS ( files ) {
      return files.filter( function ( file ) {
        return file.match( /\.css$/ );
      });
    }


  //  // Project Configuration
  //  grunt.initConfig({
  //    pkg: grunt.file.readJSON('package.json'),
  //    uglify: {
  //      options: {
  //        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
  //      }
  //    }
  //  });

    // Load the plugin that provides the "uglify" task.
  //  grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
  //  grunt.registerTask('default', ['uglify']);
  };
})();