/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    target: "serverless",
    compiler: {
        styledComponents: true,
    },
}

module.exports = nextConfig
