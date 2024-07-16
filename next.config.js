/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,   
    
    //assetPrefix: 'https://computacion.unl.edu.ec/sfv',
    env:{
	    path: 'https://computacion.unl.edu.ec/sfv/solar/',
        path_media: 'https://computacion.unl.edu.ec/sfv/energia_a/',
        api: 'https://computacion.unl.edu.ec/sfv/solar_b/api/',
        //path: 'http://localhost:3000/',
        //path_media: 'http://localhost/energia/',
        //api: 'http://localhost:5000/api/'
        
    }
    

}

module.exports = nextConfig
