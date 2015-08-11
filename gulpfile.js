var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var compass = require('gulp-compass');
var plumber = require('gulp-plumber');
var webserver = require('gulp-webserver');
var swig = require('gulp-swig');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

var swigOptions = {
	defaults: { cache: false }
};

var htmlOptions = {
	comments: true,
	spare: true
};

gulp.task('clean', function() {
  console.log("Clean all files in dist folder");
  gulp.src("dist/**/*.*")
      .pipe(clean({force: true}));
});

// gulp.task('default', function () {
//     return gulp.src('template.jsx')
//         .pipe(react())
//         .pipe(gulp.dest('dist'));
// });

gulp.task('scripts', function() {
  	gulp.src('scripts/**/*.js')
    	.pipe(concat('main.js'))
    	.pipe(gulp.dest('dist/js'));
});

gulp.task('swig', function() {
	gulp.src(['swig/**/*.html', '!swig/partials/**'])
		.pipe(plumber())
		.pipe(swig(swigOptions))
		.pipe(gulp.dest('dist'));
});

gulp.task('compass', function() {
	gulp.src('sass/**/*.scss')
	// gulp.src('sass/*.scss')
		.pipe(plumber())
	  	.pipe(compass({
		  	config_file: './config.rb',
		  	css: 'dist/css',
		  	sass: 'sass'
		}))
      	.pipe(gulp.dest('dist/css'));
});

gulp.task('webserver', function() {
	gulp.src('dist')
		.pipe(webserver({
			livereload: true,
		    directoryListing: true,
		    open: 'http://localhost:8000/index.html'
		}));
});

gulp.task('watch', function () {
	gulp.watch('swig/**/*.html', ['swig']);
	gulp.watch('sass/**/*.scss', ['compass']);
	gulp.watch('assets/**/*', ['assets']);
	gulp.watch('scripts/**/*.js', ['scripts']);
	gulp.watch('scripts/react/*.jsx', ['react']);
});

gulp.task('assets', function() {
	gulp.src(['assets/**/*'])
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['compass', 'swig', 'scripts', 'assets', 'webserver', 'watch']);
gulp.task('dev', ['webserver', 'watch']);

/**
 * For distribution
 */

gulp.task('deployScripts', function() {
  	gulp.src('./scripts/*.js')
	    .pipe(concat('main.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest('./dist/js'));

	var tsResult = gulp.src('scripts/ts/*.ts')
	                   .pipe(typescript({
	                           declarationFiles: true,
	                           noExternalResolve: true
	                    }));

	tsResult.js.pipe(uglify()).pipe(gulp.dest('dist/js'));
});

gulp.task('deploySwig', function() {
	gulp.src(['swig/**/*.html', '!swig/partials/**'])
		.pipe(plumber())
		.pipe(swig(swigOptions))
		.pipe(minifyHTML(htmlOptions))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('deployCompass', function() {
	gulp.src('sass/**/*.scss')
	// gulp.src('sass/*.scss')
		.pipe(plumber())
	  	.pipe(compass({
		  	config_file: './config.rb',
		  	css: 'dist/css',
		  	sass: 'sass'
		}))
		.pipe(minifyCSS())
      	.pipe(gulp.dest('dist/css'));
});
gulp.task('deploy', ['deployCompass', 'deploySwig', 'deployScripts', 'deployReact', 'assets']);

/*
gulp.task('sass', function () {
	return sass('sass/')
	.on('error', function (err) {
		console.error('Error!', err.message);
		this.emit('end');
	})
	.pipe(gulp.dest('dist/css'));
});
*/