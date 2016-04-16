const del = require('del');
const gulp = require('gulp');
const tslint = require('gulp-tslint');
const tsd = require('gulp-tsd');
const typescript = require('gulp-typescript');

const tscConfig = require('./tsconfig.json');

const tsSourceFiles = 'src/**/*.ts'

gulp.task('clean', function () {
  return del('dist/**/*');
});

gulp.task('tsd', function (callback) {
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});

gulp.task('compile', ['clean'], function () {
  return gulp.src(tsSourceFiles)
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist/'));
});

gulp.task('tslint', function() {
  return gulp.src(tsSourceFiles)
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('build', ['tslint', 'compile']);
gulp.task('default', ['build']);