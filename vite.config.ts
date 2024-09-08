import { defineConfig, rollupVersion } from "vite";
import type { UserConfig } from "vite";
import HtmlRawImport from "./vite-plugin-html-import";
import { deepmerge } from "deepmerge-ts";
import { glob } from "node:fs/promises";
import path from "node:path";

const UTILS_REG = /utils/;

const getInputs = async () => {
  const result: Record<string, string> = {};
  for await (const entry of glob("src/*/*/index.ts")) {
    if (UTILS_REG.test(entry)) continue;
    result[entry.split(path.sep).slice(1, -1).join("_")] = entry;
  }
  return result;
};

const inputs = await getInputs();

const common = {
  base: "./",
  css: {
    transformer: "lightningcss",
  },
  resolve: {
    alias: [{ find: "src", replacement: path.resolve(__dirname, "src") }],
  },
} satisfies UserConfig;

const build = {
  build: {
    rollupOptions: {
      input: inputs,
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [HtmlRawImport()],
} satisfies UserConfig;

const externalReg = /^@\//;

const prod = {
  build: {
    rollupOptions: {
      external: [externalReg],
      output: {
        dir: "dist",
        paths: (id) => {
          if (externalReg.test(id)) {
            return `${id.replace(/@/, ".")}`;
          }
          return id;
        },
      },
    },
  },
  resolve: {
    alias: [{ find: "@/", replacement: path.resolve(__dirname, "dist") }],
  },
} satisfies UserConfig;
const dev = {
  resolve: {
    alias: [
      {
        find: /^@\/([.\-\w]+)_([.\-\w]+)\.js$/,
        replacement: "/src/$1/$2/index.ts",
      },
    ],
  },
} satisfies UserConfig;

export default defineConfig(({ command, mode }) => {
  if (command === "build") {
    return deepmerge(common, build, mode === "localcheck" ? prod : prod);
  }
  return deepmerge(common, dev);
});
