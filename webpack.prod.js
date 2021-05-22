const common = require('./webpack.common.js');

module.exports = Object.assign(common, {
    mode: 'production',
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
                                outputStyle: 'compressed',
                            },
                        },
                    },
                ],
            }
        ],
    },
});
