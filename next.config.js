/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  trailingSlash: true,
  // exportPathMap: async function (defaultPathMap) {
  //   // Create a new path map by modifying the route names
  //   const pathMap = Object.keys(defaultPathMap).reduce((result, path) => {
  //     // If the path is not the root path, modify it to use index.html
  //     if (path !== '/') {
  //       result[path + '/index.html'] = { page: path };
  //     } else {
  //       result['/index.html'] = { page: '/' };
  //     }
  //     return result;
  //   }, {});

  //   return pathMap;
  // },
  async headers() {
    return [
      {
        source: '/example/Build.wasm.gz',
        headers: [
          { key: 'Content-Encoding', value: 'gzip' },
          { key: 'Content-Type', value: 'application/wasm' },
          { key: 'Vary', value: 'Accept-Encoding' },
          { key: 'Cache-Control', value: 'public, max-age=31536000' },
        ],
      },
      {
        source: '/example/Build.data.gz',
        headers: [
          { key: 'Content-Encoding', value: 'gzip' },
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Vary', value: 'Accept-Encoding' },
          { key: 'Cache-Control', value: 'public, max-age=31536000' },
        ],
      },
      {
        source: '/example/Build.framework.js.gz',
        headers: [
          { key: 'Content-Encoding', value: 'gzip' },
          { key: 'Content-Type', value: 'application/javascript' },
          { key: 'Vary', value: 'Accept-Encoding' },
          { key: 'Cache-Control', value: 'public, max-age=31536000' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
