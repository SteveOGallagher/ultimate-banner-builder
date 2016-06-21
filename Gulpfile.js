var gulp     = require('gulp'),
    watch    = require('gulp-watch'),
    sass     = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    htmlmin  = require('gulp-htmlmin'),
    uglify   = require('gulp-uglify'),
    concat   = require('gulp-concat'),
    image    = require('gulp-image'),
    rename   = require('gulp-rename'),
    merge    = require('merge-stream'),
    fs       = require('fs'),
    path     = require('path'),
    del      = require('del'),
    connect = require('gulp-connect-multi')(),
    
    scriptsPath = 'src',
    folders  = getFolders(scriptsPath);

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

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
  });
}


gulp.task('scripts', function() {
var folder;

  var runTasks = function (ad_type) {
  var tasks = folders.map(function(folder) {
    return gulp.src([path.join(scriptsPath, folder, '/**/' + ad_type + '.js'), path.join(scriptsPath, folder, '/**/main.js')])
      .pipe(concat(folder + '.js'))
      .pipe(uglify())
      .pipe(rename(folder + '-' + ad_type + '.min.js'))
      .pipe(gulp.dest('prod/' + ad_type + '/' + folder));
    });
  };

   runTasks('GDN');
   runTasks('DoubleClick');
});

gulp.task('img', function() {
   return folders.map(function() {
     return gulp.src('src/**/img/*')
       .pipe(image())
       .pipe(gulp.dest('prod/GDN/'));
   });
});


gulp.task('del', function () {
  return del([
    'src',
    'prod'
  ]);
});


gulp.task('connect', connect.server({
  root: ['./src/'],
  port: 8000,
  livereload: true,
  open: {
    browser: 'Google Chrome'
  }
}));


gulp.task('watch', function () {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.js', ['scripts']);
  gulp.watch('src/**/img/*', ['img']);
});

gulp.task('default', ['watch', 'html', 'sass', 'scripts', 'img', 'connect']);

