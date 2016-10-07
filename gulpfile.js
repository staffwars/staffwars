var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task('build', function() {
  gulp.src('./src/*.js')
    .pipe(babel())
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest('./_build'))
});

gulp.task('default', ['build']);
