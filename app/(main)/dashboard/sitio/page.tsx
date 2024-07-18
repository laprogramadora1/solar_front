'use client';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
//import { provincias } from '../../../../hooks/servicios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { cantones, cantones_provincia } from '../../../../hooks/servicioCanton';
import { provincias } from '../../../../hooks/servicioProvincia';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { sitios_cantones } from '../../../../hooks/servicioSitio';
import { Toast } from 'primereact/toast';
import { get } from '../../../../hooks/utiles/utiles';
import message from '../../../../component/message';

const ListaSitio = () => {
    const ruote = useRouter();
    const base_url = process.env.path;
    const [provincia, setProvincia] = useState([]);
    const [prov, setProv] = useState(null);
    const [canton, setCanton] = useState([]);
    const [cant, setCant] = useState(null);
    const [sitio, setSitio] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const myToast = useRef(null);
    useEffect(() => {
        provincias(get('token')).then((data) => {
            //console.log(data.props.data);
            if (data.props.data.code == '200') {
                let datito = [];
                var i = 0;
                data.props.data.datos.forEach((element) => {
                    datito[i] = { label: element.nombre, value: element.external };
                    i++;
                });
                setProvincia(datito);
                //setProvincia(data.props.data.datos);
            } else {
                if (data.props.data.code == '401') {
                    //myToast.current?.show({ severity: "error", summary: "Respuesta", detail: data.props.data.datos.error });
                    message('Token no existe, inicie sesion', 'Error de verificacion', 'error');
                    ruote.push(base_url + 'auth/login');
                } else {
                    myToast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error Uknow' });
                }
            }
        });
    }, []);

    const list_canton = function (valor) {
        console.log(valor);
        cantones_provincia(valor, get('token')).then((data) => {
            setSitio([]);
            setCant(null);
            if (data.props.data.code == '200') {
                let datito = [];
                var i = 0;
                data.props.data.datos.forEach((element) => {
                    datito[i] = { label: element.nombre, value: element.external };
                    i++;
                });
                setCanton(datito);
            } else {
                setCanton([]);
                if (data.props.data.code == '401') {
                    myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: data.props.data.datos.error });
                } else {
                    myToast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error Uknow' });
                }
            }
        });
    };

    const list_sitios = function (valor) {
        sitios_cantones(valor, get('token')).then((data) => {
            console.log(data + valor);
            setCant(valor);
            if (data.props.data.code == '200') {
                setSitio(data.props.data.datos);
            } else {
                setSitio([]);
                if (data.props.data.code == '401') {
                    myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: data.props.data.datos.error });
                } else {
                    myToast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error Uknow' });
                }
            }
        });
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Sitos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const searchBodyTemplate = (value) => {
        //console.log(value);
        return (
            <div>
                <Link style={{ margin: '10px' }} href={base_url + 'dashboard/sitio/modificar/' + value.external}>
                    <b className="pi pi-pencil"></b>
                </Link>
                <Link style={{ margin: '10px' }} href={base_url + 'dashboard/censo/' + value.external}>
                    <b className="pi pi-book"></b>
                </Link>
            </div>
        ); //<Button icon="pi pi-search" />;
    };

    return (
        <div className="grid">
            <Toast ref={myToast} />
            <div className="col-12 xl:col-12">
                <div className="card">
                    <h5>Sitios registrados</h5>
                    <Card>
                        <div className="card">
                            <div className="p-field p-grid" style={{ margin: '10px' }}>
                                <label htmlFor="firstname3" className="p-col-fixed">
                                    <b>Provincia</b>
                                </label>
                                <div className="p-col">
                                    <Dropdown
                                        value={prov}
                                        options={provincia}
                                        onChange={(e) => {
                                            setProv(e.value);
                                            list_canton(e.value);
                                        }}
                                        placeholder="Seleccione una provincia"
                                    />
                                </div>
                            </div>
                            <div className="p-field p-grid" style={{ margin: '10px' }}>
                                <label htmlFor="firstname2" className="p-col-fixed">
                                    <b>Canton</b>
                                </label>
                                <div className="p-col">
                                    <Dropdown
                                        value={cant}
                                        options={canton}
                                        onChange={(e) => {
                                            setCant(e.value);
                                            list_sitios(e.value);
                                        }}
                                        placeholder="Seleccione un canton"
                                    />
                                </div>
                            </div>
                            <div className="p-field p-grid" style={{ margin: '10px' }}>
                                {cant && (
                                    <Link style={{ marginTop: '20px' }} href={base_url + 'dashboard/sitio/guardar/' + cant}>
                                        <b className="pi pi-plus"> NUEVO</b>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </Card>
                    <DataTable value={sitio} rows={10} paginator dataKey="external" emptyMessage="No hay datos." className="datatable-responsive" header={header} globalFilter={globalFilter} responsiveLayout="scroll">
                        <Column body={(data, options) => options.rowIndex + 1} header="#" sortable style={{ width: '15%' }} />
                        <Column field="nombre" header="Sitio" sortable style={{ width: '35%' }} />

                        <Column field="fuente" header="Fuente" sortable style={{ width: '35%' }} />
                        <Column field="irradiacion" header="Irradiacion" sortable style={{ width: '35%' }} />
                        <Column field="promedio" header="Promedio anual" sortable style={{ width: '35%' }} />
                        <Column field="estado" header="Estado" style={{ width: '25%' }} />
                        <Column header="Acciones" body={searchBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
export default ListaSitio;
