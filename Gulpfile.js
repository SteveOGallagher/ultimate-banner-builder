var gulp     = require('gulp'),
    watch    = require('gulp-watch'),
    sass     = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    fs       = require('fs'),
    path     = require('path'),
    merge    = require('merge-stream'),
    uglify   = require('gulp-uglify'),
    concat   = require('gulp-concat'),
    rename   = require('gulp-rename');


gulp.task('sass', function () {
  return gulp.src(['src/**/*.scss', '!src/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('prod'));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.scss', ['sass']);
});


var scriptsPath = 'src';

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
  });
}


gulp.task('scripts', function() {
  var folder;
  var folders = getFolders(scriptsPath);

  var tasks = folders.map(function(folder) {
    return gulp.src(path.join(scriptsPath, folder, '/**/*.js'))
      // concat into foldername.js
      .pipe(concat(folder + '.js'))
      // minify
      .pipe(uglify())
      // rename to folder.min.js
      .pipe(rename(folder + '.min.js'))
      // write to output again
      .pipe(gulp.dest('prod/' + folder));
    });

    // process all remaining files in scriptsPath root into main.js and main.min.js files
  var root = gulp.src(path.join(scriptsPath, '/*.js'))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('prod/' + folder));

  return merge(tasks, root);
});

gulp.task('default', ['watch', 'sass', 'scripts']);

