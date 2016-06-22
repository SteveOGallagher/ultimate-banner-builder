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
    connect  = require('gulp-connect-multi')(),
    removeCode = require('gulp-remove-code'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint   = require('gulp-jshint'),   
    uncss    = require('gulp-uncss'),
    sassLint = require('gulp-sass-lint'),
    cache = require('gulp-cache'),
    zip = require('gulp-zip'),

    data = require('./sizes.json');
    scriptsPath = 'src',
    folders  = getFolders(scriptsPath);


//function createBrand() {
  //fs.mkdir('src/'+ data.name);
//}

//gulp.task('brand', function() {
  //return createBrand();
//});


gulp.task('sass', function () {
  var runSass = function (ad_type) {
    return gulp.src(['src/**/*.scss', '!src/*.scss'])
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
      //.pipe(uncss({ html: 'index.html' }))
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('prod/' + ad_type));
  }
  runSass('GDN');
  runSass('DoubleClick');
});

gulp.task('html', function() {
  var runHtml = function (ad_type) {
    if (ad_type == 'GDN') {
      return gulp.src('src/**/*.html')
        .pipe(removeCode({ gdn: true }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('prod/' + ad_type));
      } else {
        return gulp.src('src/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('prod/' + ad_type));
      }
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
  var folder; //this is the folder with the size name
  var version = data.versions[0];
  var runTasks = function (ad_type) {
    var tasks = folders.map(function(folder) {
      var adPath = 'prod/' + ad_type + '/' + folder;
      var ad = gulp.src([path.join(scriptsPath, folder, '/**/' + ad_type + '.js'), path.join(scriptsPath, folder, '/**/main.js')])
        //.pipe(jshint())
        //.pipe(jshint.reporter('jshint-stylish'))
        //.pipe(sourcemaps.init())
        .pipe(concat(folder + '.js'))
        //.pipe(uglify())
        .pipe(rename('ad.js'))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(adPath));

    
      if (ad_type === 'GDN') {
        var type = 'src/' + folder + '/' + ad_type;
        var typeFolder = getFolders(type); //GDN or DoubleClick
        return typeFolder.map(function(versionFolder) {
          return gulp.src([path.join(adPath, 'ad.js'), path.join(versionFolder, 'image-path.js')])
            .pipe(concat(versionFolder + '.js'))
            .pipe(rename(versionFolder + '.js'))
            .pipe(gulp.dest(adPath));

            });
      }

    });

  };

  runTasks('GDN');
  runTasks('DoubleClick');
});


gulp.task('img', function() {
   return gulp.src('src/**/img/*')
     .pipe(image())
     .pipe(gulp.dest('prod/GDN')) 
     .pipe(connect.reload());
});

gulp.task('del', function () {
  return del([
    'src',
    'prod'
  ]);
});


gulp.task('connect', connect.server({
  root: ['./prod/'],
  port: 8000,
  livereload: true,
  open: {
    browser: 'Google Chrome'
  }
}));

gulp.task('clear', function() {
  cache.clearAll();
});

 
gulp.task('zip', function() {
	return gulp.src('prod/GDN/**')
		.pipe(zip('GDN.zip'))
		.pipe(gulp.dest('zipped-GDN'));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', ['scripts']);
  gulp.watch(['src/**/img', 'src/**/img/*'], ['img']);
  //gulp.watch('src/**/img/*', ['img']);
});

gulp.task('default', ['watch', 'html', 'sass', 'scripts', 'img', 'connect']);

