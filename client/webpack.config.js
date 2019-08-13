const path = require('path'); //utilizado para pegar caminho completo da aplicacao
const babiliPlugin = require('babili-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin'); //para extrair o css do bundle.js em arquivo separado
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //para otimizar css
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let plugins = [];
let SERVICE_URL = JSON.stringify("http://localhost:3000");

//extrai os arquivos css do bundle.jss e os joga no style.css
plugins.push(new extractTextPlugin("styles.css"));

//carrega aqui a biblioteca do jQuery no escopo global da aplicacao
plugins.push(
    new webpack.ProvidePlugin(
        {
            '$': 'jquery/dist/jquery.js',
            'jQuery': 'jquery/dist/jquery.js'
        }
    )
)

//ajuda a dividir os arquivos gerados pela aplicacao
plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor', 
    filename: 'vendor.bundle.js'
}));
//gera um arquivo index.html dentro de dist com carregamento automatico dos scripts
plugins.push(new HtmlWebpackPlugin({
    hash: true,
    minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
    },    
    filename: 'index.html',
    template: __dirname + '/main.html'
}));


//plugins para o ambiente de producao
if(process.env.NODE_ENV == 'production') {
    
    SERVICE_URL = JSON.stringify("http://endereco-da-api");

    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
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

plugins.push(new webpack.DefinePlugin({
    SERVICE_URL : SERVICE_URL //por tanto a chave quanto valor terem o msm nome pode-se omitir um deles
}))

module.exports = {
    entry: {
        app: './app-src/app.js',
        vendor: ['jquery', 'bootstrap', 'reflect-metadata']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), //cria caminho completo ate a pasta /app-src/dist/bundle.js        
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