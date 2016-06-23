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
    es = require('event-stream'),

    data = require('./sizes.json');
    scriptsPath = 'src',
    folders  = getFolders(scriptsPath);

const appRoot = process.cwd();
const sizesFile = fs.readFileSync(`${appRoot}/sizes.json`, `utf8`);
let sizes = JSON.parse(sizesFile);
var GDN = sizes.GDN;


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
  
  runSass('DoubleClick');
  if (GDN === "true") {
    runSass('GDN');
  };
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

  runHtml('DoubleClick');
  if (GDN === "true") {
    runHtml('GDN');
  };
});


function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
  });
}


gulp.task('scripts', function() {
  var sizeFolder; //this is the sizeFolder with the size name
  var runTasks = function (ad_type) {
    var tasks = folders.map(function(sizeFolder) {
      var adPath = 'prod/' + ad_type + '/' + sizeFolder;
      var ad = gulp.src([path.join(scriptsPath, sizeFolder, '/**/' + ad_type + '.js'), path.join(scriptsPath, sizeFolder, '/**/main.js')])
        //.pipe(jshint())
        //.pipe(jshint.reporter('jshint-stylish'))
        //.pipe(sourcemaps.init())
        .pipe(concat(sizeFolder + '.js'))
        //.pipe(uglify())
        .pipe(rename('ad.js'))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(adPath));

    
      if (ad_type === 'GDN') {
        var type = 'src/' + sizeFolder + '/' + ad_type;
        var typeFolder = getFolders(type); //GDN or DoubleClick
        return typeFolder.map(function(versionFolder) {
          var sizeAndVersion = 'prod/' + ad_type + '/' +  sizeFolder + '-' + versionFolder;

          return es.merge(
            gulp.src([path.join(adPath, 'ad.js'), path.join(type, versionFolder, 'image-paths.js')])
              .pipe(concat(versionFolder + '.js'))
              .pipe(rename(versionFolder + '.js')), 
            gulp.src(adPath + '/*')
          )
            .pipe(gulp.dest(sizeAndVersion));
            //return del(adPath);
        });
      }

    });
  };
  
  runTasks('DoubleClick');
  if (GDN === "true") {
    runTasks('GDN');
  };
});



gulp.task('img', function() {
  if (GDN === "true") {
   return gulp.src('src/**/img/*')
     .pipe(image())
     .pipe(gulp.dest('prod/GDN')) 
     .pipe(connect.reload());
  }
});

gulp.task('del', function () {
  return del([
    'src',
    'prod'
  ]);
});

// Overwrite base-template files with approved Master adjustments
gulp.task('master', function() {
  var sources = [
    'src/**/index.html',
    'src/**/main.js',
    'src/global.scss',
    'src/normalize.scss'
  ];
  function copyScripts (source) {
    return gulp.src(source)
      .pipe(rename(function (path) {path.dirname = "/";}))
      .pipe(gulp.dest('./base-template'))
  };
  copyScripts(sources);
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
});

gulp.task('default', ['watch', 'html', 'sass', 'scripts', 'img', 'connect']);

