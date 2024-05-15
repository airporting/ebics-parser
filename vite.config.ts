import { Plugin, defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const DEFINE_SELF = `
void !function () {
  typeof self == 'undefined'
    && typeof global == 'object'
    && (global.self = global);
}();
`;

const D_TS_DECLARE_MODULE = `declare module "@airporting/ebics-parser-ts"`;

export default defineConfig({
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
  },
  plugins: [
    dts({
      beforeWriteFile(filePath, content) {
        const res = { filePath, content };
        if (!filePath.includes('dist/index')) return res;
        if (res.content.includes(D_TS_DECLARE_MODULE)) return res;
        res.content = `${D_TS_DECLARE_MODULE} {${res.content}}`;
        return res;
      },
    }),
    injectContent([{ path: /.*/, content: DEFINE_SELF }]),
  ],
});

function injectContent(options: { path: RegExp; content: string }[]): Plugin {
  return {
    name: 'transform-file',

    transform(src, id) {
      for (const { path, content } of options) {
        if (path.test(id)) {
          return {
            code: `${content}${src}`,
          };
        }
      }
    },
  };
}
