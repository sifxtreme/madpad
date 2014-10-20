var gulp = require('gulp');
var gulpif = require('gulp-if');
var sprite = require('css-sprite').stream;

// generate sprite.png and _sprite.scss
gulp.task('sprites', function () {
  return gulp.src(['./public/images/account/*.png', './public/images/header/*.png', './public/images/main/*.png', './public/images/mobile/*.png'])
    .pipe(sprite({
      name: 'sprite',
      style: 'sprite.less',
      cssPath: './images',
      processor: 'less'
    }))
    .pipe(gulpif('*.png', gulp.dest('./public/images/'), gulp.dest('./public/less/')))
});