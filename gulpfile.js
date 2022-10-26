const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const del = require('del');

const paths = {
  styles: {
    source: 'assets-dev/sass/**/*.s*ss',
    destination: 'site/css/'
  },
  webfonts: {
    source: 'assets-dev/sass/webfonts/**/*',
    destination: 'site/css/webfonts/'
  },
  scripts: {
    source: 'assets-dev/js/**/*.js',
    destination: 'site/js/'
  },
  images: {
    source: 'assets-dev/images/**/*',
    destination: 'site/images/'
  },
  vendor: {
    source: 'assets-dev/vendor/**/*',
    destination: 'site/vendor/'
  }
};

function clean() {
  return del(['site/css', 'site/images', 'site/js', 'site/vendor']);
}

function styles() {
  return gulp
    .src(paths.styles.source)
    .pipe(
      sass({
        outputStyle: 'compressed'
      })
    )
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.destination));
}

function scripts() {
  return gulp
    .src(paths.scripts.source)
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.destination));
}

function copyImages() {
  return gulp
    .src(paths.images.source)
    .pipe(gulp.dest(paths.images.destination));
}

function copyVendor() {
  return gulp
    .src(paths.vendor.source)
    .pipe(gulp.dest(paths.vendor.destination));
}

function copyWebfonts() {
  return gulp
    .src(paths.webfonts.source)
    .pipe(gulp.dest(paths.webfonts.destination));
}

function watch() {
  gulp.watch(paths.vendor.source, copyVendor);
  gulp.watch(paths.images.source, copyImages);
  gulp.watch(paths.styles.source, styles);
  gulp.watch(paths.scripts.source, scripts);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
const build = gulp.series(
  clean,
  gulp.parallel(styles, copyWebfonts, scripts, copyImages, copyVendor)
);

exports.clean = clean;
exports.styles = styles;
exports.copyWebfonts = copyWebfonts;
exports.scripts = scripts;
exports.copyImages = copyImages;
exports.copyVendor = copyVendor;

exports.watch = watch;
exports.build = build;

/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
