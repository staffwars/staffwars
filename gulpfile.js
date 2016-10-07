/**
 * gulpの設定ファイル
 */
var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

/** GitHub pagesで公開するためのdocs以下を生成する */
gulp.task('build', function() {
  /* src以下のjsファイルをbabelでトランスパイルしてbundle.jsへまとめる */
  gulp.src('./src/*.js')
    .pipe(babel())
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest('./docs'));

  /* 静的ファイルをdocs以下にコピーする */
  gulp.src([
      './css/**/*',
      './images/**/*',
      '*.html'
    ], {base: './'})
    .pipe(gulp.dest('./docs'));
});

/* デフォルトタスク */
gulp.task('default', ['build']);
