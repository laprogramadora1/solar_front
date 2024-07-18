/** @type {import('next').NextConfig} */
const nextConfig = {
    
    //assetPrefix: 'https://computacion.unl.edu.ec/sfv',
    env:{
	    
        path_media: '/sfv/img/',        
        api: 'http://172.19.0.2:5000/api/',        
        path: '/sfv/',
        path_only_images: '/sfv',
        
    }
    

}

module.exports = nextConfig
