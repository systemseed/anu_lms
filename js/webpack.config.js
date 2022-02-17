const path = require('path');

module.exports = {
  entry: {
    // Entry points for the ANU LMS application bundles.
    // Usually each bundle represents a page.
    courses: {
      import: path.resolve(__dirname, './src/bundles/courses.js'),
      dependOn: 'vendors',
    },
    lesson: {
      import: path.resolve(__dirname, './src/bundles/lesson.js'),
      dependOn: 'vendors',
    },
    serviceworker: {
      import: path.resolve(__dirname, './src/bundles/serviceworker.js'),
    },
    // Shared modules across bundles to avoid code loading duplication.
    vendors: ['react', 'react-dom', 'react-router-dom', 'he', 'prop-types'],
  },
  output: {
    // Filename pattern to use to generate the resulting bundle filenames.
    // I.e. 'courses.min.js'.
    filename: '[name].min.js',
    // Tell webpack to clean dist/ folder before each build.
    clean: true,
  },
  resolve: {
    alias: {
      // Create an alias for anu to make every component overridable
      // by other modules external to anu lms.
      '@anu': path.resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      // A rule to pick up js / jsx files and
      // transpile them into cross-browser js.
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        // Put babel loader into webpack to make overriding of the
        // current webpack configuration easier.
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: process.env.NODE_ENV !== 'production' ? 'inline-source-map' : 'source-map',
};
