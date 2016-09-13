const gulp      = require('gulp');
const zip       = require('gulp-zip');
const rename    = require('gulp-rename');
const util      = require('gulp-util');
const fs        = require('fs');
const merge     = require('gulp-merge');
const notify    = require('gulp-notify');
const size      = require('gulp-size');
const htmlmin   = require('gulp-htmlmin');
const inlineimg = require('gulp-inline-image-html');

module.exports = () => {
  gulp.task( 'zip', [ 'build', 'template', 'inlineimages' ], () => {

    // var image_files = gulp.src(['./dist/s.png']);
    var html_files = gulp.src(['./dist/index.min.html'])
    .pipe(inlineimg('./src')) 
    .pipe( htmlmin({ collapseWhitespace: true }) )
    .pipe( rename('index.html'))
    .pipe( zip('game.zip') )
    .pipe( gulp.dest('dist') );

    /*return merge(image_files, html_files)
      .pipe( zip('game.zip') )
      .pipe( gulp.dest('dist') );*/
  });

  gulp.task('tellme', ['zip'], function() {
    var s = size();
    gulp.src('./dist/game.zip')
    .pipe(s)
    .pipe(notify({
            title: 'Build result',
            onLast: true,
            message: function () {
                return '\nTotal size\t\t' + s.size + '\n' + 'Bytes used\t\t' + s.size + '\n' + 'Bytes left\t\t' + ((13 * 1024) - s.size);
            }
      }));
  });

  gulp.task('inlineimages', ['template'], function() {
    gulp.src('./dist/*.html')
    .pipe(inlineimg('./src')) 
    .pipe( gulp.dest('dist') );   
  });

  gulp.task( 'report', [ 'zip', 'tellme' ], done => {
    fs.stat( './dist/game.zip', ( err, data ) => {
      if ( err ) {
        return done( err );
      }
      util.log(
        util.colors.yellow.bold(`Current game size: ${ data.size } bytes (${ (data.size / ((1024 * 13) / 100)).toFixed(1) }%). ${ (1024 * 13) - data.size } of ${ 1024 * 13} bytes remaining.`)
      );
      
      done();
    });
  });
};
