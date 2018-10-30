var gulp = require("gulp"),
	watch = require("gulp-watch"),
	plumber = require("gulp-plumber"),
	gulpsass = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	cleanCss = require("gulp-clean-css"),
	sourceMaps = require("gulp-sourcemaps"),
	concat = require("gulp-concat"),
	jshint = require("gulp-jshint"),
	uglify = require("gulp-uglify"),
	imagemin = require("gulp-imagemin"),
	htmlPartial = require('gulp-html-partial'),
	livereload = require("gulp-livereload"),
	notify = require("gulp-notify");

var onError = function(err)	{
	console.log("Se ha producido un error: ", err.message);
	this.emit("end");
}

gulp.task("sass", function(){
	return gulp.src("./sass/main.scss")
		.pipe(plumber({errorHandler:onError}))
		.pipe (sourceMaps.init())
		.pipe (gulpsass())
		.pipe (autoprefixer("last 2 versions"))
		.pipe (gulp.dest("./css"))
		.pipe (cleanCss({keepSpecialComments: 1}))
		.pipe (sourceMaps.write("."))
		.pipe (gulp.dest("./css"))
		.pipe (livereload())
		.pipe(notify({message: "Sass task done"}))
});

gulp.task("lint", function(){
	return gulp.src("./js/custom/**/*.js")
		.pipe(jshint())
});

gulp.task("javascript", ["lint"],  function(){
	return gulp.src("./js/custom/**/*.js")
		.pipe(plumber({errorHandler:onError}))
		.pipe (concat("herco.min.js"))
		.pipe (uglify())
		.pipe (gulp.dest("./js"))
		.pipe (livereload())
		.pipe(notify({message: "JavaScript task done"}))
});

gulp.task("imagemin", function(){
	return gulp.src("./img/raw/**/*.*")
		.pipe(plumber({errorHandler:onError}))
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest("./img/low"))
		.pipe (livereload())
		.pipe(notify({message: "ImageMin task done"}))
});

gulp.task('html', function () {
    gulp.src(['src/*.html'])
        .pipe(htmlPartial({
            basePath: 'src/partials/'
        }))
        .pipe(gulp.dest('./'))
        .pipe (livereload())
		.pipe(notify({message: "Html Partial task done"}))
});

gulp.task("watch", function(){
	livereload.listen();
	gulp.watch("./sass/**/*.scss", ["sass"])
	gulp.watch("./js/custom/**/*.js", ["javascript"])
	gulp.watch("./img/raw/**/*.*", ["imagemin"])
	gulp.watch("./src/**/*.html", ["html"])
});

gulp.task("default", ["sass", "lint", "javascript", "imagemin", "html", "watch"], function(){
	
});	