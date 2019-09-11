import path from 'path'

import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from "rollup-plugin-uglify";
import autoprefixer from 'autoprefixer'

const paths = {
  input: path.resolve(__dirname, '../src/lib/index.js')
}

export default {
  input: paths.input,
  external: ['react', 'react-dom', 'antd'],
  output: [
    // {
    //   name: 'RuleEditor',
    //   format: 'es',
    //   file: 'dist/es/index.js',
    //   globals: {
    //     react: 'React',
    //     "react-dom": "ReactDOM",
    //     "antd": "antd"
    //   }
    // },
    {
      name: 'RuleEditor',
      format: 'umd',
      file: 'dist/lib/index.js',
      globals: {
        react: 'React',
        "react-dom": "ReactDOM",
        "antd": "antd"
      }
    }],
  plugins: [
    resolve(),
    babel({
      exclude: '**/node_modules/**',
      runtimeHelpers: true
    }),
    commonjs(),
    postcss({
      // extract: true,
      extensions: ['.scss'],
      plugins: [
        autoprefixer()
      ]
    }),
    uglify({
      compress: {
        drop_debugger: true,
        drop_console: true
      }
    })
  ]
}
