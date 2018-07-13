const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const minifyCss = require("gulp-minify-css");
const imagemin = require('gulp-imagemin');

gulp.task('js', () => {
    gulp.src('./www/js/*.js')
        .pipe(concat('buidle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css', () => {
    gulp.src('./www/css/*.css')
        .pipe(concat('style.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('img', () => {
    gulp.src('./www/img/*.*')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('font', () => {
    gulp.src('./www/fonts/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('default', ['js','css','img','font']);