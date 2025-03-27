module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      // Supprimez la ligne plugins: ['expo-router/babel']
    };
  };