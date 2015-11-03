const init = function(grunt) {

  grunt.initConfig({

    banner: grunt.file.read('scripts/banner.ejs'),
    pkg: grunt.file.readJSON('package.json'),
    year: (new Date()).getFullYear(),

    browserify: {
      options: {
        browserifyOptions: {
          standalone: '<%%= pkg.name %>'
        },
        transform: [
          'babelify',
          'browserify-shim'
        ]
      },
      dist: {
        src: ['src/plugin.js'],
        dest: 'dist/<%%= pkg.name %>.js'
      },
      test: {
        options: {
          browserifyOptions: {
            standalone: false
          }
        },
        src: ['test/unit/**/*.test.js'],
        dest: 'test/unit/dist/<%%= pkg.name %>.js'
      }
    },

    clean: {
<% if (sass) { -%>
      css: ['dist/**/*.css'],
<% } -%>
      dist: ['dist'],
      js: ['dist/**/*.js']
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      start: {
        tasks: ['connect:start', 'watch']
      }
    },

    connect: {
      options: {
        keepalive: true,
        livereload: true,
        useAvailablePort: true
      },
      start: {
        options: {
          port: 9999
        }
      }
    },

    qunit: {
      unit: 'test/unit/index.html'
    },

    run: {
      lint: {
        exec: 'npm run lint'
      }
    },

<% if (sass) { -%>
    sass: {
      options: {
        outputStyle: 'compressed'
      },
      dist: {
        src: ['src/plugin.scss'],
        dest: 'dist/<%%= pkg.name %>.css'
      }
    },

<% } -%>
    uglify: {
      options: {
        preserveComments: 'some'
      },
      dist: {
        src: 'dist/<%%= pkg.name %>.js',
        dest: 'dist/<%%= pkg.name %>.min.js'
      }
    },

    usebanner: {
      options: {
        banner: '<%%= banner %>'
      },
<% if (sass) { -%>
      css: {
        src: ['dist/<%%= pkg.name %>.css']
      },
<% } -%>
      js: {
        src: ['dist/<%%= pkg.name %>.js']
      }
    },

    watch: {
<% if (sass) { -%>
      css: {
        files: '<%%= sass.dist.src %>',
        tasks: ['build:css']
      },
<% } -%>
      js: {
        files: 'src/**/*.js',
        tasks: ['lint', 'build:js']
      },
      test: {
        files: ['Gruntfile.js', 'test/**/*.test.js'],
        tasks: ['test']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', [
    'clean:dist',
<% if (sass) { -%>
    'build:css',
<% } -%>
    'build:js'
  ]);

<% if (sass) { -%>
  grunt.registerTask('build:css', [
    'clean:css',
    'sass:dist',
    'usebanner:css'
  ]);

<% } -%>
  grunt.registerTask('build:js', [
    'run:lint',
    'clean:js',
    'browserify:dist',
    'browserify:test',
    'usebanner:js',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'test'
  ]);

  grunt.registerTask('lint', [
    'run:lint'
  ]);

  grunt.registerTask('start', [
    'build',
    'concurrent:start'
  ]);

  grunt.registerTask('test', [
    'lint',
    'build',
    'qunit'
  ]);
};

export default init;