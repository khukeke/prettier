var path = require('path');


module.exports = {
    entry: __dirname + "/App.js",
    output: {
        path: __dirname + "/public",
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, './public'),
        compress: true,
        inline: true,
        port: 9000
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {}
            }]
        }, {
            test: /\.(html)$/,
            use: [{
                loader: 'html-loader',
                options: {
                    attrs: [':data-src']
                }
            }]
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    }
}