/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,   
    
    //assetPrefix: 'https://computacion.unl.edu.ec/sfv',
    env:{
	    //path: 'https://computacion.unl.edu.ec/sfv/solar/',
        path_media: '/img/',
        //path_media: 'https://computacion.unl.edu.ec/sfv/energia_a/',
        api: 'http://172.19.0.2:5000/api/',
        //path: 'http://localhost:8000/',
        path: '/',
        //path_media: 'http://localhost/energia/',
        //api: 'http://localhost:5000/api/'
        
    }
    

}

module.exports = nextConfig
