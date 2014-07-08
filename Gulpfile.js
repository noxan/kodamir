var path = require('path');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();


var CONFIG = {
  targetDirectory: 'build',
  scripts: {
    sourceDirectory: 'client/scripts',
    sourceFiles: 'client/scripts/**/*.js',
    sourceFile: 'client/scripts/app.js',
    targetDirectory: 'build/scripts'
  },
  styles: {
    sourceDirectory: 'client/styles',
    sourceFiles: 'client/styles/**/*.styl',
    targetDirectory: 'build/styles',
    targetFilename: 'app.css'
  },
  views: {
    sourceFiles: 'client/**/*.jade',
    targetDirectory: 'build'
  },
  server: {
    port: 8080
  },
  production: function() {
    return !(typeof $.util.env.production === 'undefined');
  }
}


gulp.task('views', function() {
  gulp.src(CONFIG.views.sourceFiles)
    .pipe($.plumber())
    .pipe($.jade({pretty: true}))
    .pipe($.if(CONFIG.production, $.minifyHtml()))
    .pipe(gulp.dest(CONFIG.views.targetDirectory));
});

gulp.task('scripts', ['jshint'], function() {
  gulp.src(CONFIG.scripts.sourceFile)
    .pipe($.plumber())
    .pipe($.browserify())
    .pipe($.if(CONFIG.production, $.uglify()))
    .pipe(gulp.dest(CONFIG.scripts.targetDirectory));
});

gulp.task('jshint', function() {
  gulp.src(CONFIG.scripts.sourceFiles)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('styles', function() {
  gulp.src(CONFIG.styles.sourceFiles)
    .pipe($.plumber())
    .pipe($.concat('_concat.styl'))
    .pipe($.stylus())
    .pipe($.if(CONFIG.production, $.minifyCss()))
    .pipe($.rename(CONFIG.styles.targetFilename))
    .pipe(gulp.dest(CONFIG.styles.targetDirectory));
});

gulp.task('webserver', function() {
  gulp.src(CONFIG.targetDirectory).pipe($.webserver({
    port: 8080,
    livereload: true
  }));
});

gulp.task('watch', function() {
  gulp.watch(CONFIG.views.sourceFiles, ['views']);
  gulp.watch(CONFIG.scripts.sourceFiles, ['scripts']);
  gulp.watch(CONFIG.styles.sourceFiles, ['styles']);
});

gulp.task('build', ['views', 'scripts', 'styles'])

gulp.task('default', ['views', 'scripts', 'styles', 'watch', 'webserver']);
