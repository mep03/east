const gulp = require("gulp");
const ts = require("gulp-typescript");

const tsProject = ts.createProject("tsconfig.json");

gulp.task("copy", function () {
  return gulp.src("./src/views/*").pipe(gulp.dest("./dist/views/"));
});

gulp.task("compile-ts", function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});

gulp.task("build", gulp.series("copy", "compile-ts"));

gulp.task("default", async function () {
  await gulp.series("build")();
});
