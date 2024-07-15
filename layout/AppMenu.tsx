/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const base_url = process.env.path;
    const model: AppMenuItem[] = [
        {
            label: 'Principal',
            items: [{ label: 'Principal', icon: 'pi pi-fw pi-home', to: base_url+'dashboard' }]
        },
        {
            label: 'Administrar',
            items: [
                { label: 'Usuarios', icon: 'pi pi-fw pi-user', to: base_url+'dashboard/usuario' },
                { label: 'Provincia', icon: 'pi pi-fw pi-id-card', to: base_url+'dashboard/provincia' },
                { label: 'Canton', icon: 'pi pi-fw pi-check-square', to: base_url+'dashboard/canton' },
                { label: 'Sitio', icon: 'pi pi-fw pi-bookmark', to: base_url+'dashboard/sitio' },
                
                
            ]
        },
        {
            label: 'Mapa',
            items: [
                { label: 'Mapa de sitios registrados', icon: 'pi pi-fw pi-map', to: base_url+'dashboard/mapa' }
            ]
        }
        
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
