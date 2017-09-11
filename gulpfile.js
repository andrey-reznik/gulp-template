'use strict';

var gulp 				= require('gulp'),
		sass 				= require('gulp-sass'),
		browserSync	= require('browser-sync'),
		pug					= require('gulp-pug'),
		concat			= require('gulp-concat'),
		del					= require('del');

// Автообновление в браузере
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: true
	})
});

// Компиляция SASS/SCSS в CSS
gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.{sass,scss}')
	.pipe(sass())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

// Сборка сторонних JS библиотек
gulp.task('libs:js', function(){
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js'
	])
	.pipe(gulp.dest('app/js'))
});

// Сборка JS проекта
gulp.task('app:js', function(){
	return gulp.src(['app/pug/**/*.js'])
	.pipe(concat('app.js'))
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', ['libs:js', 'app:js']);

// Компиляция PUG в HTML
gulp.task('pug', function buildHTML(){
	return gulp.src('app/pug/pages/*.pug')
	.pipe(pug({
			pretty: true
		}))
	.pipe(gulp.dest('app'))
});

// Сборка сторнних шрифтов
gulp.task('libs:fonts', function(){
	return gulp.src([

	])
	.pipe(gulp.dest('app/fonts'))
});

// Мониторинг изменений
gulp.task('watch', ['sass', 'pug', 'app:js', 'libs:js', 'browser-sync'] , function(){
	gulp.watch('app/sass/**/*.{sass, scss}', ['sass']);
	gulp.watch('app/pug/**/*.pug', ['pug']);
	gulp.watch('app/pug/**/*.js', ['app:js']);
	gulp.watch('app/**/*.html', browserSync.reload);
});

gulp.task('build', ['removedist', 'sass', 'js', 'pug'], function(){
	var buildFiles = gulp.src('app/**/*.html')
		.pipe(gulp.dest('dist'));

	var buildCss = gulp.src('app/css/**/*.css')
		.pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src('app/js/**/*.js')
		.pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('default', ['watch'])
