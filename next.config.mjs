// Import the entire 'next' package
import next from 'next';

// Access 'webpack' from the imported package
const { webpack } = next;

export default {
  webpack(config) {
    // Your custom webpack configuration here
    return config;
  },
  reactStrictMode: true,
};
