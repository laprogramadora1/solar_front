"use client";
import { Metadata } from 'next';
import AppConfig from '../../layout/AppConfig';

import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { NodeRef } from '../../types/types';
import { classNames } from 'primereact/utils';
import {isSession} from "../../hooks/utiles/utiles";
import { useRouter } from 'next/navigation';
interface SimpleLayoutProps {
    children: React.ReactNode;
}



export default function SimpleLayout({ children }: SimpleLayoutProps) {
    const URL = process.env.path;
    const URL_MEDIA = process.env.path_media;
    const [isHidden, setIsHidden] = useState(false);
    const [verify, setVerify] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef<HTMLElement | null>(null);
    const route = useRouter();
    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };
    useEffect(() => {
        let aux = isSession();
        setVerify(aux);
        if(aux){
            route.push(URL + "dashboard");
        }
    }, []);
    
    useEffect(() => {
        let aux = isSession();
        setVerify(aux);
    }, [isSession]);
    return (
        <div className="surface-0 flex justify-content-center" >
            <div id="home"  className="landing-wrapper overflow-hidden">
            
                {verify == false && <div style={{ background: "black"}} className="py-4 px-4 mx-0 md:mx-12 lg:mx-12 lg:px-8 flex align-items-center justify-content-between relative lg:static">
                    <Link href={URL + ''} className="flex align-items-center">
                        <img src={URL_MEDIA + 'logo.png'} alt="Sakai Logo" height="90" className="mr-0 lg:mr-2" />
                        <span className="text-900  font-medium text-2xl line-height-3 mr-8" ><b style={{ color: "white" }}>AUTOCONSUMO FOTOVOLTAICO ECUADOR</b></span>

                    </Link>
                    <StyleClass  nodeRef={menuRef as NodeRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick>
                        <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
                    </StyleClass>
                    <div className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ backgroundColor: "black", top: '100%' }}>
                        <ul style={{ background: "black", width:"100%" }} className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                            <li>
                                <Link href={URL + ''} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"><span style={{ color: "white" }}><b>Inicio</b></span></Link>

                            </li>
                            <li>
                                <Link href={URL + "calculos"} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"><span style={{ color: "white" }}><b>Calculadora fotovoltaica</b></span></Link>

                            </li>
                            <li>
                                <Link href={URL + "auth/login"} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"><span style={{ color: "white" }}><b>Iniciar sesion</b></span></Link>
                            </li>

                        </ul>

                    </div>
                </div>}
                <React.Fragment>
                    {children}
                    <AppConfig simple />
                </React.Fragment>
            </div>

        </div>

    );
}
