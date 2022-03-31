module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3002',
      },
      '^/games': {
          target: 'http://localhost:3002'
      }
    }
  }
}
