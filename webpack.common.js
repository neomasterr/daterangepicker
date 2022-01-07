const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    entry: {
        daterangepicker: {
            import: [
                './src/scss/daterangepicker.scss',
                './src/js/daterangepicker.js',
            ],
            library: {
                name: 'Daterangepicker',
                type: 'umd',
                umdNamedDefine: true,
            }
        },
        'demo/page': {
            import: [
                './src/demo/page.scss',
                './src/demo/page.js',
            ],
            filename: './demo/page.js',
        },
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './demo/index.html',
            template: './src/demo/index.html',
            title: 'DateRangePicker',
            inject: false,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].chunk.css',
        }),
        new LiveReloadPlugin({

        }),
    ],
    module: {
        rules: [
            {
                test: /\.css|sass|scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                indentWidth: 4,
                            },
                        },
                    },
                ],
            }
        ],
    },
};
