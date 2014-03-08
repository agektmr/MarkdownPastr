/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
        dest: 'app/lib',
        js_dest: 'app/lib/js',
        css_dest: 'app/lib/css',
        options: {
          packageSpecific: {
            'bootstrap': {
              files: [
                'dist/css/bootstrap.css',
                'dist/css/bootstrap.min.css'
              ]
            }
          }
        }
      }
    },
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    version: {
      defaults: {
        src: [
          'bower.json',
          'package.json',
          'app/manifest.json'
        ]
      }
    },
    markdown: {
      all: {
        files: [
          {
            expand: true,
            src: 'HISTORY.md',
            dest: 'app/',
            ext: '.html'
          }
        ],
        options: {
          template: 'template.jst'
        }
      }
    },
    compress: {
      main: {
        options: {
          archive: 'app.zip',
          mode: 'zip'
        },
        src: ['app/**']
      }
    },
    jasmine: {
      markdown: {
        src: [
          'app/js/markdown.js'
        ],
        options: {
          vendor: 'test/underscore.js',
          specs: 'test/markdownSpec.js',
          helpers: 'test/markdownHelper.js',
          outfile: 'test/specRunner.html',
          keepRunner: true
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-bower');

  // Default task.
  grunt.registerTask('install', ['bower']);
  grunt.registerTask('build', ['markdown', 'version', 'compress']);

};
