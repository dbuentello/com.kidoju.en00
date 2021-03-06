/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

module.exports = grunt => {
    /**
     * Unfortunately, we cannot use grunt-env to set the environment
     * - webpack uses a DefinePlugin which reads process.env.NODE_ENV
     * - nconf reads process.env.NODE_ENV
     * Both read the environment variable before grunt-env can set it in the grunt process.
     * So we have not other way than to actually set NODE_ENV in the OS to produce a build
     * especially set NODE_ENV=production for a production build.
     */

    if (process.env.NODE_ENV) {
        // eslint-disable-next-line no-console
        console.log(`grunt environment is ${process.env.NODE_ENV}`);
    } else {
        // eslint-disable-next-line no-console
        console.log(
            'IMPORTANT: grunt environment is undefined. Use the `build.cmd` script'
        );
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            options: {
                processContentExclude: ['**/*.js']
            },
            bluebird: {
                src: './js/vendor/bluebird/bluebird.core.min.js',
                dest: './www/build/bluebird.core.min.js'
            },
            jquery: {
                src: './js/vendor/jquery/jquery-3.3.1.min.js',
                dest: './www/build/jquery.min.js'
            },
            workerlib: {
                src: './webapp/public/build/workerlib.bundle.js',
                dest: './www/build/workerlib.bundle.js'
            }
        },
        eslint: {
            files: ['*.js', './hooks/*.js', './js/**/*.es6'],
            options: {
                config: '.eslintrc'
            }
        },
        jscs: {
            files: [
                'js/**/app.*.js',
                'js/**/*.jsx',
                'test/**/*.js',
                'webapp/**/*.js'
            ],
            options: {
                config: '.jscsrc',
                excludeFiles: [
                    '*.js',
                    'js/kidoju.*.js',
                    'js/vendor/**/*.js',
                    'test/vendor/**/*.js',
                    'webapp/public/**/*.js'
                ]
            }
        },
        jshint: {
            files: [
                'js/**/app.*.js',
                'js/**/*.jsx',
                'test/**/*.js',
                'webapp/**/*.js'
            ],
            options: {
                // .jshintignore does ot work with grunt-contrib-jshint
                ignores: [
                    '*.js',
                    'js/kidoju.*.js',
                    'js/vendor/**/*.js',
                    'test/vendor/**/*.js',
                    'webapp/public/**/*.js'
                ],
                jshintrc: true
            }
        },
        /*
        // Kendo Lint is now obsolete
        kendo_lint: {
            files: ['src/js/app*.js']
        },
        */
        mocha: {
            // In browser (phantomJS) unit tests
            browser: {
                options: {
                    log: true,
                    logErrors: true,
                    reporter: 'Spec',
                    run: true,
                    timeout: 5000
                },
                src: ['test/browser/**/*.html']
            }
        },
        mochaTest: {
            // In node (Zombie) unit tests
            node: {
                options: {
                    quiet: false,
                    reporter: 'spec',
                    timeout: 10000,
                    ui: 'bdd'
                },
                src: ['test/node/**/*.js']
            }
        },
        nsp: {
            package: grunt.file.readJSON('package.json')
        },
        stylelint: {
            options: {
                configFile: '.stylelintrc'
            },
            src: ['styles/**/*.{css,less,scss}']
        },
        uglify: {
            build: {
                options: {
                    banner:
                        '/*! <%= pkg.copyright %> - Version <%= pkg.version %> dated <%= grunt.template.today() %> */',
                    sourceMap: false
                    // sourceMap: true,
                    // sourceMapName: 'webapp/public/build/workerlib.bundle.js.map'
                },
                files: {
                    'webapp/public/build/workerlib.bundle.js': [
                        'js/kidoju.data.workerlib.js'
                    ]
                }
            }
        },
        webdriver: {
            // Selenium functional tests
            appium: {
                configFile: './wdio.appium.conf.js'
            },
            selenium: {
                configFile: './wdio.selenium.conf.js'
            }
        },
        webpack: {
            // @see https://github.com/webpack/webpack-with-common-libs/blob/master/Gruntfile.js
            options: webpackConfig,
            build: {
                cache: false,
                devtool: false,
                plugins: webpackConfig.plugins.concat(
                    new webpack.BannerPlugin({
                        banner:
                            '/*! <%= pkg.copyright %> - Version <%= pkg.version %> dated <%= grunt.template.today() %> */',
                        raw: true
                        // entryOnly: true
                    })
                )
            }
        }
    });

    // Load npm tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-jscs');
    // grunt.loadNpmTasks('grunt-kendo-lint');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nsp');
    grunt.loadNpmTasks('grunt-stylelint');
    grunt.loadNpmTasks('grunt-webdriver');
    grunt.loadNpmTasks('grunt-webpack');

    // Commands
    grunt.registerTask('lint', [
        'eslint',
        'jscs',
        'jshint',
        'stylelint',
        'nsp'
    ]); // , 'kendo_lint']);
    grunt.registerTask('build', ['webpack:build', 'uglify:build', 'copy']);
    // grunt.registerTask('test', ['mocha', 'mochaTest', 'webdriver']);
    grunt.registerTask('test', ['mocha', 'mochaTest']);
    grunt.registerTask('default', ['lint', 'build', 'test']);
};
