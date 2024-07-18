'use client';
//mapa
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
//---
import 'primeflex/primeflex.css';
import React, { useContext, useEffect, useRef, useState } from 'react';

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

import { getSitiosNombres } from '../../../../../hooks/servicioSitio';
import { censos_sitio, save_censo } from '../../../../../hooks/servicioCenso';
import { Divider } from 'primereact/divider';
import { get } from '../../../../../hooks/utiles/utiles';
import message from '../../../../../component/message';

const GuardarCenso = ({ params }) => {
    const external = params.external;
    const ruote = useRouter();
    const base_url = process.env.path;
    //let [provincia, setProvincias] = useState([]);

    let [sitio, setSitio] = useState(null);
    let [censos, setCensos] = useState([]);
    let [meses, setMeses] = useState(null);
    let [irra, setIrra] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');

    /* 
   Validations
   */
    const validationShema = Yup.object().shape({
        irradiacion: Yup.number().required('Ingrese un dato'),
        enero: Yup.number().required('Ingrese un valor'),
        febrero: Yup.number().required('Ingrese un valor'),
        marzo: Yup.number().required('Ingrese un valor'),
        abril: Yup.number().required('Ingrese un valor'),
        mayo: Yup.number().required('Ingrese un valor'),
        junio: Yup.number().required('Ingrese un valor'),
        julio: Yup.number().required('Ingrese un valor'),
        agosto: Yup.number().required('Ingrese un valor'),
        septiembre: Yup.number().required('Ingrese un valor'),
        octubre: Yup.number().required('Ingrese un valor'),
        noviembre: Yup.number().required('Ingrese un valor'),
        diciembre: Yup.number().required('Ingrese un valor')
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState, reset } = useForm(formOptions);
    let { errors } = formState;
    const myToast = useRef(null);

    useEffect(() => {
        //fuentes
        getSitiosNombres(external, get('token')).then((data) => {
            let mes = {
                enero: 0.0,
                febrero: 0.0,
                marzo: 0.0,
                abril: 0.0,
                mayo: 0.0,
                junio: 0.0,
                julio: 0.0,
                agosto: 0.0,
                septiembre: 0.0,
                octubre: 0.0,
                noviembre: 0.0,
                diciembre: 0.0
            };
            reset(mes);
            setMeses(mes);
            if (data.props.data.code == '200') {
                //console.log(data.props.data.datos.irradiacion);
                setSitio(data.props.data.datos);
                setIrra(data.props.data.datos.promedio);

                censos_sitio(external, get('token')).then((data) => {
                    let suma = 0.0;
                    if (data.props.data.code == '200') {
                        setCensos(data.props.data.datos);
                        if (data.props.data.datos.length > 0) {
                            const datos = data.props.data.datos;
                            for (let i in datos) {
                                //console.log(meses.enero);
                                //console.log(datos[i]);
                                suma += datos[i].irradiacion;
                                if (datos[i].mes == 'ENERO') {
                                    mes.enero = datos[i].irradiacion;
                                }
                                if (datos[i].mes == 'FEBRERO') {
                                    mes.febrero = datos[i].irradiacion;
                                }
                                if (datos[i].mes == 'MARZO') {
                                    mes.marzo = datos[i].irradiacion;
                                }
                                if (datos[i].mes == 'ABRIL') {
                                    mes.abril = datos[i].irradiacion;
                                }
                                if (datos[i].mes == 'MAYO') {
                                    mes.mayo = datos[i].irradiacion;
                                }
                                if (datos[i].mes == 'JUNIO') {
                                    mes.junio = datos[i].irradiacion;
                                }
                                if (datos[i].mes == 'JULIO') {
                                    mes.julio = datos[i].irradiacion;
                                }
                                if (datos[i].mes == 'AGOSTO') {
                                    mes.agosto = datos[i].irradiacion;
                                }
                                if (datos[i].mes == 'SEPTIEMBRE') {
                                    mes.septiembre = datos[i].irradiacion;
                                }
                                if (datos[i].mes == 'OCTUBRE') {
                                    mes.octubre = datos[i].irradiacion;
                                }
                                if (datos[i].mes == 'NOVIEMBRE') {
                                    mes.noviembre = datos[i].irradiacion;
                                }
                                if (datos[i].mes == 'DICIEMBRE') {
                                    mes.diciembre = datos[i].irradiacion;
                                }
                            }
                        }

                        reset(mes);
                        setMeses(mes);
                    } else {
                        setCensos([]);
                        reset(mes);
                        setMeses(mes);
                        if (data.props.data.code == '401') {
                            //myToast.current?.show({ severity: "error", summary: "Respuesta", detail: data.props.data.datos.error });
                            message('Token no existe, inicie sesion', 'Error de verificacion', 'error');
                            ruote.push(base_url + 'auth/login');
                        } else {
                            myToast.current?.show({ severity: 'error', summary: 'Error', detail: data.props.data.datos });
                        }
                    }
                });
            } else {
                setSitio(null);
                setIrra('0.0');
            }
        });
    }, []);

    const sendInfo = (datos) => {
        const aux = {
            enero: datos.enero,
            febrero: datos.febrero,
            marzo: datos.marzo,
            abril: datos.abril,
            mayo: datos.mayo,
            junio: datos.junio,
            julio: datos.julio,
            agosto: datos.agosto,
            septiembre: datos.septiembre,
            octubre: datos.octubre,
            noviembre: datos.noviembre,
            diciembre: datos.diciembre,
            promedio: datos.irradiacion,
            external: external
        };
        console.log(aux);
        save_censo(aux, get('token')).then((data) => {
            console.log(data.props.datos);
            const info = data.props.datos;
            if (info.code == '200') {
                myToast.current?.show({ severity: 'success', summary: 'Respuesta', detail: info.datos });
                ruote.push(base_url + 'dashboard/sitio');
            } else {
                myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'Faltan datos' });
            }
            //setSitio(data.props.data.datos);
        });
        /*save_sitio(aux, "").then((data) => {
            console.log(data.props.datos);
            const info = data.props.datos;
            if (info.code == '200') {
                myToast.current?.show({ severity: "success", summary: "Respuesta", detail: info.datos });
                ruote.push(base_url + "dashboard/sitio");
            } else {
                myToast.current?.show({ severity: "error", summary: "Respuesta", detail: "Faltan datos" });
            }
            //setSitio(data.props.data.datos);
        });*/
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

    const sumas = function (value) {
        //console.log(value.target.id+"  "+value.target.value);
        if (value.target.id == 'enero') {
            meses.enero = value.target.value * 1;
        }
        if (value.target.id == 'febrero') {
            meses.febrero = value.target.value * 1;
        }
        if (value.target.id == 'marzo') {
            meses.marzo = value.target.value * 1;
        }
        if (value.target.id == 'abril') {
            meses.abril = value.target.value * 1;
        }
        if (value.target.id == 'mayo') {
            meses.mayo = value.target.value * 1;
        }
        if (value.target.id == 'junio') {
            meses.junio = value.target.value * 1;
        }
        if (value.target.id == 'julio') {
            meses.julio = value.target.value * 1;
        }
        if (value.target.id == 'agosto') {
            meses.agosto = value.target.value * 1;
        }
        if (value.target.id == 'septiembre') {
            meses.septiembre = value.target.value * 1;
        }
        if (value.target.id == 'octubre') {
            meses.octubre = value.target.value * 1;
        }
        if (value.target.id == 'noviembre') {
            meses.noviembre = value.target.value * 1;
        }
        if (value.target.id == 'diciembre') {
            meses.diciembre = value.target.value * 1;
        }
        var suma = 0.0;
        for (var m in meses) {
            //console.log(meses[m]);
            suma += meses[m];
        }
        suma = suma / 12;
        suma = Math.round(suma * 100) / 100;
        reset({ irradiacion: suma });
        setIrra(suma);
        //suma = meses.enero+meses.febrero+meses.marzo+meses.abril+meses.mayo
    };

    return (
        <div className="col-12 xl:col-12">
            <Toast ref={myToast} />
            <Card title="Registrar Censo por sitio">
                <div className="my-2">
                    <form onSubmit={handleSubmit(sendInfo)} className="p-fluid p-formgrid p-grid">
                        <Divider type="solid">
                            <div className="p-field p-grid" style={{ margin: '10px' }}>
                                <label className="p-col-fixed">
                                    <b>Provincia: </b>
                                    {sitio && sitio.provincia}
                                </label>
                            </div>
                            <div className="p-field p-grid" style={{ margin: '10px' }}>
                                <label className="p-col-fixed">
                                    <b>Canton: </b>
                                    {sitio && sitio.canton}
                                </label>
                            </div>
                            <div className="p-field p-grid" style={{ margin: '10px' }}>
                                <label className="p-col-fixed">
                                    <b>Sitio: </b>
                                    {sitio && sitio.nombre}
                                </label>
                            </div>
                            <div className="p-field p-grid" style={{ margin: '10px' }}>
                                <label className="p-col-fixed">
                                    <b>Fuente: </b>
                                    {sitio && sitio.fuente}
                                </label>
                            </div>
                        </Divider>
                        <div className="flex flex-column md:flex-row">
                            <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
                                <div className=" p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="enero" className="p-col-fixed">
                                            <b>Enero</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText id="enero" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el valor de enero" defaultValue={meses && meses.enero} onKeyUp={(e) => sumas(e)} {...register('enero')} />
                                        </div>
                                        {errors.enero && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.enero?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="febrero" className="p-col-fixed">
                                            <b>Febrero</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText id="febrero" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el valor de febrero" defaultValue={meses && meses.febrero} onKeyUp={(e) => sumas(e)} {...register('febrero')} />
                                        </div>
                                        {errors.febrero && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.febrero?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="marzo" className="p-col-fixed">
                                            <b>Marzo</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText id="marzo" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el valor de marzo" defaultValue={meses && meses.marzo} onKeyUp={(e) => sumas(e)} {...register('marzo')} />
                                        </div>
                                        {errors.marzo && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.marzo?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="abril" className="p-col-fixed">
                                            <b>Abril</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText id="abril" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el valor de abril" defaultValue={meses && meses.abril} onKeyUp={(e) => sumas(e)} {...register('abril')} />
                                        </div>
                                        {errors.abril && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.abril?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="mayo" className="p-col-fixed">
                                            <b>Mayo</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText id="mayo" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el valor de enero" {...register('mayo')} defaultValue={meses && meses.mayo} onKeyUp={(e) => sumas(e)} />
                                        </div>
                                        {errors.mayo && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.mayo?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="junio" className="p-col-fixed">
                                            <b>Junio</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText id="junio" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el valor de junio" defaultValue={meses && meses.junio} onKeyUp={(e) => sumas(e)} {...register('junio')} />
                                        </div>
                                        {errors.junio && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.junio?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-2">
                                <Divider layout="vertical" className="hidden md:flex">
                                    <b></b>
                                </Divider>
                                <Divider layout="horizontal" className="flex md:hidden" align="center">
                                    <b></b>
                                </Divider>
                            </div>
                            <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
                                <div className=" p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="julio" className="p-col-fixed">
                                            <b>Julio</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText id="julio" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el valor de julio" defaultValue={meses && meses.julio} onKeyUp={(e) => sumas(e)} {...register('julio')} />
                                        </div>
                                        {errors.julio && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.julio?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="agosto" className="p-col-fixed">
                                            <b>Agosto</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText id="agosto" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el valor de agosto" defaultValue={meses && meses.agosto} onKeyUp={(e) => sumas(e)} {...register('agosto')} />
                                        </div>
                                        {errors.agosto && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.agosto?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="septiembre" className="p-col-fixed">
                                            <b>Septiembre</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText
                                                id="septiembre"
                                                type="text"
                                                style={{ marginTop: '10px' }}
                                                placeholder="Ingrese el valor de septiembre"
                                                defaultValue={meses && meses.septiembre}
                                                onKeyUp={(e) => sumas(e)}
                                                {...register('septiembre')}
                                            />
                                        </div>
                                        {errors.septiembre && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.septiembre?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="octubre" className="p-col-fixed">
                                            <b>Octubre</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText id="octubre" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el valor de octubre" defaultValue={meses && meses.octubre} onKeyUp={(e) => sumas(e)} {...register('octubre')} />
                                        </div>
                                        {errors.octubre && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.octubre?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="noviembre" className="p-col-fixed">
                                            <b>Noviembre</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText
                                                id="noviembre"
                                                type="text"
                                                style={{ marginTop: '10px' }}
                                                placeholder="Ingrese el valor de noviembre"
                                                defaultValue={meses && meses.noviembre}
                                                onKeyUp={(e) => sumas(e)}
                                                {...register('noviembre')}
                                            />
                                        </div>
                                        {errors.noviembre && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.noviembre?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="p-col-fixed">
                                    <div className="p-field p-grid" style={{ margin: '10px' }}>
                                        <label htmlFor="diciembre" className="p-col-fixed">
                                            <b>Diciembre</b>
                                        </label>
                                        <div className="p-col">
                                            <InputText
                                                id="diciembre"
                                                type="text"
                                                style={{ marginTop: '10px' }}
                                                placeholder="Ingrese el valor de diciembre"
                                                defaultValue={meses && meses.diciembre}
                                                onKeyUp={(e) => sumas(e)}
                                                {...register('diciembre')}
                                            />
                                        </div>
                                        {errors.diciembre && (
                                            <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                                {errors.diciembre?.message}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label htmlFor="firstname3" className="p-col-fixed">
                                <b>Irradiacion</b>
                            </label>
                            <div className="p-col">
                                <InputText id="firstname3" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el valor de la irradiacion" {...register('irradiacion')} defaultValue={irra && irra} readOnly autoFocus />
                            </div>
                            {errors.irradiacion && (
                                <small style={{ marginTop: '10px' }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">
                                    {errors.irradiacion?.message}
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
                <Card title="Censo registrado por sitios en meses">
                    <DataTable value={censos} rows={10} paginator dataKey="external" emptyMessage="No hay datos." className="datatable-responsive" header={header} globalFilter={globalFilter} responsiveLayout="scroll">
                        <Column body={(data, options) => options.rowIndex + 1} header="#" sortable style={{ width: '15%' }} />
                        <Column field="mes" header="Mes" sortable style={{ width: '35%' }} />
                        <Column field="irradiacion" header="Irradiacion" sortable style={{ width: '35%' }} />
                    </DataTable>
                </Card>
            </Card>
        </div>
    );
};
export default GuardarCenso;
