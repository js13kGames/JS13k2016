const gulp        = require('gulp');
const concat      = require('gulp-concat-css');
const livereload  = require('gulp-livereload');
const cssmin      = require('gulp-cssmin');

module.exports = () => {
  gulp.task( 'css', function () {
    return gulp.src( [ 'src/css/reset.css', 'src/css/**/*.css' ] )
      .pipe( concat('main.css') )
      .pipe( cssmin() )	
      .pipe( gulp.dest('./dist') )
      .pipe( livereload() );
  });
};
