/**
 * gulpの設定ファイル
 */


/*
 * init package
 */
var gulp = require("gulp");
var gulpSequence = require('gulp-sequence');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var size = require('gulp-size');


/*
 * path
 */
var path = {
  src: 'src/',
  tmp: 'tmp/',
  dist: 'docs/',
  css_src: 'src/css/',
  js_src: 'src/js/',
  img_src: 'src/img/',
  sprite_src: 'src/sprite/'
};


/*
 * del
 */
var del = require('del');
gulp.task('del', function () {
  return del([path.tmp, path.dist]);
});


/*
 * sprite
 */
var spritesmith = require('gulp.spritesmith');
gulp.task('sprite', function () {
  var spriteData = gulp.src(path.sprite_src + '*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.css',
      imgPath: '../img/sprite.png',
      cssFormat: 'scss',
      padding: 4,
      cssOpts: {
        functions: false
      }
    }));

  spriteData.img.pipe(gulp.dest(path.img_src));
  spriteData.css
    .pipe(gulp.dest(path.css_src + 'setting/var/'))
    .pipe(size({
      title: 'size : sprite'
    }));
});


/*
 * image optim
 */
var imageOptim = require('gulp-imageoptim');
gulp.task('image', function() {
  return gulp.src(path.img_src + '**/*.{png,jpg,gif}')
    .pipe(imageOptim.optimize())
    .pipe(gulp.dest(path.img_src));
});


/*
 * css
 */
var postcss = require('gulp-postcss');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
gulp.task('build:css', function () {
  return gulp.src(path.css_src + '*.css')
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(postcss([
      precss(),
      autoprefixer({
        browsers: ['last 2 version', 'ie >= 9'],
        cascade: false
      })
    ]))
    .pipe(gulp.dest(path.tmp + 'css/'))
    .pipe(postcss([
      cssnano({
        minifyFontValues: {
          removeQuotes: false
        }
      })
    ]))
    .pipe(gulp.dest(path.dist + 'css/'))
    .pipe(size({
      title: 'size : css'
    }))
});

/*
 * js
 */
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
gulp.task('build:js', function() {
  return gulp.src(path.js_src + '**/*.js')
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(babel())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(path.tmp + 'js/'))
    .pipe(uglify())
    .pipe(gulp.dest(path.dist + 'js/'))
    .pipe(size({
      title: 'size : js'
    }));;
});

// eslint
// var eslint = require('gulp-eslint');
// gulp.task('eslint', function () {
//   return gulp.src(path.js_src + '**/*.js')
//     .pipe(plumber({
//       errorHandler: notify.onError('<%= error.message %>')
//     }))
//     .pipe(eslint())
//     .pipe(eslint.format());
//     // .pipe(eslint.failAfterError());
// });


/*
 * copy
 */
gulp.task('copy', function () {
 return gulp.src(
   [
     path.src + '**/*.html',
     path.img_src + '**/*.{png,jpg,gif}'
   ],
   {base: path.src}
 )
 .pipe(plumber({
   errorHandler: notify.onError('<%= error.message %>')
 }))
 .pipe(gulp.dest(path.dist))
 .pipe(size({
   title: 'size : copy'
 }));
});


/*
 * browserSync
 */
var browserSync = require('browser-sync');
gulp.task('browserSync', function () {
  browserSync({
    notify: false,
    server: {
      baseDir: path.dist
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});


/*
 * watch
 */
gulp.task('watch', ['browserSync'], function () {
  gulp.watch(path.src + '**/*.html', ['copy']);
  gulp.watch(path.css_src + '**/*.css', ['build:css']);
  gulp.watch(path.js_src + '**/*.js', ['build:js']);
  gulp.watch(path.img_src + '**/*.{png,jpg,gif}', ['copy']);
  gulp.watch('gulpfile.js', ['build']);
  gulp.watch(path.src + '**/*', ['bs-reload']);
});


/*
 * task manage
 */
// build
gulp.task('build', function () {
  gulpSequence('del', 'copy', 'build:css', 'build:js')();
});

// default
gulp.task('default', function () {
  gulpSequence('build')();
});

// serve
gulp.task('serve', function () {
  gulpSequence('build', 'watch')();
});
