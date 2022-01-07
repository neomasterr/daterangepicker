const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].chunk.css',
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
