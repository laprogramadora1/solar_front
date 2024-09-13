'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { LayoutContext } from '../../layout/context/layoutcontext';

import { inicio } from '../../hooks/servicios';

const LandingPage = () => {
    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef<HTMLElement | null>(null);
    const URL = process.env.path;
    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };

    useEffect(() => {
        inicio().then((data) => { });
    }, []);
    const URL_MEDIA = process.env.path;
    return (
        <div id="home" className="landing-wrapper overflow-hidden">
            <div
                id="hero"
                className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                style={{
                    background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EEEFAF 0%, #C3E3FA 100%)',
                    clipPath: 'ellipse(150% 87% at 93% 13%)',
                    backgroundImage: 'url(' + '"' + URL + 'img/solar.png")'
                }}
            >
                <div className="col-4 mx-4 md:mx-8 mt-0 md:mt-4 card">
                    <h2 className="text-4xl text-center font-bold text-gray-900 line-height-2">
                        <span className="font-light block">CALCULADORA SOLAR FOTOVOLTAICA</span>
                    </h2>

                    <p className="font-normal text-1xl line-height-3 md:mt-3 text-gray-700">
                        Simula, recibe tu presupuesto y empieza a ahorrar. En base a un valor de consumo medio, te presentaremos una solución para ahorrar en tu factura eléctrica.{' '}
                    </p>
                    <Link className="p-button text-xl border-none mt-3 bg-blue-500 font-normal line-height-3 px-3 text-white" href={URL_MEDIA + "calculos"}>
                        Calculadora
                    </Link>
                </div>
                <div className="flex justify-content-center md:justify-content-end">
                    <img src="/img/escudo_unl.png" style={{ height: '200px' }} alt="Hero Image" className="w-9 md:w-auto" />
                </div>
            </div>

            <div id="features" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                <div className="grid justify-content-center">
                    <div className="col-12 text-center mt-8 mb-4">
                        <h2 className="text-900 font-normal mb-2">Sistema fotovoltaico</h2>

                    </div>

                    <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div
                            style={{
                                height: '160px',
                                padding: '2px',
                                borderRadius: '10px',
                                background: 'linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))'
                            }}
                        >
                            <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                <div
                                    className="flex align-items-center justify-content-center bg-yellow-200 mb-3"
                                    style={{
                                        width: '3.5rem',
                                        height: '3.5rem',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <i className="pi pi-fw pi-users text-2xl text-yellow-700"></i>
                                </div>
                                <h5 className="mb-2 text-900">Sistema fotovoltaico</h5>
                                <span className="text-600">Muy completo.</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div
                            style={{
                                height: '160px',
                                padding: '2px',
                                borderRadius: '10px',
                                background: 'linear-gradient(90deg, rgba(145,226,237,0.2),rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))'
                            }}
                        >
                            <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                <div
                                    className="flex align-items-center justify-content-center bg-cyan-200 mb-3"
                                    style={{
                                        width: '3.5rem',
                                        height: '3.5rem',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <i className="pi pi-fw pi-palette text-2xl text-cyan-700"></i>
                                </div>
                                <h5 className="mb-2 text-900">Gráficas</h5>
                                <span className="text-600">Permite analizar las gráficas generadas por la simulación.</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                        <div
                            style={{
                                height: '160px',
                                padding: '2px',
                                borderRadius: '10px',
                                background: 'linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))'
                            }}
                        >
                            <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                <div
                                    className="flex align-items-center justify-content-center bg-indigo-200"
                                    style={{
                                        width: '3.5rem',
                                        height: '3.5rem',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <i className="pi pi-fw pi-map text-2xl text-indigo-700"></i>
                                </div>
                                <h5 className="mb-2 text-900">Haz tus cálculos fotovoltaicos</h5>
                                <span className="text-600">El sistema permite calcular el ahorro energético al implantar un sistema fotovoltaico.</span>
                            </div>
                        </div>
                    </div>








                    <div className="col-12 mt-8 mb-8 p-2 md:p-8"

                        style={{


                            borderRadius: '20px',
                            background: 'linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))'
                        }}
                    >


                        <div className="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0">
                            <h3 className="text-gray-900 mb-2">Página desarrollada por:</h3>

                            <p className="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4" style={{ maxWidth: '800px' }}>
                                Elizabeth Ureña
                                <p className="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4">
                                    <h3 className="text-gray-900 mb-2">Carrera de Computación</h3>
                                    
                                    <p className="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4" style={{ maxWidth: '800px' }}>
                                        Director: Ing. Jose Guamán
                                    </p>
                                </p>
                            </p>


                            <div className="flex gap-4 mt-4">
                                <img src={URL_MEDIA + "img/logo_computacion.jpg"} style={{ width: '150px' }} alt="Logo Computación" />
                                <img src={URL_MEDIA + "img/escudo_unl.png"} style={{ width: '150px', height: 'auto' }} alt="Logo UNL" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-4 px-4 mx-0 mt-8 lg:mx-8">
                <div className="grid justify-content-between">
                    <div className="col-12 md:col-2" style={{ marginTop: '-1.5rem' }}>
                        <Link href={URL_MEDIA} className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                            <img src={URL_MEDIA + `layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`} alt="footer sections" width="50" height="50" className="mr-2" />
                            <span className="font-medium text-3xl text-900">Energía solar</span>
                        </Link>
                    </div>

                    <div className="col-12 md:col-10 lg:col-7">
                        <div className="grid text-center md:text-left">
                            <div className="col-12 md:col-3">
                                <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Sitio</h4>
                                <Link className="line-height-3 text-xl block cursor-pointer mb-2 text-700" href={URL_MEDIA}>
                                    Inicio
                                </Link>
                                <Link className="line-height-3 text-xl block cursor-pointer mb-2 text-700" href={URL_MEDIA + "calculos"}>
                                    Calculadora
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
