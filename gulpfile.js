/**
 * gulpの設定ファイル
 */

/*
 * init package
 */
var gulp = require("gulp");

/*
 * path
 */
var path = {
  src: 'src/',
  dist: 'docs/',
  css_src: 'src/scss/',
  js_src: 'src/js/',
  img_src: 'src/img/',
  sprite_src: 'src/sprite/'
};

/*
 * sprite
 */
var spritesmith = require('gulp.spritesmith');
gulp.task('sprite', function () {
  var spriteData = gulp.src(path.sprite_src + '*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      imgPath: '../img/sprite.png',
      cssFormat: 'scss',
      padding: 4/*,
      cssOpts: {
        functions: false
      }*/
    }));

  spriteData.img.pipe(gulp.dest(path.img_src));
  spriteData.css
    .pipe(gulp.dest(path.css_src + 'setting/'));
});