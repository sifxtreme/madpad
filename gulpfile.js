var gulp = require('gulp');
var gulpif = require('gulp-if');
var sprite = require('css-sprite').stream;

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');

gulp.task('sprites', function () {
  return gulp.src(['./public/images/about/*.png','./public/images/account/*.png', './public/images/header/*.png', './public/images/main/*.png'])
    .pipe(sprite({
      name: 'sprite',
      style: 'sprite.less',
      cssPath: './images',
      processor: 'less',
      orientation: "binary-tree",
      retina: true
    }))
    .pipe(gulpif('*.png', gulp.dest('./public/images/'), gulp.dest('./public/less/')))
});

gulp.task('mobile-sprites', function () {
  return gulp.src(['./public/images/mobile/*.png'])
    .pipe(sprite({
      name: 'mobile-sprite',
      style: 'mobile-sprite.less',
      cssPath: './images',
      processor: 'less',
      orientation: "binary-tree",
      retina: true
    }))
    .pipe(gulpif('*.png', gulp.dest('./public/images/'), gulp.dest('./public/less/')))
});

gulp.task('minify-css', function() {
  gulp.src(['./public/froala_1.2.1/css/font-awesome.css', './public/froala_1.2.1/css/froala_editor.css', './public/home/css/component.css'])
    .pipe(minifyCSS({processImport:true}))
    .pipe(concat('other.css'))
    .pipe(gulp.dest('./public/css/'))
});


// Concat
gulp.task('js-froala', function(){
  return gulp.src(["./public/froala_1.2.1/js/froala_editor.js","./public/froala_1.2.1/js/plugins/tables.min.js","./public/froala_1.2.1/js/plugins/lists.min.js","./public/froala_1.2.1/js/plugins/colors.min.js","./public/froala_1.2.1/js/plugins/font_family.min.js","./public/froala_1.2.1/js/plugins/font_size.min.js","./public/froala_1.2.1/js/plugins/block_styles.min.js","./public/froala_1.2.1/js/plugins/media_manager.min.js","./public/froala_1.2.1/js/plugins/video.min.js"])
    .pipe(concat('froala.js'))
    .pipe(gulp.dest('./public/js/'))
});

gulp.task('js-home-scroll', function(){
  return gulp.src(["./public/home/js/modernizr.custom.js","./public/home/js/classie.js","./public/home/js/cbpScroller.js"])
    .pipe(concat('home-scroll.js'))
    .pipe(gulp.dest('./public/js/'))
});

gulp.task('js-ui', function(){
  return gulp.src(["./public/js/header_messaging.js","./public/js/login_signup_logout.js","./public/js/recent_pads.js","./public/js/heart.js","./public/js/create_pads.js","./public/js/delete_pads.js","./public/js/chat.js","./public/js/privacy.js","./public/js/goback.js"])
    .pipe(concat('ui.js'))
    .pipe(gulp.dest('./public/js/'))
});

gulp.task('js', function(){
  return gulp.src(["./public/js/home-scroll.js", "./public/js/jquery-1.11.1.min.js", "./public/js/modals.js", "./public/js/desktop.js", "./public/js/Autolinker.min.js", "./public/sharejs/bcsocket.js", "./public/sharejs/share.uncompressed.js", "./public/sharejs/socket.io.js", "./public/js/froala.js", "./public/rangy/range-core.js", "./public/rangy/range-textarea.js", "./public/js/ace-editor.js", "./public/js/textarea.js", "./public/js/editable.js", "./public/js/variables.js", "./public/js/textpad.js", "./public/js/codepad.js", "./public/js/ui.js"])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./public/js/'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'))
});

gulp.task('js-mobile', function(){
  return gulp.src(["./public/js/home-scroll.js", "./public/js/jquery-1.11.1.min.js", "./public/js/modals.js", "./public/js/mobile.js", "./public/js/Autolinker.min.js", "./public/sharejs/bcsocket.js", "./public/sharejs/share.uncompressed.js", "./public/sharejs/socket.io.js", "./public/js/froala.js", "./public/rangy/range-core.js", "./public/rangy/range-textarea.js", "./public/js/ace-editor.js", "./public/js/textarea.js", "./public/js/editable.js", "./public/js/variables.js", "./public/js/textpad.js", "./public/js/codepad.js", "./public/js/ui.js"])
    .pipe(concat('all-mobile.js'))
    .pipe(gulp.dest('./public/js/'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'))
});
