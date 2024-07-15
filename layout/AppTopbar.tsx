/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import { removeKey } from '../hooks/utiles/utiles';
import { useRouter } from 'next/navigation';
import { Tooltip } from 'primereact/tooltip';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));
    const router = useRouter();
    const close = () => {
        //console.log("HOLA");
        removeKey('token');
        removeKey('user');
        removeKey('permiso');    
        router.push('/auth/login');    
    }
    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>Calculadora solar. Administrador</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>
            <Tooltip target=".perfil" mouseTrack mouseTrackLeft={10} position='left'/>
            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                
                <button type="button" onClick={(e)=>router.push('/dashboard/perfil')}  className="p-link layout-topbar-button perfil" data-pr-tooltip="Perfil">
                    <i className="pi pi-user"></i>
                    <span>Perfil</span>
                </button>
               
                    <button onClick={() => {
                        const confirmBox = window.confirm(
                            "Desea salir del sistema?"
                        )
                        if (confirmBox === true) {
                            close();

                        }
                    }} type="button" className="p-link layout-topbar-button perfil"  data-pr-tooltip='Cerrar'>
                        <i className="pi pi-power-off"></i>
                        <span>Salir</span>
                    </button>
                
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
