var gulp = require('gulp');
var gulpif = require('gulp-if');
var sprite = require('css-sprite').stream;
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var imageop = require('gulp-image-optimization');

gulp.task('images', function(cb) {
  gulp.src(['./public/images/chat/*.png', './public/images/**/*.png','./public/images/**/*.jpg','./public/images/**/*.gif','./public/images/**/*.jpeg']).pipe(imageop({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
  })).pipe(gulp.dest('./public/images/')).on('end', cb).on('error', cb);
});

gulp.task('sprites', function () {
  return gulp.src(['./public/images/chat/*.png', './public/images/about/*.png','./public/images/account/*.png', './public/images/header/*.png', './public/images/main/*.png'])
    .pipe(sprite({
      name: 'desktop',
      style: 'desktop.less',
      cssPath: './images/sprites',
      processor: 'less',
      orientation: "binary-tree",
      margin: 10,
      retina: true
    }))
    .pipe(gulpif('*.png', gulp.dest('./public/images/sprites/'), gulp.dest('./public/less/sprites/')))
});

gulp.task('mobile-sprites', function () {
  return gulp.src(['./public/images/mobile/*.png'])
    .pipe(sprite({
      name: 'mobile',
      style: 'mobile.less',
      cssPath: './images/sprites',
      processor: 'less',
      orientation: "binary-tree",
      margin: 10,
      retina: true
    }))
    .pipe(gulpif('*.png', gulp.dest('./public/images/sprites/'), gulp.dest('./public/less/sprites/')))
});


// Concat
gulp.task('js-ui', function(){
  return gulp.src(["./public/js/header_messaging.js","./public/js/login_signup_logout.js","./public/js/heart.js","./public/js/create_pads.js","./public/js/delete_pads.js","./public/js/chat.js","./public/js/privacy.js","./public/js/goback.js","./public/js/retina.js"])
    .pipe(concat('ui.js'))
    .pipe(gulp.dest('./public/js/'))
});

gulp.task('js', function(){
  return gulp.src(["./public/js/jquery-1.11.1.min.js", "./public/js/modals.js", "./public/js/desktop.js", "./public/js/Autolinker.min.js", "./public/sharejs/bcsocket.js", "./public/sharejs/share.uncompressed.js", "./public/sharejs/socket.io.js", "./public/js/ace-editor.js", "./public/js/textarea.js", "./public/js/editable.js", "./public/js/variables.js", "./public/js/codepad.js", "./public/js/ui.js"])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./public/js/'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'))
});

gulp.task('js-mobile', function(){
  return gulp.src(["./public/js/jquery-1.11.1.min.js", "./public/js/modals.js", "./public/js/mobile.js", "./public/js/Autolinker.min.js", "./public/sharejs/bcsocket.js", "./public/sharejs/share.uncompressed.js", "./public/sharejs/socket.io.js", "./public/js/ace-editor.js", "./public/js/textarea.js", "./public/js/editable.js", "./public/js/variables.js", "./public/js/codepad.js", "./public/js/ui.js"])
    .pipe(concat('all-mobile.js'))
    .pipe(gulp.dest('./public/js/'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'))
});
