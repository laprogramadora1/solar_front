/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,    
    env:{
        path: 'http://localhost:3000/',
        path_media: 'http://localhost/energia/',
        api: 'http://localhost:5000/'
        
    }
    

}

module.exports = nextConfig
