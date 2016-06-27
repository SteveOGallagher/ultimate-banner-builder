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
var DoubleClick = sizes.DoubleClick;
var Dynamic = sizes.Dynamic;
var Master = sizes.Master;
var Static = sizes.Static;

// Get folder names inside a given directory (dir)
function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
  });
}

function checkSettingsAndRun (setting, execute, usingPath) {
  if (setting === true) {
    execute(usingPath);
  };
}

//loop through the folders to get to the right sub-directories and apply their custom copy tasks to them
var sizeFolder;
function getSubDirectories(fileType, copyFunc, static) {
  return folders.map(function(sizeFolder) {
    var ad;
    if (Master && Static && !DoubleClick ||
        !Master && Static) {
    ad = 'static';
    var type = 'src/' + sizeFolder + '/' + ad;
    var typeFolder = getFolders(type); // Static or Dynamic
    var root = 'src/' + sizeFolder;
    return typeFolder.map(function(versionFolder) {
      var dest = 'prod/' + ad + '/' +  sizeFolder + '-' + versionFolder;
      var source = fileType === 'scss' ? [root + '/*.' +  fileType, '!src/*.scss'] :
        fileType === 'html' ? root + '/*.' +  fileType :
        fileType === 'img' ? [root + '/' + ad + '/' + versionFolder + '/**/*',
          '!'+ root + '/' + ad + '/' + versionFolder + '/*.js'] :
        fileType === 'js' ? [
          root + '/*.' +  fileType,
          root + '/' + ad + '/*.' + fileType,
          root + '/' + ad + '/' + versionFolder + '/*.' + fileType 
        ] : 
        false;
        console.log(source);
      return copyFunc(source, dest);
    });

    } else {
      ad = 'doubleclick';
      var dest = 'prod/' + ad + '/' + sizeFolder;
      var source = 
      fileType === 'js' ? [ 
          path.join(src, sizeFolder, '/**/' + ad + '.js'),
          path.join(src, sizeFolder, '/**/main.js')
        ] : 
        [ 
        path.join(src, sizeFolder, ad, '/**/*.jpg'),
        path.join(src, sizeFolder, ad, '/**/*.png')
      ];
      return copyFunc(source, dest);
    }
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
    if (Master && Static && !DoubleClick ||
        !Master && Static) {
      return getSubDirectories('scss', copyAndPipe, true);
    } else if (ad_type == "doubleclick") {
      return copyAndPipe(['src/**/*.scss', '!src/*.scss'], 'prod/' + ad_type);
    }
  };

  checkSettingsAndRun (Static, runSass, 'static');
  checkSettingsAndRun (DoubleClick, runSass, 'doubleclick');
});
  

// Minimise html files and copy into appropriate folders. 
// Also remove enabler script tag for GDN versions.
gulp.task('html', function() {

 var copyAndPipe = function (gulpSrc, gulpDest, static) {
    return static ?
      gulp.src(gulpSrc)
        .pipe(removeCode({ static: true }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(gulpDest)) :
      gulp.src(gulpSrc)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(gulpDest));
  };

  var runHtml = function (ad_type) {
    if (Master && Static && !DoubleClick ||
        !Master && Static) {
      return getSubDirectories('html', copyAndPipe, true); 
      } else if (ad_type == "doubleclick") {
        return copyAndPipe('src/**/*.html', 'prod/' + ad_type, false);
      }
  };

  checkSettingsAndRun (Static, runHtml, 'static');
  checkSettingsAndRun (DoubleClick, runHtml, 'doubleclick');
});

// Combine various javascript files and minimise them before copying into relevant production folders.
gulp.task('scripts', function() {
  
  var copyAndPipe = function(gulpSrc, gulpDest) {
    return gulp.src(gulpSrc)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(sourcemaps.init())
      .pipe(concat(sizeFolder + '.js'))
      .pipe(uglify())
      .pipe(rename('ad.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(gulpDest));
  };

  var runJS = function (ad_type) {
    if (ad_type === 'static') {
      return getSubDirectories('js', copyAndPipe, true);
    } else {
      return getSubDirectories('js', copyAndPipe, false);
    }
  };

  checkSettingsAndRun (Static, runJS, 'static');
  checkSettingsAndRun (DoubleClick, runJS, 'doubleclick');
});

// Optimise and copy images across into production GDN folders
gulp.task('img', function() {

  var copyAndPipe = function(gulpSrc, gulpDest) {
    return gulp.src(gulpSrc)
     .pipe(image())
     .pipe(gulp.dest(gulpDest));
     //.pipe(connect.reload());
  };

  if (Static === true) {
    getSubDirectories('img', copyAndPipe, true);
  }
  if (DoubleClick === true && Dynamic === false) {
    getSubDirectories('img', copyAndPipe, false);
  }
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

// Zip the static folder and zip all individual static banners 
gulp.task('zip', function() {
  var folders = getFolders('prod/static');
  function applyZip(source, name) {
  	return gulp.src(source)
  		.pipe(zip(name + '.zip'))
  		.pipe(gulp.dest('zipped-banners'));
  }
  applyZip('prod/static/**', 'static');
  for (var folder in folders) {
    console.log(folders[folder]);
    applyZip('prod/static/' + folders[folder] + '/**',folders[folder].toString());
  }
});

// Overwrite base-template files with approved Master adjustments
gulp.task('master', function() {
  var sources = [
    'src/**/index.html',
    'src/**/main.js',
    'src/global.scss',
    'src/normalize.scss'
  ];
  Doubleclick === true ?  sources.push('src/**/doubleclick.js') : sources.push('src/**/image-paths.js')

  function copyScripts (source) {
    return gulp.src(source)
      .pipe(rename(function (path) {path.dirname = "/";}))
      .pipe(gulp.dest('./base-template'));
  }
  copyScripts(sources);
});


// Delete src and prod folders during Gulp development.
gulp.task('del', function () {
  return del([
    'src',
    'prod'
  ]);
});


// Setup watch tasks
gulp.task('watch', function () {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', ['scripts']);
  gulp.watch(['src/**/img', 'src/**/img/*'], ['img']);
});

gulp.task('default', ['connect', 'html', 'sass', 'img', 'scripts', 'watch']);


