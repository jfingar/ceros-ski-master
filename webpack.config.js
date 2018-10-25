const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.png/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'dist/img/'
                    }
                }
            },
            {
                test: /\.css/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 5000,
        watchContentBase: true
    }
}