const path = require('path');
const babiliPlugin = require('babili-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin'); //para extrair o css do bundle.js em arquivo separado
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //para otimizar css
const webpack = require('webpack');

let plugins = [];

plugins.push(
    new extractTextPlugin("styles.css")
);

//carrega aqui a biblioteca do jQuery no escopo global da aplicacao
plugins.push(
    new webpack.ProvidePlugin(
        {
            '$': 'jquery/dist/jquery.js',
            'jQuery': 'jquery/dist/jquery.js'
        }
    )
)

if(process.env.NODE_ENV == 'production') {
    plugins.push(new babiliPlugin());
    plugins.push(new optimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { 
            discardComments: {
                removeAll: true 
            }
        },
        canPrint: true
     }));    
}

module.exports = {
    entry: './app-src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), //cria caminho completo ate a pasta /app-src/dist/bundle.js
        publicPath: 'dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            { 
                test: /\.css$/, 
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            { 
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/font-woff' 
            },
            { 
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            { 
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'file-loader' 
            },
            { 
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml' 
            }            
        ]
    },
    plugins
}    