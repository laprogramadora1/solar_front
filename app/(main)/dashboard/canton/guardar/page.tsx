'use client';
import 'primeflex/primeflex.css';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { provincias } from '../../../../../hooks/servicios';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Card } from 'primereact/card';
import { provincias_activate } from '../../../../../hooks/servicioProvincia';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { cantones_provincia, save } from '../../../../../hooks/servicioCanton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { get } from '../../../../../hooks/utiles/utiles';
import message from '../../../../../component/message';
const GuardarCanton = () => {
    const ruote = useRouter();
    const base_url = process.env.path;
    let [provincia, setProvincias] = useState([]);
    let [canton, setCanton] = useState([]);
    let [prov, setProv] = useState('');
    const [globalFilter, setGlobalFilter] = useState('');
    /* 
    Validations
    */
    const validationShema = Yup.object().shape({
        nombre: Yup.string().trim().required('Ingrese un dato'),
        prov: Yup.string().trim().required('Seleccione una provincia')
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    let { errors } = formState;
    const myToast = useRef(null);

    useEffect(() => {
        provincias_activate(get('token')).then((data) => {
            console.log(data.props.data);
            if (data.props.data.code == '200') {
                let datito = [];
                var i = 0;
                data.props.data.datos.forEach((element) => {
                    datito[i] = { label: element.nombre, value: element.external };
                    i++;
                });
                setProvincias(datito);
            } else {
                if (data.props.data.code == '401') {
                    myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: data.props.data.datos.error });
                }
            }
        });
    }, []);
    //CARGAR CANTONES
    const list_canton = function (valor) {
        //if (prov) {
        cantones_provincia(valor, get('token')).then((data) => {
            if (data.props.data.code == '200') {
                setCanton(data.props.data.datos);
            } else {
                setCanton([]);
                if (data.props.data.code == '401') {
                    //myToast.current?.show({ severity: "error", summary: "Respuesta", detail: data.props.data.datos.error });
                    message('Token no existe, inicie sesion', 'Error de verificacion', 'error');
                    ruote.push(base_url + 'auth/login');
                }
            }

            //console.log(data.props.data);
            //let datito = [];
            //var i = 0;
            /*data.props.data.datos.forEach(element => {
                    datito[i] = { "label": element.nombre, "value": element.external };
                    i++;
                });
                setProvincias(datito);*/
        });
        //  }
    };
    const sendInfo = (datos) => {
        const aux = { external: prov, nombre: datos.nombre };
        console.log(aux);
        save(aux, get('token')).then((data) => {
            console.log(data.props.datos);
            const info = data.props.datos;
            if (info.code == '200') {
                myToast.current?.show({ severity: 'success', summary: 'Respuesta', detail: info.datos });
                ruote.push(base_url + 'dashboard/canton');
            } else {
                if (data.props.data.code == '401') {
                    //myToast.current?.show({ severity: "error", summary: "Respuesta", detail: data.props.data.datos.error });
                    message('Token no existe, inicie sesion', 'Error de verificacion', 'error');
                    ruote.push(base_url + 'auth/login');
                } else {
                    myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'Faltan datos' });
                }
            }
            //setSitio(data.props.data.datos);
        });
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tabla</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    return (
        <div className="col-12 xl:col-12">
            <Toast ref={myToast} />
            <Card title="Registrar cantones">
                <div className="my-2">
                    <form onSubmit={handleSubmit(sendInfo)} className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label htmlFor="firstname3" className="p-col-fixed">
                                <b>Nombre</b>
                            </label>
                            <div className="p-col">
                                <Dropdown
                                    value={prov}
                                    {...register('prov')}
                                    options={provincia}
                                    onChange={(e) => {
                                        setProv(e.value);
                                        list_canton(e.value);
                                    }}
                                    placeholder="Seleccione una provincia"
                                />
                            </div>
                            {errors.prov && (
                                <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                    {errors.prov?.message}
                                </small>
                            )}
                        </div>
                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label htmlFor="firstname3" className="p-col-fixed">
                                <b>Nombre</b>
                            </label>
                            <div className="p-col">
                                <InputText id="firstname3" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el nombre del canton" {...register('nombre')} autoFocus />
                            </div>
                            {errors.nombre && (
                                <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                    {errors.nombre?.message}
                                </small>
                            )}
                        </div>

                        <div className="p-field p-col-12 p-md-3" style={{ margin: '10px' }}>
                            <Button label="Guardar" icon="pi pi-check" type="submit" />
                            <Button
                                label="Cancelar"
                                icon="pi pi-times"
                                text
                                onClick={(e) => {
                                    ruote.push(base_url + 'dashboard/canton');
                                }}
                            />
                        </div>
                    </form>
                </div>
                <Card title="Cantones registrados a esas provincias">
                    <DataTable value={canton} dataKey="external" rows={10} paginator responsiveLayout="scroll" emptyMessage="No hay datos." className="datatable-responsive" header={header} globalFilter={globalFilter}>
                        <Column body={(data, options) => options.rowIndex + 1} header="#" sortable style={{ width: '15%' }} />
                        <Column field="nombre" header="Nombre" sortable style={{ width: '35%' }} />
                        <Column field="prov" header="Provincia" sortable style={{ width: '25%' }} />
                        <Column field="estado" header="Estado" style={{ width: '25%' }} />
                    </DataTable>
                </Card>
            </Card>
        </div>
    );
};
export default GuardarCanton;
