module.exports = {
  stories: [
    '../../core/src/layout/**/*.stories.tsx',
    '../../core/src/components/**/*.stories.tsx',
  ],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async config => {
    config.module.rules.push(
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },
    );
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
