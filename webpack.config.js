var path = require('path');

module.exports = {
    entry: path.join(__dirname, 'src/main.ts'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js', 'json'],
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    devtool: 'cheap-source-map'
};
