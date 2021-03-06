// Copyright Connor Lind, 2017

const autoprefixer = require('autoprefixer'),
  babelify = require('babelify'),
  browserify = require('browserify'),
  browserSync = require('browser-sync').create(),
  buffer = require('vinyl-buffer'),
  cache = require('gulp-cache'),
  cssnano = require('cssnano'),
  gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  source = require('vinyl-source-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  util = require('gulp-util');

const config = {
  src: {
    root: 'src',
    css: 'src/css',
    jsEntry: 'src/js/index.js',
    jsWatch: 'src/js/**/*.js',
    sassEntry: 'src/scss/index.scss',
    sassWatch: 'src/scss/**/*.scss',
    htmlWatch: 'src/*.html'
  },
  dist: {
    root: 'dist',
    js: 'dist/js',
    css: 'dist/css',
    htmlWatch: 'dist/**/*.html'
  }
};

/* CSS Build */
gulp.task('sass', () => {
  const plugins = [
    autoprefixer(),
    cssnano()
  ];

  return gulp.src(config.src.sassEntry)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dist.css));
});

// browserSync reload after CSS tasks are complete
gulp.task('sass-reload', ['sass'], () => {
    browserSync.reload();
});

/* JS BUILD */
gulp.task('js', () => {
  const b = browserify({
    entries: config.src.jsEntry,
    debug: true,
    transform: [babelify.configure({
      presets: ['env', 'react']
    })]
  });

  return b.bundle()
    .pipe(source('index.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
      // Add other gulp transformations to the pipeline here.
      .pipe(uglify())
      .on('error', util.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dist.js));
});

// browserSync reload after JS tasks are complete
gulp.task('js-reload', ['js'], () => {
    browserSync.reload();
});

/* HTML BUILD */
gulp.task('html', () => {
  return gulp.src(config.src.htmlWatch)
    .pipe(gulp.dest(config.dist.root))
});

gulp.task('html-reload', ['html'], () => {
    browserSync.reload();
});


/********************DEFAULT********************/

// Launch browserSync and watch HTML, JS and Sass files for reload
gulp.task('default', ['js', 'sass', 'html'], () => {

  browserSync.init({
    server: {
      baseDir: config.dist.root
    }
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  // html is reloaded from dist because it has no pre-processing
  gulp.watch(config.src.jsWatch, ['js-reload']);
  gulp.watch(config.src.sassWatch, ['sass-reload']);
  gulp.watch(config.src.htmlWatch, ['html-reload']);
});

/********************BUILD********************/

gulp.task('build', ['js', 'sass', 'html'], () => {
});
