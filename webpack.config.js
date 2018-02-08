const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: ['./src/js/app.js', './src/scss/main.scss'],
  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map',
  module: {
    rules: [
      /*
      your other rules for JavaScript transpiling go in here
      */
      { // css / sass / scss loader for webpack
        test: /\.(css|sass|scss)$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
        })
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        // query: {
          // cacheDirectory: true,
          // presets: ['react', 'es2015']
        // }
        query: {
          presets: ["es2015", "react"]
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin({ // define where to save the file
      filename: 'main.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      // Required
      inject: false,
      template: require('html-webpack-template'),
      // template: 'node_modules/html-webpack-template/index.ejs',
 
      // Optional
      appMountId: 'app',
      // appMountHtmlSnippet: '<div class="app-spinner"><i class="fa fa-spinner fa-spin fa-5x" aria-hidden="true"></i></div>',
      // headHtmlSnippet: '<style>div.app-spinner {position: fixed;top:50%;left:50%;}</style >',
      // bodyHtmlSnippet: '<custom-element></custom-element>',
      // baseHref: 'http://example.com/awesome',
      // devServer: 'http://localhost:3001',
      // googleAnalytics: {
        // trackingId: 'UA-XXXX-XX',
        // pageViewOnLoad: true
      // },
      meta: [
        {
          name: 'description',
          content: 'Grid filter'
        }
      ],
      mobile: true,
      lang: 'en-US',
      // links: [
        // 'https://fonts.googleapis.com/css?family=Roboto',
        // {
          // href: '/apple-touch-icon.png',
          // rel: 'apple-touch-icon',
          // sizes: '180x180'
        // },
        // {
          // href: '/favicon-32x32.png',
          // rel: 'icon',
          // sizes: '32x32',
          // type: 'image/png'
        // }
      // ],
      // inlineManifestWebpackName: 'webpackManifest',
      // scripts: [
        // 'http://example.com/somescript.js',
        // {
          // src: '/myModule.js',
          // type: 'module'
        // }
      // ],
      title: 'Filter Grid',
      // window: {
        // env: {
          // apiHost: 'http://myapi.com/api/v1'
        // }
      // }
 
      // And any other config options from html-webpack-plugin:
      // https://github.com/ampedandwired/html-webpack-plugin#configuration
    }),
    new UglifyJSPlugin({
      sourceMap: true
    })
  ],
}