import HTMLMinifier from "html-minifier";
import "./env-type";

const IMPORT_PATH = /^.*\.html\?raw$/;

export default function HtmlRawImport() {
  return {
    name: "html-raw-import",
    transform(src, id) {
      if (!IMPORT_PATH.test(id)) return;
      return {
        code: HTMLMinifier.minify(
          src
            .replaceAll("\\r", "")
            .replaceAll("\\n", "")
            .replaceAll('\\"', '"'),
          {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            trimCustomFragments: true,
            quoteCharacter: "'",
          }
        ),
      };
    },
  };
}
