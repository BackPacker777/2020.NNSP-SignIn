'use strict';

const gulp = require('gulp');
const ejs = require('gulp-minify-ejs');
const terser = require('gulp-terser');
const sass = require('gulp-sass');
const git = require('gulp-git');
// const babel = require('gulp-babel');

gulp.task('git-add', (done) => {
    gulp.src('./public/**/*')
        .pipe(git.add({
            quiet: true
        }));
    done();
});

gulp.task('minify-ejs', (done) => {
    gulp.src('src/views/*.ejs')
        .pipe(ejs())
        .pipe(gulp.dest('public/views'));
    done();
});

gulp.task('minify-js', (done) => {
    gulp.src('src/javascripts/*.js')
    // .pipe(babel({
    //     presets: ['@babel/env']
    // }))
        .pipe(terser())
        .pipe(gulp.dest('public/javascripts'));
    done();
});

gulp.task('compile-sass', (done) => {
    gulp.src('src/css/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('public/css'));
    done();
});

gulp.task('watch', () => {
    gulp.watch('src/css/*.scss', gulp.series('compile-sass'));
    gulp.watch('src/views/*.ejs', gulp.series('minify-ejs'));
    gulp.watch('src/javascripts/main.js', gulp.series('minify-js'));
    gulp.watch('./public/**/*', gulp.series('git-add'));
});

gulp.task('default', gulp.parallel(
    // 'git-add',
    'minify-ejs',
    // 'compile-sass'
    'minify-js'
    // 'watch'
    )
);