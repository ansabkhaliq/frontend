const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.[hash].js',
        path: path.join(__dirname, '/dist'),
        publicPath: '/'
    },
    module: {

        
        rules: [

            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /^(?!.*?\.module).*\.css$/,
                use: ['style-loader', 'css-loader']
              },
            {
            test: /\.module\.css$/,
            use: ['style-loader', {
                loader: 'css-loader',
                options: {
                modules: true
                }
            }]
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                     // loader: 'file-loader',
                    options: {
                        esModule: false, // 这里设置为false
                        name: '[name].[ext]',
                        limit: 10240
                 }
                 }]
            }


        ]
    },
    devServer: {
        host: '127.0.0.1',
        historyApiFallback: true,
        proxy: {
            '/api/*':{
                target: 'http://localhost:5000', // Might need to change this for production
                changeOrigin: false,             // Also might need to change this to false
                secure: false
            }
        }
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin(),

    ]
}