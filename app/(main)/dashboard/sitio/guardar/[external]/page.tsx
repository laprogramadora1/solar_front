'use client';
//mapa
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
//---
import 'primeflex/primeflex.css';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Card } from 'primereact/card';

import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { save_sitio, sitios_cantones } from '../../../../../../hooks/servicioSitio';
import { fuentes } from '../../../../../../hooks/servicios';
import { getCantones } from '../../../../../../hooks/servicioCanton';
import { get } from '../../../../../../hooks/utiles/utiles';
import message from '../../../../../../component/message';
const GuardarCanton = ({ params }) => {
    const external = params.external;
    const ruote = useRouter();
    const base_url = process.env.path;
    //let [provincia, setProvincias] = useState([]);
    let [provincia, setProvincia] = useState('');
    let [canton, setCanton] = useState('');
    let [sitio, setSitio] = useState([]);
    let [fuente, setFuente] = useState([]);
    let [fuent, setFuent] = useState(null);
    let [position, setPosition] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const myToast = useRef(null);
    useEffect(() => {
        //fuentes
        sitios_cantones(external, get('token')).then((data) => {
            if (data.props.data.code == '200') {
                setSitio(data.props.data.datos);
            } else {
                setSitio([]);
                if (data.props.data.code == '401') {
                    myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: data.props.data.datos.error });
                } else {
                    myToast.current?.show({ severity: 'error', summary: 'Error', detail: data.props.data.datos });
                }
            }
        });
        fuentes().then((data) => {
            if (data.props.data.code == '200') {
                let datito = [];
                var i = 0;
                data.props.data.datos.forEach((element) => {
                    datito[i] = { label: element.value, value: element.key };
                    i++;
                });
                setFuente(datito);
            } else {
                setFuente([]);
                if (data.props.data.code == '401') {
                    myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: data.props.data.datos.error });
                } else {
                    myToast.current?.show({ severity: 'error', summary: 'Error', detail: data.props.data.datos });
                }
            }
        });
        getCantones(external, get('token')).then((data) => {
            if (data.props.data.code == '200') {
                console.log('xxx');
                setCanton(data.props.data.datos.nombre);
                setProvincia(data.props.data.datos.prov);
            } else {
                setCanton('');
                setProvincia('');
                if (data.props.data.code == '401') {
                    //myToast.current?.show({ severity: "error", summary: "Respuesta", detail: data.props.data.datos.error });
                    message('Token no existe, inicie sesion', 'Error de verificacion', 'error');
                    ruote.push(base_url + 'auth/login');
                } else {
                    myToast.current?.show({ severity: 'error', summary: 'Error', detail: data.props.data.datos });
                }
            }
        });

        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            //console.log("Hola");
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    const { latitude, longitude } = coords;

                    setPosition({ lat: latitude, lng: longitude });
                },
                (error) => {
                    setPosition({ lat: -3.9935012796787754, lng: -79.2099205186457 });
                }
            );
        } else {
            setPosition({ lat: -3.9935012796787754, lng: -79.2099205186457 });
        }
    }, []);

    /* 
    Validations
    */
    const validationShema = Yup.object().shape({
        nombre: Yup.string().trim().required('Ingrese un dato'),
        prov: Yup.string().trim().required('Seleccione una fuente'),

        ubicacion: Yup.string().trim().required('Ingrese la ubicacion'),
        irradiacion: Yup.number().required('Ingrese un dato'),
        promedio: Yup.number().required('Ingrese un dato')
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    let { errors } = formState;

    const sendInfo = (datos) => {
        const aux = {
            nombre: datos.nombre,
            longitud: position.lng,
            latitud: position.lat,
            external_canton: external,
            ubicacion: datos.ubicacion,
            promedio: datos.promedio,
            irradiacion: datos.irradiacion,
            fuente: datos.prov
        };

        save_sitio(aux, get('token')).then((data) => {
            console.log(data.props.datos);
            const info = data.props.datos;
            if (info.code == '200') {
                message('Sitio registrado', 'Operacion exitosa!');
                //myToast.current?.show({ severity: "success", summary: "Respuesta", detail: info.datos });
                ruote.push(base_url + 'dashboard/sitio');
            } else {
                myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'Faltan datos' });
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

    function Mapaclick() {
        const map = useMapEvents({
            click: (e) => {
                console.log(e);
                const { lat, lng } = e.latlng;
                setPosition({ lat: lat, lng: lng });
                e.target.eachLayer((layer) => {
                    if (layer instanceof L.marker) {
                        //layer.remove();
                        e.target.removeLayer(layer);
                    }
                });

                L.marker([lat, lng]).addTo(map);
            }
        });
        return null;
    }

    return (
        <div className="col-12 xl:col-12">
            <Toast ref={myToast} />
            <Card title="Registrar sitios">
                <div className="my-2">
                    <form onSubmit={handleSubmit(sendInfo)} className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label className="p-col-fixed">
                                <b>Provincia: </b>
                                {provincia}
                            </label>
                        </div>
                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label className="p-col-fixed">
                                <b>Canton: </b>
                                {canton}
                            </label>
                        </div>
                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label htmlFor="firstname3" className="p-col-fixed">
                                <b>Nombre del sitio</b>
                            </label>
                            <div className="p-col">
                                <InputText id="firstname3" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el nombre del sitio" {...register('nombre')} autoFocus />
                            </div>
                            {errors.nombre && (
                                <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                    {errors.nombre?.message}
                                </small>
                            )}
                        </div>

                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label htmlFor="firstname3" className="p-col-fixed">
                                <b>Fuente</b>
                            </label>
                            <div className="p-col">
                                <Dropdown
                                    value={fuent}
                                    {...register('prov')}
                                    options={fuente}
                                    onChange={(e) => {
                                        setFuent(e.value);
                                    }}
                                    placeholder="Seleccione una fuente"
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
                                <b>Irradiacion</b>
                            </label>
                            <div className="p-col">
                                <InputText id="firstname3" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el valor de la irradiacion" {...register('irradiacion')} autoFocus />
                            </div>
                            {errors.irradiacion && (
                                <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                    {errors.irradiacion?.message}
                                </small>
                            )}
                        </div>

                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label htmlFor="firstname3" className="p-col-fixed">
                                <b>Promedio</b>
                            </label>
                            <div className="p-col">
                                <InputText id="firstname3" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el promedio de irradiacion por anual" {...register('promedio')} autoFocus />
                            </div>
                            {errors.promedio && (
                                <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                    {errors.promedio?.message}
                                </small>
                            )}
                        </div>

                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label htmlFor="firstname4" className="p-col-fixed">
                                <b>Posicion</b>
                            </label>
                            {position && (
                                <MapContainer center={position} zoom={18} style={{ height: '400px', width: 'auto' }}>
                                    <div className="col">
                                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    </div>
                                    <Mapaclick />
                                    {position === null ? null : (
                                        <Marker position={position}>
                                            <Popup>You are here</Popup>
                                        </Marker>
                                    )}
                                </MapContainer>
                            )}

                            <InputText id="firstname3" type="text" style={{ marginTop: '10px' }} defaultValue={position && position.lat} placeholder="Ingrese la latitud" readOnly autoFocus />

                            <InputText id="firstname31" type="text" style={{ marginTop: '10px' }} defaultValue={position && position.lng} readOnly placeholder="Ingrese la longitud" autoFocus />
                        </div>

                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label htmlFor="firstname5" className="p-col-fixed">
                                <b>Ubicacion</b>
                            </label>
                            <div className="p-col">
                                <InputText id="firstname3" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese la ubicacion" {...register('ubicacion')} autoFocus />
                            </div>
                            {errors.ubicacion && (
                                <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                    {errors.ubicacion?.message}
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
                                    ruote.push(base_url + 'dashboard/sitio');
                                }}
                            />
                        </div>
                    </form>
                </div>
                <Card title="Sitios registrados a este canton">
                    <DataTable value={sitio} rows={10} paginator dataKey="external" emptyMessage="No hay datos." className="datatable-responsive" header={header} globalFilter={globalFilter} responsiveLayout="scroll">
                        <Column body={(data, options) => options.rowIndex + 1} header="#" sortable style={{ width: '15%' }} />
                        <Column field="nombre" header="Sitio" sortable style={{ width: '35%' }} />

                        <Column field="fuente" header="Fuente" sortable style={{ width: '35%' }} />
                        <Column field="irradiacion" header="Irradiacion" sortable style={{ width: '35%' }} />
                        <Column field="promedio" header="Promedio anual" sortable style={{ width: '35%' }} />
                        <Column field="estado" header="Estado" style={{ width: '25%' }} />
                    </DataTable>
                </Card>
            </Card>
        </div>
    );
};
export default GuardarCanton;
