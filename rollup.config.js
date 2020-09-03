import { terser } from "rollup-plugin-terser";

const minify = process.env.prod ? terser() : null;

export default [
    {
        input: 'src/background.js',
        output: {
            file: 'dist/background.js',
            format: 'esm'
        },
        plugins: [minify]
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/index.js',
            format: 'esm'
        },
        plugins: [minify]
    }
];