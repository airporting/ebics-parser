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

export default defineConfig({
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
  },
  plugins: [dts(), injectContent([{ path: /.*/, content: DEFINE_SELF }])],
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
