const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

const tsProj = ts.createProject('tsconfig.json');

gulp.task('build', done => {
  gulp.src('src/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProj())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
  done();
});

gulp.task('assets', done => {
  gulp.src('contracts/**/*')
    .pipe(gulp.dest('dist/contracts'));
  gulp.src('project.yaml')
    .pipe(gulp.dest('dist'));
  done();
});

gulp.task('default', gulp.parallel('build', 'assets'));
