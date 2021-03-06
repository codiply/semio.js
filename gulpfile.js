const browserSync = require('browser-sync');
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
  return gulp.src([tsSourceFiles, 'typings/tsd.d.ts'])
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist/'));
});

gulp.task('tslint', function() {
  return gulp.src(tsSourceFiles)
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('watch-ts', function() {
    gulp.watch([tsSourceFiles], ['compile']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: ["examples", "dist"],
        port: 4040
    });
});

gulp.task('lint', ['tslint']);
gulp.task('build', ['lint', 'compile']);
gulp.task('watch', ['build', 'watch-ts', 'browser-sync']);
gulp.task('default', ['build']);