'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
//import { ProductService } from '../../demo/service/ProductService';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import Link from 'next/link';
import { Demo } from '../../../types/types';
import { ChartData, ChartOptions } from 'chart.js';
import { sitios } from '../../../hooks/servicioSitio';
import { totales } from '../../../hooks/servicios';
import { get, isSession } from '../../../hooks/utiles/utiles';
import { useRouter } from 'next/navigation';
import message from '../../../component/message';
const Dashboard = () => {
    //const [products, setProducts] = useState<Demo.Product[]>([]);
    const [sitio, setSitio] = useState(null);
    const [total, setTotal] = useState(null);
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);
    const base_url = process.env.path;
    const route = useRouter();
    //route.refresh();
    useEffect(() => {
        console.log(window.innerWidth);
        console.log(window.innerHeight);
    }, []);
    let aux = isSession();
    if (!aux) {
        route.push(base_url + 'auth/login');
    }
    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        totales().then((data) => {
            console.log(data.props.data);
            setTotal(data.props.data.datos);
        });
    }, []);

    useEffect(() => {
        //KEY get("token")
        sitios(get('token')).then((data) => {
            console.log('XXXX');
            //console.log(data.props);
            if (data.props.data.code == '200') {
                setSitio(data.props.data.datos);
            } else {
                if (data.props.data.code == '401') {
                    message('Token no existe, inicie sesion', 'Error de verificacion', 'error');
                    route.push(base_url + 'auth/login');
                }
            }
        });
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Provincias</span>
                            <div className="text-900 font-medium text-xl">
                                <b>{total && total.prov}</b>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{total && total.prov} nuevas </span>
                    <span className="text-500">Provincias</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Cantones</span>
                            <div className="text-900 font-medium text-xl">{total && total.canton}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{total && total.canton} nuevos</span>
                    <span className="text-500">Cantones</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Sitios</span>
                            <div className="text-900 font-medium text-xl">{total && total.sitios}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{total && total.sitios} </span>
                    <span className="text-500">nuevos registrados</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Usuarios</span>
                            <div className="text-900 font-medium text-xl">{total && total.user} Usuarios</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{total && total.user} </span>
                    <span className="text-500">usando nuestro sistema</span>
                </div>
            </div>

            <div className="col-12 xl:col-12">
                <div className="card">
                    <h5>Parroquias (Sitios) registradas</h5>
                    {sitio && (
                        <DataTable value={sitio} rows={10} paginator responsiveLayout="scroll">
                            <Column body={(data, options) => options.rowIndex + 1} header="#" sortable style={{ width: '15%' }} />
                            <Column field="nombre" header="Sitio" sortable style={{ width: '35%' }} />
                            <Column field="canton" header="Canton" sortable style={{ width: '25%' }} />
                            <Column field="provincia" header="Provicia" sortable style={{ width: '25%' }} />
                        </DataTable>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
