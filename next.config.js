const path = require('path');

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/styles': path.resolve(__dirname, 'src/styles'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/models': path.resolve(__dirname, 'src/models')
    };
    return config;
  }
};