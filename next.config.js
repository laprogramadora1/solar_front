/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },    
    assetPrefix: 'https://computacion.unl.edu.ec/sfv',
    env:{
	    
        path_media: '/sfv/img/',        
        api: 'https://computacion.unl.edu.ec/sfv/api/',        
        path: '/sfv/',
        path_only_images: '/sfv',
        
    }
    

}

module.exports = nextConfig
