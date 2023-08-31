/** @type {import('next').NextConfig} */
const nextConfig = {
    experiments: {
    "asyncWebAssembly": true,
    "topLevelAwait": true,
    "layers": true // optional, with some bundlers/frameworks it doesn't work without
  }
}

module.exports = nextConfig
