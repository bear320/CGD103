const { src, dest, series, parallel, watch } = require("gulp");

function defaultTask(cb) {
    console.log("gulp ok");
    cb();
}

exports.c = defaultTask;

// Task A
function A(cb) {
    console.log("Mission A");
    cb();
}

// Task B
function B(cb) {
    console.log("Mission B");
    cb();
}

// 順序
exports.sync = series(A, B);

// 同時
exports.async = parallel(A, B);

// 以上使用在最後打包的流程控管

function file() {
    // 同時打包不同格式之檔案
    // ! → 排除
    // ** → 下一層目錄
    return src(["src/*.html", "src/*.css", "src/**/*.js"]).pipe(dest("dist/"));
}

exports.f = file;

// Clean CSS
const cleanCSS = require("gulp-clean-css");

function cssminify() {
    return src("src/*.css")
        .pipe(cleanCSS())
        .pipe(rename({ extname: ".min.css" }))
        .pipe(dest("dist/css"));
}

exports.css = cssminify;

// Uglify JS
const uglify = require("gulp-uglify");

function js() {
    return src("src/js/*.js")
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(dest("dist/js"));
}

exports.minijs = js;

// 同時壓縮 CSS & JS
exports.minify = parallel(cssminify, js);

// Rename
// ----------------------------------- 有問題開始
const rename = require("gulp-rename");

function cssRename() {
    return src("src/*.css")
        .pipe(cleanCSS())
        .pipe(
            rename({
                extname: ".min.css",
            })
        )
        .pipe(dest("dist/css"));
}

exports.renameAndMinify = cssRename;
// ----------------------------------- 有問題結束

// SASS → CSS
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");

function styleSass() {
    return src("src/sass/*.scss")
        .pipe(sass.sync().on("error", sass.logError))
        .pipe(
            autoprefixer({
                cascade: false,
            })
        )
        .pipe(dest("./dist/css"));
}

exports.style = styleSass;

// HTML layout
const fileinclude = require("gulp-file-include");

function html() {
    return src("src/*.html")
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(dest("dist"));
}

exports.h = html;

// Watch
function watchfile() {
    watch(["src/*.html", "src/layout/*.html"], html);
    watch(["src/sass/*.scss", "src/sass/**/*.scss"], styleSass);
}

exports.w = watchfile;

// ==================== 以下為上線用 ====================

// 壓縮圖片
const imagemin = require("gulp-imagemin");

function min_images() {
    return src(["src/images/*.*", "src/**/*.*"])
        .pipe(imagemin())
        .pipe(dest("dist/images"));
}

exports.minify = min_images;

// 圖片搬家
function moveImgs() {
    return src(["src/images/*.*", "src/images/**/*.*"]).pipe(
        dest("dist/images")
    );
}

// JS 打包 ES6 → ES5
const babel = require("gulp-babel");

function babel5() {
    return src("src/js/*.js")
        .pipe(
            babel({
                presets: ["@babel/env"],
            })
        )
        .pipe(dest("dist/js"));
}

exports.es5 = babel5;

// 清除舊檔案
const clean = require("gulp-clean");

function clear() {
    // read → 是否讀取檔案結構（false 可增加刪除效率）
    // allowEmpty → 是否允許刪除空的檔案
    // force → 是否強制刪除檔案
    return src("dist", { read: false, allowEmpty: true }).pipe(
        clean({ force: true })
    );
}

exports.cls = clear;

// Browsersync
const browserSync = require("browser-sync");
const reload = browserSync.reload;

function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html",
        },
        port: 3000,
    });
    // 利用 watch 整合，並設定當發生 change 事件時 reload
    watch(["src/*.html", "src/layout/*.html"], html).on("change", reload);
    watch(["src/sass/*.scss", "src/sass/**/*.scss"], styleSass).on(
        "change",
        reload
    );
    watch(["src/images/*.*", "src/images/**/*.*"], moveImgs).on(
        "change",
        reload
    );
    watch("src/js/*.js", js).on("change", reload);
    done();
}

// 開發
// exports.default = browser;

// ==================== 統整 ====================

// 開發用
exports.default = series(parallel(html, styleSass, moveImgs, js), browser);

// 上線用
exports.online = series(clear, parallel(html, styleSass, min_images, babel5));
