module.exports = {
    expo: {
      // Vos autres configurations...
      web: {
        bundler: 'metro'
      },
      plugins: [
        [
          'expo-router',
          {
            root: './app'
          }
        ]
      ]
    }
  };