
import gulp from 'gulp';
const { series, parallel, src, dest, task } = gulp;
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import * as del  from 'del';
// const uglify = require('gulp-uglify');
// const babel = require('gulp-babel');
import { deleteAsync } from 'del';

import cssnano from 'gulp-cssnano';
import rev from 'gulp-rev';
import uglify from 'gulp-uglify'
// const {uglify} = data;
import imagemin from 'gulp-imagemin'

gulp.task('css', function(done){
    console.log('minifying cs...')
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets'));
    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        base:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
});

gulp.task('js', function(done){
    console.log('minifying js...');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        base: 'public',
        merge:true,
    })).pipe(gulp.dest('./public/assets'));
    done()
});

gulp.task('images', function(done){
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        base:'public',
        merge:true,
    })).pipe(gulp.dest('./public/assets'));
    done()
});

gulp.task('clean:assets', function(done){
    del.deleteSync('./public/assets');
    done()
});

gulp.task('build', gulp.series('clean:assets','images','css', 'js'), function(done){
    console.log('Building assets');
    done();
})