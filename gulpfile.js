//load plugins
var gulp             = require('gulp'),
    compass          = require('gulp-compass'),
    pug              = require('gulp-pug'),
    autoprefixer     = require('gulp-autoprefixer'),
    cleancss         = require('gulp-clean-css'),
    uglify           = require('gulp-uglify'),
    merge            = require('merge-stream'),
    rename           = require('gulp-rename'),
    concat           = require('gulp-concat'),

    svgSprite        = require("gulp-svg-sprite"),
    svg2png          = require('gulp-svg2png'),

    // image            = require('gulp-image'),

    browserSync      = require('browser-sync');


//styles
gulp.task('styles', function() {
	return gulp.src(['app/styles/*.scss'])
		.pipe(compass({
			// project: 'dist/assets',
			css: 'dist/assets/css',
			sass: 'app/styles/',
			image: 'dist/assets/i'
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(cleancss({
          compatibility: 'ie8'
        }))
		.pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

//scripts
gulp.task('scripts', function() {
	return gulp.src(['app/scripts/inc/*.js', 'app/scripts/app.js'])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'))
    .pipe(browserSync.reload({stream:true}));
});

//templates
gulp.task('templates', function() {
  return gulp.src('app/pages/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream:true}));
});


//svg and png sprites
gulp.task('svgSprite', function () {

  var avatar = gulp.src('app/spritesrc/avatar/*.svg')
    // .pipe(image())
    .pipe(svgSprite({
        "shape": {
            "spacing": {
                "padding": 0
            }
        },
        "mode": {
            "css": {
                "dest": "./",
                "layout": "horizontal",
                "sprite": "sprite-avatar.svg",
                "bust": false,
                "render": {
                    "scss": {
                        "dest": "../../../app/styles/utilities/sprite-avatar.scss",
                        "template": "app/styles/templates/sprite-avatar-template.scss"
                    }
                }
            }
        }
    }))
    .pipe(gulp.dest('dist/assets/i'));


  return merge(avatar);

});



gulp.task('pngSprite', ['svgSprite'], function() {
    var avatar = gulp.src('dist/assets/i/sprite-avatar.svg')
        .pipe(svg2png())
        // .pipe(image())
        .pipe(gulp.dest('dist/assets/i'));

  return merge(avatar);
});

gulp.task('sprite', ['pngSprite']);


gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: "dist"
    },
    port: 8080,
    open: true,
    notify: false
  });
});


// Watch
gulp.task('watch', function() {

	//watch .scss files
	gulp.watch(['app/styles/utilities/*.scss', 'app/styles/sections/*.scss', 'app/styles/pages/*.scss', 'app/styles/plugins/*.scss', 'app/styles/templates/*.scss', 'app/styles/trapra.scss'], ['styles']);

	//watch .js files
	gulp.watch('app/scripts/**/*.js', ['scripts']);

	//watch .jade files
	gulp.watch('app/pages/**/*.pug', ['templates']);

  //svg and png sprites
  gulp.watch(['app/spritesrc/avatar/*.svg'], ['sprite']);


});


//default
gulp.task('default', ['scripts', 'styles', 'templates', 'sprite', 'watch', 'browserSync']);
