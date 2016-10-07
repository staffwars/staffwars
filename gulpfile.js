var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task('babel', function() {
  gulp.src('./src/*.js')
    .pipe(babel())
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest('./'))
});

gulp.task('default', ['babel']);
