module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-browserify');

    var vendors = 'jquery backbone backbone.marionette'.split(' ');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            banner: 'Test'
        },
        cacheBust: {
            options: {
                baseDir: 'target/',
                encoding: 'utf8',
                algorithm: 'md5',
                length: 100,
                rename: false
            },
            assets: {
                files: [{
                    src: ['target/index.html']
                }]
            }
        },
        watch: {
            scripts: {
                files: [
                        'app/**/*.js',
                        'app/**/*.hbs',
                        'css/*.css',
                        'index.html'
                ],
                tasks: ['build'],
                options: {
                    spawn: false,
                    livereload: true
                }
            }
        },
        handlebars: {
            compile: {
                files: {
                    "target/templates/templates.js": ["target/app/modules/**/*.hbs"]
                },
                options: {
                    namespace: 'Handlebars.templates',
                    processName: function(filePath) {
                        var pieces = filePath.split("/");
                        return pieces[pieces.length - 1].replace('.hbs', '');
                    }
                }
            }
        },
        uglify: {
            min_all: {
                options: {
                    report: 'gzip',
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    'target/app/templates.min.js': ['target/templates/templates.js'],
                    'target/app/vendors.min.js': ['target/vendor/vendors.js'],
                    'target/app/app.min.js': ['target/app/app.js']
                }
            }
        },
        cssmin: {
            options: {
                advanced: false,
                shorthandCompacting: false,
                roundingPrecision: -1,
                rebase: false,
                aggressiveMerging: false,
                keepSpecialComments: 0
            },
            concat: {
                files: {
                        'target/css/styles.css': ['css/*.css']
                }
            },
            min_all: {
                files: [{
                    expand: true,
                    cwd: 'target/css',
                    src: ['styles.css'],
                    dest: 'target/css',
                    ext: '.min.css'
                }]
             }
        },
        clean: {
            target: ['target/'],
            directories: [  "target/vendor",
                            "target/templates",
                            "target/app/constants",
                            "target/app/entities",
                            "target/app/modules",
                            "target/app/utils"],
            js: ["target/app/**/*.js", "!target/app/*.min.js"],
            css: ["target/css/*.css", "!target/css/*.min.css"]
        },
        copy: {
            create_structure: {
                            files: [
                                {expand: true, src: ['css/**'], dest: 'target/'},
                                {expand: true, src: ['fonts/**'], dest: 'target/'},
                                {expand: true, src: ['app/**'], dest: 'target/'},
                                {expand: true, src: ['fonts/**'], dest: 'target/'},
                                {expand: true, src: ['images/**'], dest: 'target/'},
                                {expand: true, src: ['vendor/**'], dest: 'target/'},
                                {expand: true, src: ['*.html'], dest: 'target/'}
                            ]
            }
        },
        browserify:{
            vendors: {
                files: {
                    'target/vendor/vendors.js': []
                },
                options: {
                    require: vendors
                }
            },
            app:{
                options:{
                    debug: false,
                    transform:[['babelify',{'loose':"all"}]],
                    external: vendors
                },
                files: {
                    'target/app/app.js':["app/modules/home/**.js","app/app.js"]
                }
            }
        },
        preprocess : {
            options: {
                context : {VERSION: "<!-- SIL, v<%= pkg.version %> -->" }
            },
            local : {
                options : {
                    context : {
                        ENV : 'local',
                        EXPLODED: true,
                        HOME_PAGE: "http://localhost/",
                        COOKIE_NAME: "sessionID_local"
                    }
                },
                files: [
                    {src: 'target/app/constants/constants.js', dest: 'target/app/constants/constants.js'},
                    {src: 'target/index.html', dest: 'target/index.html'}
                ]
            },
            dev : {
                options : {
                    context : {
                        ENV : 'dev',
                        HOME_PAGE: "http://localhost/",
                        COOKIE_NAME: "sessionID_local"
                    }
                },
                files: [
                    {src: 'target/app/constants/constants.js', dest: 'target/app/constants/constants.js'},
                    {src: 'target/index.html', dest: 'target/index.html'}
                ]
            }
        }
    });

    grunt.registerTask("build", "Builds webapp", function() {
        grunt.task.run("clean:target");
        grunt.task.run("copy:create_structure");
        grunt.task.run("preprocess:local");
        grunt.task.run("handlebars");

        grunt.task.run("browserify:vendors");
        grunt.task.run("browserify:app");

    });

    grunt.registerTask("build-dev", "Builds webapp", function() {
        grunt.task.run("clean:target");
        grunt.task.run("copy:create_structure");
        grunt.task.run("preprocess:dev");
        grunt.task.run("handlebars");

        grunt.task.run("browserify:vendors");
        grunt.task.run("browserify:app");

        grunt.task.run("uglify:min_all");
        grunt.task.run("clean:js");

        //grunt.task.run("cssmin:min_all");
        //grunt.task.run("clean:css");
        grunt.task.run("clean:directories");

        grunt.task.run("cacheBust");

    });

};
