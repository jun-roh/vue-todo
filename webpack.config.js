const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
require('@babel/polyfill');

module.exports = (env, opts) => {
  const config = {
    // 중복 옵션
    resolve: {
      extensions: ['.vue', '.js']
    },
    // 진입점 : 프로젝트가 돌아가기 위한 파일 하나
    entry: {
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js')
      ]
    },
    // 결과물에 대한 설정
    output: {
      filename: '[name].js', // entry
      path: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }, {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader'
          ]
        }, {
          test: /\.s[ac]ss$/i,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'assets/',
            to: ''
          }
        ]
      })
    ]
  };

  if (opts.mode === 'development') {
    // 개발용
    return merge(config, {
      devtool: 'eval',
      devServer: {
        open: false,
        hot: true,
        client: {
          webSocketURL: {
            hostname: '0.0.0.0',
            pathname: '/ws',
            password: 'dev-server',
            port: 8080,
            protocol: 'ws',
            username: 'webpack',
          },
        }
      } 
    });
  } else {
    // 상용
    return merge(config, {
      devtool: 'cheap-module-source-map',
      plugins: [
        new CleanWebpackPlugin()
      ]
    });
  }
};