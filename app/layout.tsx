'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const base_only_images = process.env.path_only_images;
	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
	const cspHeader = `
  default-src 'self' https://computacion.unl.edu.ec/sfv ;
  script-src 'self' 'nonce-${nonce}' https://computacion.unl.edu.ec/sfv;

  style-src 'self' https://fonts.googleapis.com 'unsafe-inline' ;
  
  img-src 'self' blob: data:;
  font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  block-all-mixed-content;
  upgrade-insecure-requests;
`;	

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
		    
		
                <link id="theme-css" href={base_only_images+`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            
	</head>
            <body>
                <PrimeReactProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
