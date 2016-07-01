/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |

var elixir = require('laravel-elixir');
elixir(function(mix) {
    mix.sass('app.scss');
});
 */
/*
$ npm install rimraf -g $ rimraf node_modules
$ npm install gulp -g
$ npm init
$ npm install gulp gulp-useref gulp-if gulp-uglify gulp-cssnano del gulp-livereload gulp-clean gulp-replace gulp-htmlmin gulp-git gulp-util vinyl-ftp yargs fs --save-dev
*/
var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    livereload = require('gulp-livereload'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    htmlmin = require('gulp-htmlmin'),
    // fileCache = require('gulp-filter-cache'),
    git = require('gulp-git'), // git
    gutil = require('gulp-util'), // log
    ftp = require('vinyl-ftp'), // ftp
    argv = require('yargs').argv, // pass arguments
    fs = require('fs'); // load file
;
// Paths variables
var paths = {
    'local': {
        'project': 'mycore',
        'domain':'amploconsulting.com',
        'root': 'E:/xampp/htdocs/',
    },
    'dev': {
        'css': 'gulpBuild/resources/assets/css',
        'js': 'gulpBuild/resources/assets/js',
        'font': 'gulpBuild/resources/assets/fonts',
        'view': 'gulpBuild/resources/views',
        // 'localgulp': 'D:/xampp/htdocs/signalgulp/resources',
    },
    'assets': {
        'css': 'resources/assets/css',
        'js': 'resources/assets/js',
        'font': 'resources/assets/fonts/**/*',
        'view': 'resources/views/**/*.php',
    }
};
gulp.task('hello', function() {
    console.log('!' + paths.local.root + paths.local.project + '_min/amir/**/*');
});

/*
 * upload modified git with ftp
 */
// function to upload to ftp server
function upload(list) {
    var conn = ftp.create({
        host: 'ftp.'+ paths.local.domain, // ftp host name
        user: paths.local.project +'@'+ paths.local.domain, // ftp username
        password: '@m!r'+ paths.local.project +'A7', // ftp password
        parallel: 7,
        log: gutil.log
    });
    var remotePath = '/'; // the remote path on the server you want to upload to
    // added and modified files
    var changes = list.reduce(function(a, cur) {
        if (cur.type !== 'D' && cur.type.length) a.push(cur.path);
        return a || [];
    }, []);
    // deleted files
    var deletes = list.reduce(function(a, cur) {
        if (cur.type === 'D' && cur.type.length) a.push(cur.path);
        return a || [];
    }, []);
    // upload added and modified files
    gulp.src(changes, {
        base: '.',
        buffer: false
    }).pipe(conn.dest(remotePath));
    // delete removes files
    deletes.map(function(d) {
        conn.delete(remotePath + d, function(err) {
            if (err) throw err;
        });
    });
}
gulp.task('ftp-deploy', function() {
    var init = argv.f === undefined ? false : true;
    var separator;
    var tag;
    if (init) {
        separator = ' ';
        upload_list('ls-files -t');
    } else {
        separator = '\t';
        return git.exec({
            args: 'describe --tags'
        }, function(err, tagc) {
            if (err) throw err;
            tag = tagc.trim().slice(0, 8);
            upload_list('diff --name-status ' + tag + ' ' + 'HEAD');
        });
    }

    function upload_list(git_command) {
        // get diffs between local and remote.
        // max buffer 1024 * 1024
        return git.exec({
            args: git_command,
            maxBuffer: 1024 * 1024
        }, function(err, stdout) {
            if (err) throw err;
            var list = stdout;
            // fs.writeFileSync('gulpfile-ftpignore.json',list);
            list = list.trim().split('\n').map(function(line) {
                var a = line.split(separator);
                return {
                    type: a[0],
                    path: a[1]
                };
            });
            var ftpignore = ['.bowerrc', '.env', '.env.example', '.gitattributes', '.gitignore', '.htaccess', '.jshintrc', 'artisan', 'composer.json', 'composer.lock', 'gulpfile.js', 'package.json', 'phpunit.xml', 'README.md'];
            // var ftpignore = fs.readFileSync('gulpfile-ftpignore.json');
            list = list.filter(function(x) {
                return ftpignore.indexOf(x.path) < 0
            });
            // save last list to cache
            // fs.writeFileSync('gulpfile-ftp-git-cache.json', JSON.stringify(list));
            // append last tag git to list
            list.push({
                type: 'M',
                path: '.git/refs/tags/' + tag
            });
            // console.log(list); process.exit();
            return upload(list);
        });
    }
});
/* clean up css and js and html */
gulp.task('useref', ['clean'], function() {
    return gulp.src(paths.assets.view).pipe(replace("{{ asset('resources/assets') }}", 'resources/assets'))
        .pipe(useref())
        /* Minifies only if it's a JavaScript file
        <!--build:js(./)  ../assets/js/general-javascript.js -->
            <script src="{{ asset('resources/assets') }}/js/jquery.min.js"></script>
            <script src="{{ asset('resources/assets') }}/js/menu.js"></script>
        <!-- endbuild -->
        */

        .pipe(gulpIf('*.js', uglify()))
        /* Minifies only if it's a CSS file
        <!-- build:css(./)  ../assets/css/general-head.css -->
            <link rel="stylesheet" href="{{ asset('resources/assets') }}/css/style1.css">
            <link rel="stylesheet" href="{{ asset('resources/assets') }}/css/style2.css">
        <!-- endbuild -->
        */
        
        .pipe(gulpIf('*.css', cssnano())).pipe(gulp.dest(paths.dev.view)).pipe(replace('../assets', "{{ asset('resources/assets') }}"))
        .pipe(gulpIf('*.php', htmlmin({
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            minifyJS: true,
        }))).pipe(gulpIf('*.php', gulp.dest(paths.dev.view)))
});
gulp.task('htmlmin', ['clean'], function() {
    return gulp.src(paths.assets.view).pipe(htmlmin({
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // removeComments:        true,
        // minifyJS:              true,
    })).pipe(gulp.dest(paths.dev.view))
});
gulp.task('clean', function() {
    return del.sync(['gulpBuild/resources/**', '!gulpBuild/resources/assets/', '!gulpBuild/resources/views/', ]);
});
// Default task
gulp.task('default', function() {
    gulp.start(['useref']);
});
// git test master
gulp.task('min', ['clean_min'], function() {
    return gulp.src([paths.local.root + paths.local.project + '/**', '!' + paths.local.root + paths.local.project + '/node_modules/**', '!' + paths.local.root + paths.local.project + '/node_modules', '!' + paths.local.root + paths.local.project + '/.git/**', '!' + paths.local.root + paths.local.project + '/.git', '!' + paths.local.root + paths.local.project + '/storage/framework/views/**/*', '!' + paths.local.root + paths.local.project + '/storage/framework/cache/**/*', '!' + paths.local.root + paths.local.project + '/storage/framework/sessions/**/*', '!' + paths.local.root + paths.local.project + '/gulpBuild/**', '!' + paths.local.root + paths.local.project + '/gulpBuild'], {
        dot: true
    }).pipe(gulp.dest(paths.local.root + paths.local.project + '_min'));
});
gulp.task('clean_min', ['useref'], function() {
    return del([
        paths.local.root + paths.local.project + '_min/**', '!' + paths.local.root + paths.local.project + '_min'
        // ,'!'+paths.local.root+paths.local.project+'_min/amir/**'
        , '!' + paths.local.root + paths.local.project + '_min/.git/**'
    ], {
        force: true,
        dot: true
    });
});
gulp.task('copy_gulpBuild', ['min'], function() {
    return gulp.src([paths.local.root + paths.local.project + '/gulpBuild/**'], {
        dot: true
    }).pipe(gulp.dest(paths.local.root + paths.local.project + '_min'));
});
// Watch
gulp.task('watch', function() {
    var livereloadPage = function() {
        // Reload the whole page
        livereload.reload();
    };
    // Watch .blade lang files
    gulp.watch(paths.assets.view, livereloadPage);
    gulp.watch('app/helpers.php', livereloadPage);
    gulp.watch('resources/lang/**/*.php', livereloadPage);
    // gulp.watch( paths.assets.css+'/*.css', [useref]);
    gulp.watch('resources/assets/css/*.css');
    gulp.watch('resources/assets/js/*.js');
    // Create LiveReload server
    livereload.listen();
    // Watch any files in dist/, reload on change
    gulp.watch(['resources/assets/**']).on('change', livereload.changed);
    // Watch .css , .js files
});