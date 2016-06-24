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

    data = require('./sizes.json'),
    src = 'src',
    folders  = getFolders(src);

const appRoot = process.cwd();
const sizesFile = fs.readFileSync(`${appRoot}/sizes.json`, `utf8`);
var sizes = JSON.parse(sizesFile);
var GDN = sizes.GDN;

// Get folder names inside a given directory (dir)
function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
  });
}


//loop through the folders to get to the right sub-directories and apply their custom copy tasks to them
function getSubDirectories(fileType, copyFunc) {
  var ad = 'GDN';
  return folders.map(function(sizeFolder) {
    var type = 'src/' + sizeFolder + '/' + ad;
    var typeFolder = getFolders(type); //GDN or DoubleClick
    var root = 'src/' + sizeFolder;
    return typeFolder.map(function(versionFolder) {
      var dest = 'prod/' + ad + '/' +  sizeFolder + '-' + versionFolder;
      var source = fileType === 'scss' ? [root + '/*.' +  fileType, '!src/*.scss'] :
        fileType === 'html' ? root + '/*.' +  fileType :
        fileType === 'img' ? [root + '/' + ad + '/' + versionFolder + '/*',
          '!'+ root + '/' + ad + '/' + versionFolder + '/*.js'] :
        false;
      return copyFunc(source, dest);
    });
  });
}

// Convert scss to css, minimise and copy into appropriate production folders
gulp.task('sass', function () {

  var copyAndPipe = function(gulpSrc, gulpDest) {
    return gulp.src(gulpSrc)
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
      //.pipe(uncss({ html: 'index.html' }))
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(gulpDest));
  };

  var runSass = function (ad_type) {
    if (ad_type === 'GDN') {
      return getSubDirectories('scss', copyAndPipe);
    } else {
      return copyAndPipe(['src/**/*.scss', '!src/*.scss'], 'prod/' + ad_type);
    }
  };
  runSass('DoubleClick');
  if (GDN === "true") {
    runSass('GDN');
  }
});
  

// Minimise html files and copy into appropriate folders. 
// Also remove enabler script tag for GDN versions.
gulp.task('html', function() {

 var copyAndPipe = function (gulpSrc, gulpDest, gdn) {
    return gdn ?
      gulp.src(gulpSrc)
        .pipe(removeCode({ gdn: true }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(gulpDest)) :
      gulp.src(gulpSrc)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(gulpDest));
  };

  var runHtml = function (ad_type) {
    if (ad_type === 'GDN') {
      return getSubDirectories('html', copyAndPipe); 
      } else {
        return copyAndPipe('src/**/*.html', 'prod/' + ad_type, false);
      }
  };

  runHtml('DoubleClick');
  if (GDN === "true") {
    runHtml('GDN');
  }
});

// Combine various javascript files and minimise them before copying into relevant production folders.
gulp.task('scripts', function() {
  
  function copyAndPipe(gulpSrc, gulpDest) {
    return gulp.src(gulpSrc)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(sourcemaps.init())
      .pipe(concat(sizeFolder + '.js'))
      .pipe(uglify())
      .pipe(rename('ad.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(gulpDest));
  }

  var sizeFolder; //this is the sizeFolder with the size name
  var runTasks = function (ad_type) {
  return folders.map(function(sizeFolder) {
    if (ad_type === 'GDN') {
      var type = 'src/' + sizeFolder + '/' + ad_type;
      var typeFolder = getFolders(type); //GDN or DoubleClick
      return typeFolder.map(function(versionFolder) {
        var sizeAndVersion = 'prod/' + ad_type + '/' +  sizeFolder + '-' + versionFolder;
        var fileType = 'js';
        var root = 'src/' + sizeFolder;
        var source = [
          root + '/*.' +  fileType,
          root + '/' + ad_type + '/*.' + fileType,
          root + '/' + ad_type + '/' + versionFolder + '/*.' + fileType 
        ]; 
        return copyAndPipe(source, sizeAndVersion);
      });

      } else {
        var sizeNoVersion = 'prod/' + ad_type + '/' + sizeFolder;
        var source = [ 
          path.join(src, sizeFolder, '/**/' + ad_type + '.js'),
          path.join(src, sizeFolder, '/**/main.js')
        ];
        return copyAndPipe(source, sizeNoVersion);
      }
    });
  };

  runTasks('DoubleClick');
  if (GDN === "true") {
    runTasks('GDN');
  }
});

// Optimise and copy images across into production GDN folders
gulp.task('img', function() {

  var copyAndPipe = function(gulpSrc, gulpDest) {
    return gulp.src(gulpSrc)
     .pipe(image())
     .pipe(gulp.dest(gulpDest));
     //.pipe(connect.reload());
  };

  if (GDN === "true") {
    return getSubDirectories('img', copyAndPipe);
  }
});

// Delete src and prod folders during Gulp development.
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
    'src/**/DoubleClick.js',
    'src/global.scss',
    'src/normalize.scss'
  ];
  function copyScripts (source) {
    return gulp.src(source)
      .pipe(rename(function (path) {path.dirname = "/";}))
      .pipe(gulp.dest('./base-template'));
  }
  copyScripts(sources);
});

// Setup localhost server to view production files.
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

// Zip the GDN folder and zip all individual GDN banner 
gulp.task('zip', function() {
  var folders = getFolders('prod/GDN');
  function applyZip(source, name) {
  	return gulp.src(source)
  		.pipe(zip(name + '.zip'))
  		.pipe(gulp.dest('zipped-GDN'));
  }
  applyZip('prod/GDN/**', 'GDN');
  for (var folder in folders) {
    console.log(folders[folder]);
    applyZip('prod/GDN/' + folders[folder] + '/**',folders[folder].toString());
  }
});

// Setup watch tasks
gulp.task('watch', function () {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', ['scripts']);
  gulp.watch(['src/**/img', 'src/**/img/*'], ['img']);
});

gulp.task('default', ['connect', 'html', 'sass', 'img', 'scripts', 'watch']);


