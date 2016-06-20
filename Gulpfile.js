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
  var runSass = function (ad_type) {
    return gulp.src(['src/**/*.scss', '!src/*.scss'])
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(gulp.dest('prod/' + ad_type));
  }
  runSass('GDN');
  runSass('DoubleClick');
});


gulp.task('html', function() {
  var runHtml = function (ad_type) {
    return gulp.src('src/**/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('prod/' + ad_type));
  }
  runHtml('GDN');
  runHtml('DoubleClick');
});


gulp.task('watch', function () {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.js', ['scripts']);
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

   var runTasks = function (ad_type) {
     var tasks = folders.map(function(folder) {

        return gulp.src([path.join(scriptsPath, folder, '/**/' + ad_type + '.js'), path.join(scriptsPath, folder, '/**/main.js')])
          // concat into foldername.js
          .pipe(concat(folder + '.js'))
          // minify
          .pipe(uglify())
          // rename to folder.min.js
          .pipe(rename(folder + '-' + ad_type + '.min.js'))
          // write to output again
          .pipe(gulp.dest('prod/' + ad_type + '/' + folder));
      });
   };

   runTasks('GDN');
   runTasks('DoubleClick');
});

gulp.task('default', ['watch', 'html', 'sass', 'scripts']);
