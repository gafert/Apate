const path = require('path');

module.exports = {
  entry: './index.ts',
  module: {
    rules: [
      {
        test: /(\.ts|\.tsx)$/,
        use: 'ts-loader'
      },
    ],
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist/simulation_library_worker'),
  },
  devServer: {
    contentBase: './dist',
    publicPath: 'http://localhost:9000/',
    compress: true,
    port: 9000
  },
  target: 'node',

  externals: {
    electron: "require('electron')",
    buffer: "require('buffer')",
    child_process: "require('child_process')",
    worker_threads: "require('worker_threads')",
    crypto: "require('crypto')",
    dialog: "require('dialog')",
    events: "require('events')",
    fs: "require('fs')",
    http: "require('http')",
    https: "require('https')",
    assert: "require('assert')",
    dns: "require('dns')",
    net: "require('net')",
    os: "require('os')",
    path: "require('path')",
    querystring: "require('querystring')",
    readline: "require('readline')",
    repl: "require('repl')",
    stream: "require('stream')",
    string_decoder: "require('string_decoder')",
    url: "require('url')",
    util: "require('util')",
    zlib: "require('zlib')",
    'electron-is-dev': "require('electron-is-dev')",
    'ffi-napi': "require('ffi-napi')",
    'ref-napi': "require('ref-napi')"
  }
};
