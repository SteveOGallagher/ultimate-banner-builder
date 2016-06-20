var gulp = require('gulp'),
    watch = require('gulp-watch');
    sass = require('gulp-sass');
    cleanCSS = require('gulp-clean-css');


gulp.task('sass', function () {
  return gulp.src(['src/**/*.scss', '!src/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('prod'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('src/**/*.scss', ['sass']);
});

 
