import { defineConfig } from "vite";
import type { UserConfig } from "vite";
import HtmlRawImport from "./vite-plugin-html-import";
import { deepmerge } from "deepmerge-ts";
import { glob } from "node:fs/promises";
import path from "node:path";
import packageJson from "./package.json";

const getInputs = async () => {
  const result: Record<string, string> = {};
  for await (const entry of glob("src/*/*/index.ts")) {
    result[entry.split(path.sep).slice(1, -1).join("_")] = entry;
  }
  return result;
};

const common = {
  css: {
    transformer: "lightningcss",
  },
} satisfies UserConfig;

const build = {
  build: {
    rollupOptions: {
      input: await getInputs(),
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [HtmlRawImport()],
} satisfies UserConfig;

const localcheck = {
  build: {
    rollupOptions: {
      external: [/dist/],
    },
  },
  resolve: {
    alias: [{ find: /^@\/(.*)/, replacement: "/dist/$1" }],
  },
} satisfies UserConfig;

const baseUrl = `https://cdn.jsdelivr.net/npm/blogger-styling@${packageJson.version}`;

const prod = {
  resolve: {
    alias: [{ find: /^@\/(.*)/, replacement: `${baseUrl}/$1` }],
  },
};

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
    return deepmerge(common, build, mode === "localcheck" ? localcheck : prod);
  }
  return deepmerge(common, dev);
});
