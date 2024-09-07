import gulp from "gulp";
import { JSDOM } from "jsdom";
import through2 from "through2";
import UglifyJS from "uglify-js";
import HTMLMinifier from "html-minifier";
import path from "path";
import { glob } from "node:fs/promises";
import * as vite from "vite";

gulp.task("build", async (cb) => {
  console.log("hey");
  for await (const entry of glob("src/*/*/index.ts")) {
    console.log();
    const result = await vite.build({
      build: {
        rollupOptions: {
          input: entry,
          output: {
            entryFileNames:
              entry.split(path.sep).slice(1, -1).join("-") + ".js",
          },
        },
      },
    });
  }
});
