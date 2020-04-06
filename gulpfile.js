"use strict";

var source_dir = "src";
var destination_dir = "dist";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore")
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");

gulp.task("css", function () {
  return gulp.src(source_dir + "/scss/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest(destination_dir + "/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: destination_dir + "/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(source_dir + "/scss/**/*.scss", gulp.series("css"));
  gulp.watch(source_dir + "/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch(source_dir + "/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("images", function() {
  return gulp.src(source_dir + "/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))

    .pipe(gulp.dest(source_dir + "/img"));

});

gulp.task("webp", function () {
  return gulp.src(source_dir + "/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest(source_dir + "/img"));
});

gulp.task("sprite", function () {
  return gulp.src(source_dir + "/img/icon-*.svg")
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("sprite_auto.svg"))
    .pipe(gulp.dest(destination_dir + "/img"));
});

gulp.task("html", function () {
  return gulp.src(source_dir + "/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest(destination_dir));
});

gulp.task("copy", function () {
  return gulp.src([
    source_dir + "/fonts/**/*.{woff,woff2}",
    source_dir + "/img/**",
    source_dir + "/js/**",
    source_dir + "//*.ico"
    ], {
      base: source_dir
    })
  .pipe(gulp.dest(destination_dir));
});

gulp.task("clean", function () {
  return del(destination_dir);
});

gulp.task("build", gulp.series("clean", "copy", "css", "sprite", "html"));
gulp.task("start", gulp.series("build", "server"));
