import gulp from "gulp";
import { JSDOM } from "jsdom";
import through2 from "through2";
import UglifyJS from "uglify-js";
import HTMLMinifier from "html-minifier";
import path from "path";

const target = "src/**/*.html";

const buildBase = (f) => () => {
  return gulp
    .src(target)
    .pipe(
      through2.obj((file, _, callback) => {
        if (!file.isBuffer()) {
          callback(null, file);
          return;
        }
        const text = file.contents.toString();

        const html = new JSDOM(text);
        const document = html.window.document;
        const schema = document.documentElement.attributes.schema;
        if (schema == null || schema.value != "component") {
          callback(null, file);
          return;
        }
        const template = document.querySelector("template").innerHTML;
        const script = document.querySelector("script").innerHTML;
        f({ file, template, script });

        callback(null, file);
      })
    )
    .pipe(
      gulp.dest((file) => {
        const current = path.dirname(path.relative("./src", file.path));
        if (current === ".") {
          return "./out/";
        }
        const newName = [
          ...current.split(path.sep),
          path.basename(file.path),
        ].join("-");
        console.log(newName);
        file.path = newName;
        file.dirname = "./out/";
        return "./out/";
      })
    );
};

gulp.task(
  "build:dev",
  buildBase(({ file, template, script }) => {
    const jsText = script.replace("__MARKER__", `\`${template}\``);
    file.contents = Buffer.from(jsText);
    file.extname = ".js";
  })
);

gulp.task(
  "build:prod",
  buildBase(({ file, template, script }) => {
    const minifiedHTML = HTMLMinifier.minify(template, {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      trimCustomFragments: true,
      minifyCSS: true,
    });
    const jsText = script.replace("__MARKER__", `\`${minifiedHTML}\``);

    const result = UglifyJS.minify(jsText, {
      warnings: true,
      mangle: {
        toplevel: true,
      },
    });

    if (result.error != null) throw result.error;
    file.contents = Buffer.from(result.code);
    file.extname = ".js";
  })
);
