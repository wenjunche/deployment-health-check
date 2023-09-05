/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // https://cdn.openfin.co/health/deployment/index.html
  basePath: process.env.BASE_PATH || "",
};

module.exports = nextConfig;
