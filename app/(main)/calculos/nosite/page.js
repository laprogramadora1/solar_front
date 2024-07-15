"use client";
import { decode as base64_decode, encode as base64_encode } from 'base-64';

import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

//var utf8 = require('utf8');
import { encode, decode } from 'utf8';
import { useEffect, useRef, useState } from 'react';
import { Chart } from 'primereact/chart';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Slider } from 'primereact/slider';
import { Knob } from 'primereact/knob';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
//import { provincias, cantonesPorProvincia, sitiosPorCanton, postCalculos } from '@/hooks/servicios';
import { provincias, cantonesPorProvincia, sitiosSoloNombrePorCanton, postCalculos, fuentes, edificio, edificio_tarifa, tarifa, postCalculosSinSitio } from '../../../../hooks/servicios';
//import { Link } from 'components';

import { Tag } from 'primereact/tag';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { Fieldset } from 'primereact/fieldset';
import { Divider } from 'primereact/divider';
//import { LayoutContext } from '../../../../layout/context/layoutcontext'; 
//import { userService, alertService } from 'services';


export default function Home() {
    const route = useRouter();
    const base_url = process.env.path;
    const myToast = useRef(null);


    //FORM
    

    let [meses, setMeses] = useState(null);
    const [promedio, setPromedio] = useState(0.0);
    const [sliderValuePotenciaNominal, setSliderValuePotenciaNominal] = useState(0.0);
    const [sliderConsumoMensual, setSliderConsumoMensual] = useState(0.0);
    const [sliderDemanda, setSliderDemanda] = useState(0.0);
    const [sliderAngulo, setSliderAngulo] = useState(0.0);
    const [sliderInclinacion, setSliderInclinacion] = useState(0.0);
    const [sliderEficiencia, setSliderEficiencia] = useState(0.0);
    const [sliderFS, setSliderFS] = useState(0.0);
    const [sliderRendimiento, setSliderRendimiento] = useState(0.0);
    const [sliderCosto, setSliderCosto] = useState(0.0);
    //sliderRendimiento


    const [estadoP, setEstadoP] = useState(false);

    const [listaFuentes, setListaFuentes] = useState([]);
    const [listaTarifa, setListaTarifa] = useState([]);

    const [listaEdificio, setListaEdificio] = useState([]);

    //chart irradiacion plana mensual
    const [chartDataIrradiacion, setChartDataIrradiacion] = useState({});
    const [chartOptionsIrradiacion, setChartOptionsIrradiacion] = useState({});

    //chart factura
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    //tabla

    const [calculos, setCalculos] = useState([]);
    const [eneria, setEnergia] = useState(0.0);
    const [superficie, setSuperficie] = useState(0.0);
    const [ahorro, setAhorro] = useState(0.0);
    const [autoconsumo, setAutoconsumo] = useState(0.0);
    const [relacion, setRelacion] = useState(0.0);
    const [costo, setCosto] = useState(0.0);
    const [retorno, setRetorno] = useState(0.0);

    //MAPA
    const [position, setPosition] = useState(null)
    useEffect(() => {
        let mes = {
            "enero": 0.0,
            "febrero": 0.0,
            "marzo": 0.0,
            "abril": 0.0,
            "mayo": 0.0,
            "junio": 0.0,
            "julio": 0.0,
            "agosto": 0.0,
            "septiembre": 0.0,
            "octubre": 0.0,
            "noviembre": 0.0,
            "diciembre": 0.0
        };
        reset(mes); setMeses(mes);

        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            //console.log("Hola");
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;

                setPosition({ lat: latitude, lng: longitude });
            }, ({ error }) => {
                //-3.9935012796787754, -79.2099205186457
                setPosition({ lat: -3.9935012796787754, lng: -79.2099205186457 });
            });
        } else {
            setPosition({ lat: -3.9935012796787754, lng: -79.2099205186457 });
        }
    }, []);
    //

    const changeSelectOptionTarifa = (event) => {

        if (event.target.value) {
            edificio_tarifa(event.target.value).then((info) => {
                //console.log(info);
                if (info.props.data.message === 'OK') {
                    setListaEdificio(info.props.data.datos);

                }
            });
        }
    };

    if (!estadoP) {


        fuentes().then((info) => {
            if (info.props.data.message === 'OK') {
                setListaFuentes(info.props.data.datos);

            }
        });

        tarifa().then((info) => {
            if (info.props.data.message === 'OK') {
                setListaTarifa(info.props.data.datos);

            }
        });
        setEstadoP(true);

    }

    //<coef_reflexion>/<inclinacion>/<orientacion>/<external>/<potencia>/<eficiencia>/<fs>/<rendimiento>
    const validationSchema = Yup.object().shape({
        coef_reflexion: Yup.number()
            .required('Se requiere el coeficiente de reflexion'),
        inclinacion: Yup.number()
            .required('se requiere la inclinacion'),
        orientacion: Yup.number()
            .required('se requiere la orientacion'),        
        tarifa: Yup.string()
            .required('Se requiere la tarifa'),
        fuente: Yup.string()
            .required('Se requiere la fuente'),
        edificio: Yup.string()
            .required('Se requiere el tipo de edificio'),
        potencia: Yup.number()
            .required('Se requiere la potencia'),
        eficiencia: Yup.number()
            .required('Se requiere la eficiencia'),        
        fs: Yup.number()
            .required('Se requiere el factor de sombras'),
        rendimiento: Yup.number()
            .required('Se requiere el rendimiento'),
        costo_instalacion: Yup.number()
            .required('Se requiere el costo de instalacion'),
        consumo_mensual: Yup.number()
            .required('Se requiere el consumo mensual'),
        demanda_potencia_electronica: Yup.number().required('Se requiere la demanda de potencial electrico en KW'),
        irradiacion: Yup.number()
            .required('Se requiere el promedio'),
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
    //SUMAS
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
        reset({ "promedio": suma });
        setPromedio(suma);
        //setIrra(suma);
        
        //suma = meses.enero+meses.febrero+meses.marzo+meses.abril+meses.mayo

    }
    //FIN SUMAS
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, reset, formState, setValue } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = (data) => {
        
        console.log("-*-*-*-**");
        var tar = listaTarifa.find(dat => dat.external == data.tarifa);
        console.log("-*-*-*-**");
        var datos = {
            "coef_reflexion": data.coef_reflexion,
            "inclinacion": data.inclinacion,
            "orientacion": data.orientacion,
            "potencia": data.potencia,
            "irradiacion": data.irradiacion,
            "eficiencia": data.eficiencia,
            "fuente": data.fuente,
            "fs": data.fs,
            "rendimiento": data.rendimiento,
            "tipo_edificio": tar.nombre + " " + data.edificio,
            "costo_instalacion": data.costo_instalacion,
            "consumo_mensual": data.consumo_mensual,
            "demanda_potencia_electronica": data.demanda_potencia_electronica,
            "lng": position.lng,
            "lat": position.lat,
            "meses": {
                "enero": data.enero,
                "febrero": data.febrero,
                "marzo": data.marzo,
                "abril": data.abril,
                "mayo": data.mayo,
                "junio": data.junio,
                "julio": data.julio,
                "agosto": data.agosto,
                "septiembre": data.septiembre,
                "octubre": data.octubre,
                "noviembre": data.noviembre,
                "diciembre": data.diciembre,
                "promedio": data.promedio                
            }
        };
        console.log("****************");
        console.log(datos);
        postCalculosSinSitio(datos).then((info) => {
            console.log(info);
            if (info.props.datos.message === 'OK') {
                console.log("calculos");
                var aux = info.props.datos.datos[0].calculos;
                var aux1 = [];

                //chartDataIrradiacion
                var plano_horizontal = [];
                var plano_inclinado = [];
                aux.map(function (key, i) {
                    aux1[i] = { "mes": key[0].mes, "dia": key[1].dia, "eps": key[2].eps, "declinacion": key[3].declinacion, "none": key[4].none, "w0": key[5].w0, "w180": key[6].w180, "wsard": key[7].wsard, "ws0": key[8].ws0, "bodm": key[9].bodm, "gdm": key[10].gdm, "ktm": key[11].ktm, "kdm": key[12].kdm, "ddm": key[13].ddm, "bdm0": key[14].bdm0, "bdmab": key[16].bdmab, "ddmab": key[17].ddmab, "rdmab": key[18].rdmab, "idp": key[19].idpmgdm };
                    plano_horizontal[i] = key[10].gdm / 1000;
                    plano_inclinado[i] = key[19].idpmgdm / 1000;
                });
                const f_sin_fv = info.props.datos.datos[5].factura_sin_FV;
                const sin_fv = [];
                console.log('SIN FACTURA');
                console.log(f_sin_fv);
                f_sin_fv.map(function (key, i) {
                    console.log(key);
                    sin_fv[i] = key.valor;
                });
                const f_con_fv = info.props.datos.datos[6].factura_con_FV;
                const con_fv = [];
                f_con_fv.map(function (key, i) {
                    con_fv[i] = key.valor;
                });
                setCalculos(aux1);
                //console.log(aux1);
                //console.log(info.props.datos.datos[4].energia_util_estimada);
                setEnergia(info.props.datos.datos[16].energia_solar_fotovoltaica);
                setSuperficie(info.props.datos.datos[10].superficie);
                setAhorro(info.props.datos.datos[17].ahorro_anual);
                setAutoconsumo(info.props.datos.datos[13].suma_total_autoconsumo);
                setRelacion(info.props.datos.datos[18].relacion_kwh_kwp);
                setCosto(info.props.datos.datos[19].costo_instalacion);
                setRetorno(info.props.datos.datos[20].retorno_inversion);

                //para char data
                const documentStyle = getComputedStyle(document.documentElement);
                const textColor = documentStyle.getPropertyValue('--text-color');
                const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
                const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
                const data = {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    datasets: [
                        {
                            label: 'SIN FV',
                            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                            borderColor: documentStyle.getPropertyValue('--blue-500'),
                            data: sin_fv
                        },
                        {
                            label: 'CON FV',
                            backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                            borderColor: documentStyle.getPropertyValue('--pink-500'),
                            data: con_fv
                        }
                    ]
                };
                const options = {
                    maintainAspectRatio: false,
                    aspectRatio: 0.8,
                    plugins: {
                        legend: {
                            labels: {
                                fontColor: textColor
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: textColorSecondary,
                                font: {
                                    weight: 500
                                }
                            },
                            grid: {
                                display: false,
                                drawBorder: false
                            }
                        },
                        y: {
                            ticks: {
                                color: textColorSecondary
                            },
                            grid: {
                                color: surfaceBorder,
                                drawBorder: false
                            }
                        }
                    }
                };

                setChartData(data);
                setChartOptions(options);

                const dataPlano = {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    datasets: [
                        {
                            label: 'Plano horizontal',
                            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                            borderColor: documentStyle.getPropertyValue('--blue-500'),
                            data: plano_horizontal
                        },
                        {
                            label: 'Plano inclinado',
                            backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                            borderColor: documentStyle.getPropertyValue('--pink-500'),
                            data: plano_inclinado
                        }
                    ]
                };
                const optionsPlano = {
                    maintainAspectRatio: false,
                    aspectRatio: 0.8,
                    plugins: {
                        legend: {
                            labels: {
                                fontColor: textColor
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: textColorSecondary,
                                font: {
                                    weight: 500
                                }
                            },
                            grid: {
                                display: false,
                                drawBorder: false
                            }
                        },
                        y: {
                            ticks: {
                                color: textColorSecondary
                            },
                            grid: {
                                color: surfaceBorder,
                                drawBorder: false
                            }
                        }
                    }
                };
                setChartDataIrradiacion(dataPlano);
                setChartOptionsIrradiacion(optionsPlano);
            } else {
                setCalculos([]);
                //setTitles([]);
            }

        });
        //console.log(datos);
    }

    

    //const { register, handleSubmit, formState: { errors } } = useForm();
    //onSubmit={handleSubmit(onSubmit)}
    //VARIABLES
    const URL = process.env.path;
    const URL_MEDIA = process.env.path_media;

    return (
        <main className="col-12">
            <Toast ref={myToast} />
            <div className="card p-fluid">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid">
                        <div className='col'>
                            <div className="card">
                                <div class="card-body">
                                    <div>
                                        <h5 class="card-title"><img src={URL_MEDIA + 'sol.png'} width={45} /><b>|</b> Datos del <b style={{ color: "rgb(157, 42, 17)" }}>irradiación</b></h5>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Sitio</label>
                                            <Fieldset legend="Ingrese el sitio" toggleable collapsed={true}>
                                                <div className="form-group row" style={{ marginBottom: "10px" }}>
                                                    {position && <MapContainer
                                                        whenReady={(map) => {
                                                            map.target.on("click", function (e) {
                                                                
                                                                const { lat, lng } = e.latlng;
                                                                setPosition({ lat: lat, lng: lng });
                                                                map.target.eachLayer((layer) => {
                                                                    if (layer instanceof L.Marker) {
                                                                        layer.remove();
                                                                    }
                                                                });
                                                                L.marker([lat, lng]).addTo(map.target);
                                                            });
                                                        }}

                                                        center={position} zoom="15" style={{ height: '200px' }}>
                                                        <div className='col'>
                                                            <TileLayer
                                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                                            />
                                                        </div>

                                                        {position === null ? null : (
                                                            <Marker position={position}>
                                                                <Popup>You are here</Popup>
                                                            </Marker>)}
                                                    </MapContainer>}
                                                    <div className="col-sm-10">
                                                        <InputText value={position && position.lng} defaultValue={position && position.lng} type="text" readOnly {...register('lng')} className="form-control form-control-lg" id="colFormLabelLg" placeholder="Ingrese longitud" />
                                                        {errors.lon && <div className='text-xs inline-block py-1 px-2 rounded text-red-600 '>{errors.lng?.message}</div>}
                                                    </div>
                                                    <div className="col-sm-10">
                                                        <InputText defaultValue={position && position.lat} value={position && position.lat} type="text" readOnly {...register('lat')} className="form-control form-control-lg" id="colFormLabelLg2" placeholder="Ingrese latitud" />
                                                        {errors.lat && <div className='text-xs inline-block py-1 px-2 rounded text-red-600 '>{errors.lat?.message}</div>}
                                                    </div>
                                                </div>
                                            </Fieldset>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Ingrese la irradiacion por mes</label>
                                            <Fieldset legend="Ingrese irradiacion por mes" toggleable collapsed={true}>

                                                <div className="flex flex-column md:flex-row">
                                                    <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
                                                        <div className=' p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="enero" className="p-col-fixed" ><b>Enero</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="enero" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de enero'
                                                                        defaultValue={meses && meses.enero}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                        {...register('enero')}
                                                                    />
                                                                </div>
                                                                {errors.enero && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.enero?.message}</small>}
                                                            </div>
                                                        </div>

                                                        <div className='p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="febrero" className="p-col-fixed" ><b>Febrero</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="febrero" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de febrero'
                                                                        defaultValue={meses && meses.febrero}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                        {...register('febrero')}
                                                                    />
                                                                </div>
                                                                {errors.febrero && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.febrero?.message}</small>}
                                                            </div>
                                                        </div>

                                                        <div className='p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="marzo" className="p-col-fixed" ><b>Marzo</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="marzo" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de marzo'
                                                                        defaultValue={meses && meses.marzo}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                        {...register('marzo')}
                                                                    />
                                                                </div>
                                                                {errors.marzo && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.marzo?.message}</small>}
                                                            </div>
                                                        </div>

                                                        <div className='p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="abril" className="p-col-fixed" ><b>Abril</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="abril" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de abril'
                                                                        defaultValue={meses && meses.abril}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                        {...register('abril')}
                                                                    />
                                                                </div>
                                                                {errors.abril && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.abril?.message}</small>}
                                                            </div>
                                                        </div>

                                                        <div className='p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="mayo" className="p-col-fixed" ><b>Mayo</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="mayo" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de enero'
                                                                        {...register('mayo')}
                                                                        defaultValue={meses && meses.mayo}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                    />
                                                                </div>
                                                                {errors.mayo && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.mayo?.message}</small>}
                                                            </div>
                                                        </div>

                                                        <div className='p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="junio" className="p-col-fixed" ><b>Junio</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="junio" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de junio'
                                                                        defaultValue={meses && meses.junio}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                        {...register('junio')}
                                                                    />
                                                                </div>
                                                                {errors.junio && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.junio?.message}</small>}
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
                                                        <div className=' p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="julio" className="p-col-fixed" ><b>Julio</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="julio" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de julio'
                                                                        defaultValue={meses && meses.julio}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                        {...register('julio')}
                                                                    />
                                                                </div>
                                                                {errors.julio && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.julio?.message}</small>}
                                                            </div>
                                                        </div>

                                                        <div className='p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="agosto" className="p-col-fixed" ><b>Agosto</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="agosto" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de agosto'
                                                                        defaultValue={meses && meses.agosto}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                        {...register('agosto')}
                                                                    />
                                                                </div>
                                                                {errors.agosto && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.agosto?.message}</small>}
                                                            </div>
                                                        </div>

                                                        <div className='p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="septiembre" className="p-col-fixed" ><b>Septiembre</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="septiembre" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de septiembre'
                                                                        defaultValue={meses && meses.septiembre}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                        {...register('septiembre')}
                                                                    />
                                                                </div>
                                                                {errors.septiembre && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.septiembre?.message}</small>}
                                                            </div>
                                                        </div>

                                                        <div className='p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="octubre" className="p-col-fixed" ><b>Octubre</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="octubre" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de octubre'
                                                                        defaultValue={meses && meses.octubre}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                        {...register('octubre')}
                                                                    />
                                                                </div>
                                                                {errors.octubre && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.octubre?.message}</small>}
                                                            </div>
                                                        </div>

                                                        <div className='p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="noviembre" className="p-col-fixed" ><b>Noviembre</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="noviembre" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de noviembre'
                                                                        defaultValue={meses && meses.noviembre}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                        {...register('noviembre')}
                                                                    />
                                                                </div>
                                                                {errors.noviembre && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.noviembre?.message}</small>}
                                                            </div>
                                                        </div>

                                                        <div className='p-col-fixed'>
                                                            <div className="p-field p-grid" style={{ margin: "10px" }}>
                                                                <label htmlFor="diciembre" className="p-col-fixed" ><b>Diciembre</b></label>
                                                                <div className="p-col">
                                                                    <InputText id="diciembre" type="text" style={{ marginTop: "10px" }}
                                                                        placeholder='Ingrese el valor de diciembre'
                                                                        defaultValue={meses && meses.diciembre}
                                                                        onKeyUp={(e) => sumas(e)}
                                                                        {...register('diciembre')}
                                                                    />
                                                                </div>
                                                                {errors.diciembre && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.diciembre?.message}</small>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <InputText {...register('promedio')} value={promedio} name="promedio" readOnly type="text" className={`form-control ${errors.promedio ? 'p-invalid' : ''}`} />
                                                <div className="p-error">{errors.promedio?.message}</div>
                                            </Fieldset>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Ingrese irradiacion del total sitio</label>
                                            <InputText {...register('irradiacion')} name="irradiacion" type="text" className={`form-control ${errors.irradiacion ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.irradiacion?.message}</div>

                                        </div>
                                    </div>


                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Seleccione la fuente</label>
                                            <select name="fuente" {...register('fuente', {
                                                required: true
                                            })} className={`p-dropdown p-component p-inputtext ${errors.fuente ? 'p-invalid' : ''}`} >
                                                <option value="">Seleccione una fuente</option>
                                                {listaFuentes.map((sit, i) => (
                                                    <option key={i} value={sit.key}>{sit.value}</option>

                                                ))}
                                            </select>
                                            <div className="p-error">{errors.fuente?.message}</div>
                                        </div>
                                    </div>


                                </div>
                            </div>

                            <div className="card">
                                <div class="card-body">

                                    <div>
                                        <h5 class="card-title"><img src={URL_MEDIA + 'casa.png'} width={45} /><b>|</b> Datos del <b style={{ color: "rgb(157, 42, 17)" }}>edificio</b></h5>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Seleccione la tarifa</label>
                                            <select name="tarifa" {...register('tarifa')} onChange={changeSelectOptionTarifa} className={`p-dropdown p-inputtext ${errors.edificio ? 'p-invalid' : ''}`} >
                                                <option>Seleccione la tarifa</option>
                                                {listaTarifa.map((cant, i) => (
                                                    <option key={i} value={cant.external}>{cant.nombre}</option>

                                                ))}
                                            </select>
                                            <div className="p-error">{errors.tarifa?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Seleccione el edificio</label>
                                            <select name="edificio" {...register('edificio')} className={`p-dropdown p-inputtext ${errors.edificio ? 'p-invalid' : ''}`} >
                                                <option>Seleccione el edificio</option>
                                                {listaEdificio.map((cant, i) => (
                                                    <option key={i} value={cant.nombre}>{cant.nombre}</option>

                                                ))}
                                            </select>
                                            <div className="p-error">{errors.edificio?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Consumo eléctrico promedio mensual [kWh]</label>
                                            <Slider step={1} min={0} max={10000} value={sliderConsumoMensual} onChange={(e) => { setSliderConsumoMensual(e.value); setValue('consumo_mensual', e.value); }} />
                                            <InputText {...register('consumo_mensual')} value={sliderConsumoMensual} onChange={(e) => setSliderConsumoMensual((e.target.value))} name="consumo_mensual" type="text" className={`form-control ${errors.consumo_mensual ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.consumo_mensual?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Demanda de potencia electrica [KW]</label>
                                            <Slider value={sliderDemanda} onChange={(e) => { setSliderDemanda(e.value); setValue('demanda_potencia_electronica', e.value); }} min={0} max={1000} />
                                            <InputText {...register('demanda_potencia_electronica')} name="demanda_potencia_electronica" type="text" value={sliderDemanda} onChange={(e) => setSliderDemanda((e.target.value))} className={`form-control ${errors.demanda_potencia_electronica ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.demanda_potencia_electronica?.message}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col'>

                            <div className="card">
                                <div class="card-body">
                                    <div>
                                        <h5 class="card-title"><img src={URL_MEDIA + 'panel.png'} width={45} /><b>|</b> Datos del sistema <b style={{ color: "rgb(157, 42, 17)" }}>Fotovoltaico</b></h5>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Angulo de Inclinación, b [º]</label>
                                            <Knob value={sliderAngulo} valueTemplate={'{value}°'} onChange={(e) => { setSliderAngulo(e.value); setValue('inclinacion', e.value); }} step={1} min={0} max={90} />
                                            <InputText {...register('inclinacion')} value={sliderAngulo} onChange={(e) => setSliderAngulo((e.target.value))} name="inclinacion" type="text" className={`form-control ${errors.inclinacion ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.inclinacion?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Orientación, a [º]</label>
                                            <Knob value={sliderInclinacion} valueTemplate={'{value}°'} onChange={(e) => { setSliderInclinacion(e.value); setValue('orientacion', e.value); }} step={1} min={-90} max={90} />
                                            <InputText {...register('orientacion')} value={sliderInclinacion} onChange={(e) => setSliderInclinacion((e.target.value))} name="orientacion" type="text" className={`form-control ${errors.orientacion ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.orientacion?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Coeficiente de reflexion</label>
                                            <InputText value='0.2' name="coef_reflexion" readOnly type="text" {...register('coef_reflexion')} className={`${errors.coef_reflexion ? 'p-invalid' : ''}`} />

                                            <div className="p-error">{errors.coef_reflexion?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Potencia nominal del generador PNOM,G, [kWp]</label>
                                            <Slider step={0.1} value={sliderValuePotenciaNominal} onChange={(e) => { setSliderValuePotenciaNominal(e.value); setValue('potencia', e.value); }} />
                                            <InputText {...register('potencia')} value={sliderValuePotenciaNominal} onChange={(e) => setSliderValuePotenciaNominal((e.target.value))} name="potencia" type="text" className={`form-control ${errors.potencia ? 'p-invalid' : ''}`} />

                                            <div className="p-error">{errors.potencia?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Eficiencia del panel fotovoltaico [%]</label>
                                            <Knob value={sliderEficiencia} valueTemplate={'{value}%'} onChange={(e) => { setSliderEficiencia(e.value); setValue('eficiencia', e.value); }} step={1} min={0} max={50} />
                                            <InputText {...register('eficiencia')} value={sliderEficiencia} onChange={(e) => setSliderEficiencia((e.target.value))} name="eficiencia" type="text" className={`form-control ${errors.eficiencia ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.eficiencia?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Factor de sombras, FS, (0 - 1)</label>
                                            <Slider min={0.0} max={1.0} step={0.01} value={sliderFS} onChange={(e) => { setSliderFS(e.value); setValue('fs', e.value); }} />
                                            <InputText {...register('fs')} value={sliderFS} onChange={(e) => setSliderFS((e.target.value))} name="fs" type="text" className={`form-control ${errors.fs ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.fs?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Rendimiento característico PR4, (0 - 1)</label>
                                            <Slider min={0.0} max={1.0} step={0.01} value={sliderRendimiento} onChange={(e) => { setSliderRendimiento(e.value); setValue('rendimiento', e.value); }} />
                                            <InputText {...register('rendimiento')} value={sliderRendimiento} onChange={(e) => setSliderRendimiento((e.target.value))} name="rendimiento" type="text" className={`form-control ${errors.rendimiento ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.rendimiento?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">

                                            <label>Costo de compra e instalalción (USD/kW)</label>
                                            <Slider min={0} max={10000} step={1} value={sliderCosto} onChange={(e) => { setSliderCosto(e.value); setValue('costo_instalacion', e.value); }} />
                                            <InputText {...register('costo_instalacion')} value={sliderCosto} onChange={(e) => setSliderCosto((e.target.value))} name="costo_instalacion" type="text" className={`w-full form-control ${errors.costo_instalacion ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.costo_instalacion?.message}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='card-body'>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <Button severity="danger" type="submit" disabled={formState.isSubmitting} className="mr-2">
                                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                        Calcular
                                    </Button>
                                </div>
                                <div className="field col">
                                    <Button severity="secondary" onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-danger">Nuevo calculo</Button>

                                </div>
                            </div>
                        </div>


                    </div>



                </form>
            </div >


            <div style={{ display: calculos.length > 0 ? "block" : "none" }} className="card p-fluid">
                <div className='card'>

                    <h5 className='card-header'><b style={{ color: "rgb(157, 42, 17)" }}>INFORME</b> DE RESULTADOS</h5>
                    <div className='container'>
                        <div className='grid'>
                            <div className='col'>
                                <Panel header={<div className='flex align-items-center gap-2'>
                                    <p><img src={URL_MEDIA + 'rayo.png'} width={20} /> <b style={{ color: "rgb(157, 42, 17)" }}>Energía</b> solar fotovoltaica</p>
                                </div>}>


                                    <Tag style={{ margin: "5px", background: "rgb(157, 42, 17)" }} severity="danger" value={eneria.toFixed(2)}></Tag>
                                    <Tag style={{ background: "rgb(157, 42, 17)" }} severity="danger" value="kWh/año"></Tag>

                                </Panel>
                            </div>
                            <div className='col'>
                                <Panel header={<div className='flex align-items-center gap-2'>
                                    <p><img src={URL_MEDIA + 'ahorro.png'} width={20} /> <b style={{ color: "rgb(157, 42, 17)" }}>Ahorro</b> anual</p>
                                </div>}>

                                    <Tag style={{ margin: "5px", background: "rgb(157, 42, 17)" }} severity="danger" value={ahorro.toFixed(2)}></Tag>
                                    <Tag style={{ background: "rgb(157, 42, 17)" }} severity="danger" value="USD/año"></Tag>
                                </Panel>
                            </div>
                        </div>

                        <div className='grid'>
                            <div className='col'>
                                <Panel header={<div className='flex align-items-center gap-2'>
                                    <p><img src={URL_MEDIA + 'panel.png'} width={20} /> <b style={{ color: "rgb(157, 42, 17)" }}>Superficie</b> cubierta por paneles solares</p>
                                </div>}>

                                    <Tag style={{ margin: "5px", background: "rgb(157, 42, 17)" }} severity="danger" value={superficie.toFixed(2)}></Tag>
                                    <Tag style={{ background: "rgb(157, 42, 17)" }} severity="danger" value="m2"></Tag>
                                </Panel>
                            </div>
                            <div className='col'>
                                <Panel header={<div className='flex align-items-center gap-2'>
                                    <p><img src={URL_MEDIA + 'porcentaje.png'} width={20} /> <b style={{ color: "rgb(157, 42, 17)" }}>Autoconsumo</b> anual</p>
                                </div>}>

                                    <Tag style={{ margin: "5px", background: "rgb(157, 42, 17)" }} severity="danger" value={autoconsumo.toFixed(2) + "%"}></Tag>
                                    <Tag style={{ background: "rgb(157, 42, 17)" }} severity="danger" value="Fotovoltaica/consumo"></Tag>
                                </Panel>
                            </div>
                        </div>

                        <div className='grid'>
                            <div className='col'>
                                <Panel header={<div className='flex align-items-center gap-2'>
                                    <p><img src={URL_MEDIA + 'sol.png'} width={20} /> <b style={{ color: "rgb(157, 42, 17)" }}>Relación</b> kWh/kWp</p>
                                </div>}>

                                    <Tag style={{ margin: "5px", background: "rgb(157, 42, 17)" }} severity="danger" value={relacion.toFixed(2)}></Tag>
                                    <Tag style={{ background: "rgb(157, 42, 17)" }} severity="danger" value="kWh/kWp"></Tag>
                                </Panel>
                            </div>
                            <div className='col'>
                                <div className='grid'>
                                    <div className='col'>
                                        <Panel header={<div className='flex align-items-center gap-2'>
                                            <p><img src={URL_MEDIA + 'banco.png'} width={20} /> <b style={{ color: "rgb(157, 42, 17)" }}>Costo</b> de la instalación</p>
                                        </div>}>
                                            <Tag style={{ margin: "5px", background: "rgb(157, 42, 17)" }} severity="danger" value={costo.toFixed(2)}></Tag>
                                            <Tag style={{ background: "rgb(157, 42, 17)" }} severity="danger" value="USD"></Tag>

                                        </Panel>
                                    </div>
                                    <div className='col'>
                                        <Panel header={<div className='flex align-items-center gap-2'>
                                            <p><img src={URL_MEDIA + 'banco.png'} width={20} /> <b style={{ color: "rgb(157, 42, 17)" }}>Retorno</b> de la inversión</p>
                                        </div>}>

                                            <Tag style={{ margin: "5px", background: "rgb(157, 42, 17)" }} severity="danger" value={retorno.toFixed(2)}></Tag>
                                            <Tag style={{ background: "rgb(157, 42, 17)" }} severity="danger" value="años"></Tag>



                                        </Panel>
                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>
                </div>

                <div className="card">
                    <div className='card-title'>
                        <p><img src={URL_MEDIA + 'dolar.png'} width={20} /> <b style={{ color: "rgb(157, 42, 17)" }}>Factura</b> electrica mensual</p>
                    </div>
                    <Chart type="bar" data={chartData} options={chartOptions} />
                </div>

                <div className="card">
                    <div className='card-title'>
                        <p><img src={URL_MEDIA + 'solB.png'} width={20} /> <b style={{ color: "rgb(157, 42, 17)" }}>Irradiacion</b> diaria media mensual</p>
                    </div>
                    <Chart type="bar" data={chartDataIrradiacion} options={chartOptionsIrradiacion} />
                </div>

                <div className='card' style={{ display: 'none' }}>

                    <DataTable value={calculos} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="mes" header="Mes"></Column>
                        <Column field="dia" header="Dia"></Column>
                        <Column field="eps" header="Eps.o"></Column>
                        <Column field="declinacion" header="Declinacion"></Column>
                        <Column field="none" header=" "></Column>
                        <Column field="w0" header="Elevacion w=0"></Column>
                        <Column field="w180" header="Elevacion w=180"></Column>
                        <Column field="wsard" header="Ws"></Column>
                        <Column field="ws0" header="Ws o"></Column>
                        <Column field="bodm" header="Gdm(0)"></Column>
                        <Column field="ktm" header="Ktm"></Column>
                        <Column field="kdm" header="Kdm"></Column>
                        <Column field="ddm" header="Ddm(0)"></Column>
                        <Column field="bdm" header="Bdm(0)"></Column>
                        <Column field="idp" header="Irradiación diaria promedio mensual Gdm(a,b)"></Column>

                    </DataTable>
                </div>


            </div>

        </main >
    )
}