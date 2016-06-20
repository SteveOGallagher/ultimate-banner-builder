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

gulp.task('default', ['watch', 'sass', 'scripts']);
