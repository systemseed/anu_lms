const path = require('path');

// Define variables needed to run webpack dev server on any config set.
const WEBPACK_HOST = process.env.WEBPACK_HOST || '0.0.0.0';
const WEBPACK_PUBLIC = process.env.WEBPACK_PUBLIC || '';
const WEBPACK_DISABLE_HOST_CHECK = process.env.WEBPACK_DISABLE_HOST_CHECK || true;
const WEBPACK_PUBLIC_PATH = process.env.WEBPACK_PUBLIC_PATH || '/modules/contrib/anu_lms/js/dist';
const WEBPACK_SOCKET_HOST = process.env.WEBPACK_SOCKET_HOST || '';
const WEBPACK_SOCKET_PORT = process.env.WEBPACK_SOCKET_PORT || '';

const devServer = {
  host: WEBPACK_HOST,
  disableHostCheck: WEBPACK_DISABLE_HOST_CHECK,
  public: WEBPACK_PUBLIC,
  publicPath: WEBPACK_PUBLIC_PATH,
};

if (WEBPACK_SOCKET_HOST) {
  devServer.sockHost = WEBPACK_SOCKET_HOST;
}

if (WEBPACK_SOCKET_PORT) {
  devServer.sockPort = WEBPACK_SOCKET_PORT;
}

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  devServer: devServer,
};
