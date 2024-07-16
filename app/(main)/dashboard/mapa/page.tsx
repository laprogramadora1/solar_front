'use client';
//mapa
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
//---
import 'primeflex/primeflex.css';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Card } from 'primereact/card';

import { Toast } from 'primereact/toast';

import { sitios } from '../../../../hooks/servicioSitio';
import { get } from '../../../../hooks/utiles/utiles';
import message from '../../../../component/message';

const Mapa = () => {

    const ruote = useRouter();
    const base_url = process.env.path;
    const myToast = useRef(null);
    //let [provincia, setProvincias] = useState([]);

    let [sitio, setSitio] = useState([]);
    let [position, setPosition] = useState({ lat: -3.9995012796787754, lng: -79.1999205186457 })


    useEffect(() => {
        //fuentes
        sitios(get("token")).then((data) => {

            const info = data.props.data;
            console.log(info);
            if (info.code == '200') {
                setSitio(info.datos);
                myToast.current?.show({ severity: "success", summary: "Respuesta", detail: "Carga existosa" });
                //ruote.push(base_url + "dashboard/sitio");
            } else {
                if (data.props.data.code == '401') {
                    //myToast.current?.show({ severity: "error", summary: "Respuesta", detail: data.props.data.datos.error });
                    message("Token no existe, inicie sesion", "Error de verificacion", "error");
                    ruote.push(base_url + "auth/login");
                } else {
                myToast.current?.show({ severity: "error", summary: "Respuesta", detail: info.msg });
            }
            }
            //setSitio(data.props.data.datos);
        });

        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            //console.log("Hola");
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;

                //setPosition({ lat: latitude, lng: longitude });
            }, ({ error }) => {
                //setPosition({ lat: -3.9935012796787754, lng: -79.2099205186457 });
            });
        } else {
            //setPosition({ lat: -3.9935012796787754, lng: -79.2099205186457 });
        }
    }, []);


  
    return (

        <div className="col-12 xl:col-12">
            <Toast ref={myToast} />
            <Card title="Registrar sitios">
                <div className="my-2">
                    <div className="p-field p-grid" style={{ margin: "10px" }}>
                        <label htmlFor="firstname4" className="p-col-fixed" ><b>Posicion</b></label>
                        <MapContainer center={position} zoom="15" style={{ height: '400px', width: '1000px' }}>
                            <div className='col'>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                />
                            </div>
                            {sitio && sitio.map((dato, i) => (
                                <Marker key={i} position={{ lat: dato.latitud, lng: dato.longitud }}>
                                    <Popup>{dato.nombre}</Popup>
                                </Marker>
                            ))}

                        </MapContainer>
                    </div>
                </div>
            </Card>
        </div>
    );
};
export default Mapa;
