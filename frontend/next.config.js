/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });
    return config;
  },
  // serverUrl: 'https://neuraltalkbackend.onrender.com',
  serverUrl: 'http://localhost:5000',
  googleKey: "293258871762-clmknpcjj0cv69slpdiognh5c041e89u.apps.googleusercontent.com"
};


module.exports = nextConfig;
