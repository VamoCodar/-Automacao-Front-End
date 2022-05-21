const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'))
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const colors = require("colors")
const browserSync = require("browser-sync").create()
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const stripImportExport = require('gulp-strip-import-export');

const mostraLogPath = (path) => console.log("✨ SASS".yellow, ` ${path}`.underline)

const paths = {
	src: {
		scss: 'src/scss/**/*.scss',
		js: 'src/js/*.js',
	},
	dist: {
		css: "dist/css",
		js: 'dist/js',
	}
}
//////////////////////////////////////
//Funçao para compilar o SASS e adicionar os prefixos
function compilaSass() {
	return gulp
		.src(paths.src.scss)
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(autoprefixer({ cascade: false }))
		.pipe(sourcemaps.write({ addComment: false, largeFile: true }))
		.pipe(gulp.dest(paths.dist.css))
		.pipe(browserSync.stream())
}


//Funçao para iniciar o Browser-sync
function browser() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	})
}

//Funçao de watch do Gulp
function watch() {
	gulp.watch(paths.src.scss, gulp.series(compilaSass)).on('change', mostraLogPath) // Watch sass
	gulp.watch("*.html").on('change', browserSync.reload) // Watch html
	gulp.watch(paths.src.js, gulpJs) // Watch JS
	console.log('👀 Só Observando'.green);

}
// Funçao para juntar o js
function gulpJs() {
	return gulp.src(paths.src.js)
		.pipe(sourcemaps.init())
		.pipe(stripImportExport())
		.pipe(concat('all.js'))
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(uglify())
		.pipe(sourcemaps.write({ addComment: false, largeFile: true }))
		.pipe(gulp.dest(paths.dist.js))
}
//////////////////////////////////////

// TASKS
gulp.task("watch", watch) // Inicia Tarefa para obervar mudanças nos arquivos
gulp.task('sass', compilaSass) // Tarefa Gulp funçao de sass
gulp.task('browser-sync', browser)// Tarefa para atualizar o browser
gulp.task('scripts', gulpJs) // Tarefa para juntar JS
gulp.task("default", gulp.parallel("watch", "browser-sync", "sass", "scripts")) // task default