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
    htmlmin = require('gulp-htmlmin');


gulp.task('sass', function () {
  return gulp.src(['src/**/*.scss', '!src/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('prod'));
});


gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('prod'));
});


gulp.task('watch', function () {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
});


var scriptsPath = 'src';

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
  });
}


function runTask(type) {
  var folder;
  var folders = getFolders(scriptsPath);

  var tasks = folders.map(function(folder) {
    return gulp.src([path.join(scriptsPath, folder, '/**/' + type + '/' + type + '.js'), path.join(scriptsPath, folder, '/**/main.js') ] )
      // concat into foldername.js
      .pipe(concat(folder + '.js'))
      // minify
      .pipe(uglify())
      // rename to folder.min.js
      .pipe(rename(folder + '.min.js'))
      // write to output again
      .pipe(gulp.dest('prod/' + folder));
    });

  return tasks;
}

gulp.task('static-scripts', function() {
  runTask('static')

});

gulp.task('dynamic-scripts', function() {
  runTask('dynamic')
});



gulp.task('default', ['watch', 'html', 'sass', 'scripts']);
