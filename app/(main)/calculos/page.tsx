'use client';
import { decode as base64_decode, encode as base64_encode } from 'base-64';
//var utf8 = require('utf8');
import { encode, decode } from 'utf8';
import { useRef, useState } from 'react';
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
import { provincias, cantonesPorProvincia, sitiosSoloNombrePorCanton, postCalculos, fuentes, edificio, edificio_tarifa, tarifa, sito_censo_fuente } from '../../../hooks/servicios';
//import { Link } from 'components';

import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
//import { LayoutContext } from '../../../../layout/context/layoutcontext';
//import { userService, alertService } from 'services';
import { Tooltip } from 'primereact/tooltip';

export default function Home() {
    //
    const route = useRouter();
    const base_url = process.env.path;
    const myToast = useRef(null);
    //
    const [estadoP, setEstadoP] = useState(false);
    const [sitio, setSitio] = useState('');
    //FORM
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

    const [listaprovincia, setListaprovincia] = useState([]);

    const [sinDatos, setSinDatos] = useState(false);
    const [listaCanton, setListaCanton] = useState([]);
    const [listaSitios, setListaSitios] = useState([]);
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

    const changeSelectOptionHandlerP = (event) => {
        setSinDatos(false);
        setListaCanton([]);
        setListaSitios([]);
        setCalculos([]);
        if (event.target.value) {
            cantonesPorProvincia(event.target.value).then((info) => {
                //console.log(info.props.data.datos.length+" **-*-*-*-");
                if (info.props.data.message === 'OK') {
                    setListaCanton(info.props.data.datos);
                    if (info.props.data.datos.length <= 0) {
                        myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'No hay provincias' });
                    }
                } else {
                    if (info.props.data.datos.length <= 0) {
                        myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'No hay provincias' });
                    }
                }
            });
        }
    };

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

    const changeSelectOptionHandlerC = (event) => {
        setSinDatos(false);
        setListaSitios([]);
        setCalculos([]);
        if (event.target.value) {
            sitiosSoloNombrePorCanton(event.target.value).then((info) => {
                console.log(info);
                if (info.props.data.message === 'OK') {
                    setListaSitios(info.props.data.datos);
                    console.log(info.props.data.datos.length);
                    if (info.props.data.datos.length <= 0) {
                        myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'No hay cantones' });
                    }
                } else {
                    if (info.props.data.datos.length <= 0) {
                        myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'No hay cantones' });
                    }
                }
            });
        }
    };

    ////// canton fuente
    const changeSelectSite = (event) => {
        setSinDatos(false);
        if (event.target.value) {
            let aux = base64_decode(event.target.value);
            let arr = aux.split(';');
            if (arr.length >= 3) {
                console.log('-y-y-y-y-y ' + arr[2]);
                setSitio(arr[2]);
            } else {
                setSitio('');
                setSinDatos(false);
            }

            //console.log("-y-y-y-y-y "+base64_decode(event.target.value));
        }
    };
    const changeSelectFuente = (event) => {
        setSinDatos(false);
        if (event.target.value) {
            sito_censo_fuente(sitio, event.target.value).then((info) => {
                console.log('-------------FUENTES---------');
                console.log(info);
                if (info.props.data.message === 'OK') {
                    //setListaEdificio(info.props.data.datos);
                    if (info.props.data.datos.length > 0) {
                        setSinDatos(true);
                    } else {
                        setSinDatos(false);
                        myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'No hay censos para esta fuente y parroquia' });
                    }
                } else {
                    setSinDatos(false);
                    myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'No hay censos para esta fuente y parroquia' });
                }
            });
        }
    };
    ////
    if (!estadoP) {
        provincias().then((info) => {
            if (info.props.data.message === 'OK') {
                setListaprovincia(info.props.data.datos);
                setEstadoP(true);
            }
        });

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
    }

    //<coef_reflexion>/<inclinacion>/<orientacion>/<external>/<potencia>/<eficiencia>/<fs>/<rendimiento>
    const validationSchema = Yup.object().shape({
        provincia: Yup.string().required('Se requiere la provincia'),
        canton: Yup.string().required('Se requiere el cantón'),
        coef_reflexion: Yup.number().required('Se requiere el coeficiente de reflexión'),
        inclinacion: Yup.number().required('se requiere la inclinación'),
        orientacion: Yup.number().required('se requiere la orientación'),
        external: Yup.string().required('Se requiere el sitio'),
        tarifa: Yup.string().required('Se requiere la tarifa'),
        fuente: Yup.string().required('Se requiere la fuente'),
        edificio: Yup.string().required('Se requiere el tipo de edificio'),
        potencia: Yup.number().required('Se requiere la potencia'),
        eficiencia: Yup.number().required('Se requiere la eficiencia'),
        fs: Yup.number().required('Se requiere el factor de sombras'),
        rendimiento: Yup.number().required('Se requiere el rendimiento'),
        costo_instalacion: Yup.number().required('Se requiere el costo de instalación'),
        consumo_mensual: Yup.number().required('Se requiere el consumo mensual'),
        demanda_potencia_electronica: Yup.number().required('Se requiere la demanda de potencial eléctrico en KW')
    });

    const onSubmit = (data) => {
        console.log("+++++++++///////");
        var tar = listaTarifa.find((dat) => dat.external == data.tarifa);
        console.log("+++++++++");
        console.log(tar);
        if(tar != undefined) {

        
        var datos = {
            coef_reflexion: data.coef_reflexion,
            inclinacion: data.inclinacion,
            orientacion: data.orientacion,
            potencia: data.potencia,
            external: data.external,
            eficiencia: data.eficiencia,
            fuente: data.fuente,
            fs: data.fs,
            rendimiento: data.rendimiento,
            tipo_edificio: tar.nombre + ' ' + data.edificio,
            costo_instalacion: data.costo_instalacion,
            consumo_mensual: data.consumo_mensual,
            demanda_potencia_electronica: data.demanda_potencia_electronica
        };

        postCalculos(datos).then((info) => {
            

            console.log(info);
            if (info.props.datos.message === 'OK') {
                myToast.current?.show({ severity: 'info', summary: 'Respuesta', detail: 'Cálculo realizado!' });
                
                var aux = info.props.datos.datos[0].calculos;
                var aux1 = [];
                
                //chartDataIrradiacion
                var plano_horizontal = [];
                var plano_inclinado = [];
                aux.map(function (key, i) {
                    aux1[i] = {
                        mes: key[0].mes,
                        dia: key[1].dia,
                        eps: key[2].eps,
                        declinacion: key[3].declinacion,
                        none: key[4].none,
                        w0: key[5].w0,
                        w180: key[6].w180,
                        wsard: key[7].wsard,
                        ws0: key[8].ws0,
                        bodm: key[9].bodm,
                        gdm: key[10].gdm,
                        ktm: key[11].ktm,
                        kdm: key[12].kdm,
                        ddm: key[13].ddm,
                        bdm0: key[14].bdm0,
                        bdmab: key[16].bdmab,
                        ddmab: key[17].ddmab,
                        rdmab: key[18].rdmab,
                        idp: key[19].idpmgdm
                    };
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
        }else{
            
            myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'Faltan campos por agregar' });
        }
        //console.log(datos);
    };

    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    //if (!isAddMode) {
    //  formOptions.defaultValues = props.user;
    //}

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState, setValue } = useForm(formOptions);
    const { errors } = formState;

    //const { register, handleSubmit, formState: { errors } } = useForm();
    //onSubmit={handleSubmit(onSubmit)}
    //VARIABLES
    const URL = process.env.path;
    const URL_MEDIA = process.env.path_media;

    return (
        <div id="home" className="surface-0 flex justify-content-center col-12">
            <Toast ref={myToast} />
            <div className="card p-fluid">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid">
                        <div className="col">
                            <div className="card">
                                <div className="card-body">
                                    <div>
                                        <h5 className="card-title">
                                            <img src={URL_MEDIA + 'sol.png'} width={45} />
                                            <b>|</b> Datos del <b style={{ color: 'rgb(157, 42, 17)' }}>irradiación</b>
                                        </h5>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">

                                            <label><b>Seleccione la provincia</b> </label>

                                            <select name="provincia" {...register('provincia')} className={`p-dropdown p-component p-inputtext ${errors.provincia ? 'p-invalid' : ''}`} onChange={changeSelectOptionHandlerP}>
                                                <option>Seleccione una provincia</option>
                                                {listaprovincia.map((prov, i) => (
                                                    <option key={i} value={prov.external}>
                                                        {prov.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="p-error">{errors.provincia?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label><b>Seleccione el cantón</b></label>
                                            <select name="canton" {...register('canton')} className={`p-dropdown p-component p-inputtext ${errors.canton ? 'p-invalid' : ''}`} onChange={changeSelectOptionHandlerC}>
                                                <option>Seleccione un cantón</option>
                                                {listaCanton.map((cant, i) => (
                                                    <option key={i} value={cant.external}>
                                                        {cant.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="p-error">{errors.canton?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label><b>Seleccione la parroquia (lugar)</b></label>
                                            <select
                                                name="external"
                                                {...register('external', {
                                                    required: true
                                                })}
                                                className={`p-dropdown p-component p-inputtext ${errors.external ? 'p-invalid' : ''}`}
                                                onChange={changeSelectSite}
                                            >
                                                <option value="">Seleccione la parroquia (lugar)</option>
                                                {listaSitios.map((sit, i) => (
                                                    <option key={i} value={base64_encode(encode(sit.nombre) + ';' + sit.canton + ';' + sit.external + ';')}>
                                                        {sit.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="p-error">{errors.external?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolPr" content="Meteonorm:Contiene datos de horarios de radiación, NASA_SSE: Permite conocer los valores mediante la introducción de las coordenadas geográficas, NERL:Entrega datos de radiación solar" position="top" />
                                            <label><b>Seleccione la fuente</b> <i className="pi pi-info-circle text  text-blue-500 toolPr" /> </label>
                                            <select
                                                name="fuente"
                                                {...register('fuente', {
                                                    required: true
                                                })}
                                                className={`p-dropdown p-component p-inputtext ${errors.fuente ? 'p-invalid' : ''}`}
                                                onChange={changeSelectFuente}
                                            >
                                                <option value="">Seleccione una fuente</option>
                                                {listaFuentes.map((sit, i) => (
                                                    <option key={i} value={sit.key}>
                                                        {sit.value}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="p-error">{errors.fuente?.message}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div>
                                        <h5 className="card-title">
                                            <img src={URL_MEDIA + 'casa.png'} width={45} />
                                            <b>|</b> Datos del <b style={{ color: 'rgb(157, 42, 17)' }}>edificio</b>
                                        </h5>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolSt" content="Donde sus siglas B= baja; M= media;T= tensión; A= alta; SD= sin demanda; CD= con demanda" position="top" />
                                            <label><b>Seleccione la tarifa</b> <i className="pi pi-info-circle text  text-blue-500 toolSt" /> </label>
                                            <select name="tarifa" {...register('tarifa')} onChange={changeSelectOptionTarifa} className={`p-dropdown p-inputtext ${errors.edificio ? 'p-invalid' : ''}`}>
                                                <option>Seleccione la tarifa</option>
                                                {listaTarifa.map((cant, i) => (
                                                    <option key={i} value={cant.external}>
                                                        {cant.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="p-error">{errors.tarifa?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label><b>Seleccione el edificio (lugar)</b></label>
                                            <select name="edificio" {...register('edificio')} className={`p-dropdown p-inputtext ${errors.edificio ? 'p-invalid' : ''}`}>
                                                <option>Seleccione el edificio</option>
                                                {listaEdificio.map((cant, i) => (
                                                    <option key={i} value={cant.nombre}>
                                                        {cant.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="p-error">{errors.edificio?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolCepm" content="El consumo promedio de energía eléctrica se debe ingresar: 0 - 10000" position="top" />
                                            <label><b>Consumo eléctrico promedio mensual [kWh]</b> <i className="pi pi-info-circle text text-blue-500 toolCepm" /> </label>
                                            <Slider
                                                step={1}
                                                min={0}
                                                max={10000}
                                                value={sliderConsumoMensual}
                                                onChange={(e) => {
                                                    setSliderConsumoMensual(parseFloat(e.value.toString()));
                                                    setValue('consumo_mensual', parseFloat(e.value.toString()));
                                                }}
                                            />
                                            <InputText
                                                {...register('consumo_mensual')}
                                                value={sliderConsumoMensual.toString()}
                                                onChange={(e) => setSliderConsumoMensual(parseFloat(e.target.value.toString()))}
                                                name="consumo_mensual"
                                                type="text"
                                                className={`form-control ${errors.consumo_mensual ? 'p-invalid' : ''}`}
                                            />
                                            <div className="p-error">{errors.consumo_mensual?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolDdpe" content="cuánta electricidad consumes durante todo el periodo de facturación: 0 - 1000" position="top" />
                                            <label><b>Demanda de potencia eléctrica [KW]</b> <i className="pi pi-info-circle text text-blue-500 toolDdpe" /> </label>
                                            <Slider
                                                value={sliderDemanda}
                                                onChange={(e) => {
                                                    setSliderDemanda(parseFloat(e.value.toString()));
                                                    setValue('demanda_potencia_electronica', parseFloat(e.value.toString()));
                                                }}
                                                min={0}
                                                max={1000}
                                            />
                                            <InputText
                                                {...register('demanda_potencia_electronica')}
                                                name="demanda_potencia_electronica"
                                                type="text"
                                                value={sliderDemanda.toString()}
                                                onChange={(e) => setSliderDemanda(parseFloat(e.target.value.toString()))}
                                                className={`form-control ${errors.demanda_potencia_electronica ? 'p-invalid' : ''}`}
                                            />
                                            <div className="p-error">{errors.demanda_potencia_electronica?.message}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="card">
                                <div className="card-body">
                                    <div>
                                        <h5 className="card-title">
                                            <img src={URL_MEDIA + 'panel.png'} width={45} />
                                            <b>|</b> Datos del sistema <b style={{ color: 'rgb(157, 42, 17)' }}>Fotovoltaico</b>
                                        </h5>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolAdI" content="Ángulo óptimo para captación solar se recomienda un valor: 5-15°" position="top" />
                                            <label><b>Ángulo de Inclinación, β (BETA) (°)</b> <i className="pi pi-info-circle text text-blue-500 toolAdI" /> </label>
                                            <Knob
                                                value={sliderAngulo}
                                                valueTemplate={'{value}°'}
                                                onChange={(e) => {
                                                    setSliderAngulo(e.value);
                                                    setValue('inclinacion', e.value);
                                                }}
                                                step={1}
                                                min={0}
                                                max={90}
                                            />
                                            <InputText
                                                {...register('inclinacion')}
                                                value={sliderAngulo.toString()}
                                                onChange={(e) => setSliderAngulo(parseFloat(e.target.value.toString()))}
                                                name="inclinacion"
                                                type="text"
                                                className={`form-control ${errors.inclinacion ? 'p-invalid' : ''}`}
                                            />
                                            <div className="p-error">{errors.inclinacion?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolOdP" content="Orientado al Ecuador Terrestre, se recomienda 0° de orientación, modificar a su." position="top" />
                                            <label><b>Orientación, α (ALFA) (°)</b> <i className="pi pi-info-circle text text-blue-500 toolOdP" /> </label>
                                            <Knob
                                                value={sliderInclinacion}
                                                valueTemplate={'{value}°'}
                                                onChange={(e) => {
                                                    setSliderInclinacion(e.value);
                                                    setValue('orientacion', e.value);
                                                }}
                                                step={1}
                                                min={-90}
                                                max={90}
                                            />
                                            <InputText
                                                {...register('orientacion')}
                                                value={sliderInclinacion.toString()}
                                                onChange={(e) => setSliderInclinacion(parseFloat(e.target.value.toString()))}
                                                name="orientacion"
                                                type="text"
                                                className={`form-control ${errors.orientacion ? 'p-invalid' : ''}`}
                                            />
                                            <div className="p-error">{errors.orientacion?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolCdR" content="Es el índice de luz en el piso que incide en el panel, la nieve recién caída tiene un coeficiente de reflexión de 0,9; eso significa que el 90% de la radiación que llega es reflejada. se recomienda 0,2 " position="top" />
                                            <label><b>Coeficiente de reflexión</b> <i className="pi pi-info-circle text text-blue-500 toolCdR" /> </label>
                                            <InputText value="0.2" name="coef_reflexion" readOnly type="text" {...register('coef_reflexion')} className={`${errors.coef_reflexion ? 'p-invalid' : ''}`} />

                                            <div className="p-error">{errors.coef_reflexion?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolPndG" content="Cantidad máxima de energía eléctrica:0-100" position="top" />
                                            <label><b>Potencia nominal del generador [kWp]</b> <i className="pi pi-info-circle text text-blue-500 toolPndG" /> </label>

                                            <Slider
                                                step={0.1}
                                                value={sliderValuePotenciaNominal}
                                                onChange={(e) => {
                                                    setSliderValuePotenciaNominal(parseFloat(e.value.toString()));
                                                    setValue('potencia', parseFloat(e.value.toString()));
                                                }}
                                            />
                                            <InputText
                                                {...register('potencia')}
                                                value={sliderValuePotenciaNominal.toString()}
                                                onChange={(e) => setSliderValuePotenciaNominal(parseFloat(e.target.value.toString()))}
                                                name="potencia"
                                                type="text"
                                                className={`form-control ${errors.potencia ? 'p-invalid' : ''}`}
                                            />

                                            <div className="p-error">{errors.potencia?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolEdPF" content="Cuánta energía solar puede convertir en electricidad utilizable, se recomienda de 15 - 25%" position="top" />
                                            <label><b>Eficiencia del panel fotovoltaico [%]</b> <i className="pi pi-info-circle text text-blue-500 toolEdPF" /> </label>

                                            <Knob
                                                value={sliderEficiencia}
                                                valueTemplate={'{value}%'}
                                                onChange={(e) => {
                                                    setSliderEficiencia(e.value);
                                                    setValue('eficiencia', e.value);
                                                }}
                                                step={1}
                                                min={0}
                                                max={50}
                                            />
                                            <InputText
                                                {...register('eficiencia')}
                                                value={sliderEficiencia.toString()}
                                                onChange={(e) => setSliderEficiencia(parseFloat(e.target.value.toString()))}
                                                name="eficiencia"
                                                type="text"
                                                className={`form-control ${errors.eficiencia ? 'p-invalid' : ''}`}
                                            />
                                            <div className="p-error">{errors.eficiencia?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolFdS" content="Es el porcentaje de la superficie de SFV cubierto por sombras, se recomienda 0 sin sombras y 1 cuando esta cubierta de sombras" position="top" />
                                            <label><b>Factor de sombras, FS, (0 - 1)</b> <i className="pi pi-info-circle text text-blue-500 toolFdS" /> </label>

                                            <Slider
                                                min={0.0}
                                                max={1.0}
                                                step={0.01}
                                                value={sliderFS}
                                                onChange={(e) => {
                                                    setSliderFS(parseFloat(e.value.toString()));
                                                    setValue('fs', parseFloat(e.value.toString()));
                                                }}
                                            />
                                            <InputText
                                                {...register('fs')}
                                                value={sliderFS.toString()}
                                                onChange={(e) => setSliderFS(parseFloat(e.target.value.toString()))}
                                                name="fs"
                                                type="text"
                                                className={`form-control ${errors.fs ? 'p-invalid' : ''}`}
                                            />
                                            <div className="p-error">{errors.fs?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolPC" content="El sistema convierte entre el 75% y el 85% de la energía solar disponible en electricidad,se recomienda: 0.85" position="top" />
                                            <label><b>Rendimiento característico PR (Performance ratio), (0 - 1)</b> <i className="pi pi-info-circle text text-blue-500 toolPC" /> </label>
                                            <Slider
                                                min={0.0}
                                                max={1.0}
                                                step={0.01}
                                                value={sliderRendimiento}
                                                onChange={(e) => {
                                                    setSliderRendimiento(parseFloat(e.value.toString()));
                                                    setValue('rendimiento', parseFloat(e.value.toString()));
                                                }}
                                            />
                                            <InputText
                                                {...register('rendimiento')}
                                                value={sliderRendimiento.toString()}
                                                onChange={(e) => setSliderRendimiento(parseFloat(e.target.value.toString()))}
                                                name="rendimiento"
                                                type="text"
                                                className={`form-control ${errors.rendimiento ? 'p-invalid' : ''}`}
                                            />
                                            <div className="p-error">{errors.rendimiento?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <Tooltip target=".toolCdCI" content="En el Ecuador el costo de instalación de un sistema fotovoltaico es de aproximadamente $1,500 por kilovatio (kW). Si los costos oscilan entre $1,000 y $3,000 por kW, puede ser razonable " position="top" />
                                            <label><b>Costo de compra e instalación (USD/kW)</b> <i className="pi pi-info-circle text text-blue-500 toolCdCI" /> </label>

                                            <Slider
                                                min={0}
                                                max={10000}
                                                step={1}
                                                value={sliderCosto}
                                                onChange={(e) => {
                                                    setSliderCosto(parseFloat(e.value.toString()));
                                                    setValue('costo_instalacion', parseFloat(e.value.toString()));
                                                }}
                                            />
                                            <InputText
                                                {...register('costo_instalacion')}
                                                value={sliderCosto.toString()}
                                                onChange={(e) => setSliderCosto(parseFloat(e.target.value.toString()))}
                                                name="costo_instalacion"
                                                type="text"
                                                className={`w-full form-control ${errors.costo_instalacion ? 'p-invalid' : ''}`}
                                            />
                                            <div className="p-error">{errors.costo_instalacion?.message}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            {sinDatos == true && (
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <Button severity="danger" type="submit" disabled={formState.isSubmitting} className="mr-2">
                                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                            Calcular
                                        </Button>
                                    </div>
                                    <div className="field col">
                                        <Button severity="secondary" onClick={() => route.push(base_url + 'calculos')} type="button" disabled={formState.isSubmitting} className="btn btn-danger">
                                            Nuevo calculo
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {sinDatos == false && (
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <Button severity="secondary" onClick={() => route.push(base_url + 'calculos/sinsitio')} type="button" disabled={formState.isSubmitting} className="btn btn-danger">
                                            Calculos con valores propios
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <div style={{ display: calculos.length > 0 ? 'block' : 'none' }} className="card p-fluid">
                <div className="card">
                    <h5 className="card-header">
                        <b style={{ color: 'rgb(157, 42, 17)' }}>INFORME</b> DE RESULTADOS
                    </h5>
                    <div className="container">
                        <div className="grid">
                            <div className="col">
                                <Panel
                                    header={
                                        <div className="flex align-items-center gap-2">
                                            <p>
                                                <img src={URL_MEDIA + 'rayo.png'} width={20} /> <b style={{ color: 'rgb(157, 42, 17)' }}>Energía</b> solar fotovoltaica
                                            </p>
                                        </div>
                                    }
                                >
                                    <Tag style={{ margin: '5px', background: 'rgb(157, 42, 17)' }} severity="danger" value={eneria.toFixed(2)}></Tag>
                                    <Tag style={{ background: 'rgb(157, 42, 17)' }} severity="danger" value="kWh/año"></Tag>
                                </Panel>
                            </div>
                            <div className="col">
                                <Panel
                                    header={
                                        <div className="flex align-items-center gap-2">
                                            <p>
                                                <img src={URL_MEDIA + 'ahorro.png'} width={20} /> <b style={{ color: 'rgb(157, 42, 17)' }}>Ahorro</b> anual
                                            </p>
                                        </div>
                                    }
                                >
                                    <Tag style={{ margin: '5px', background: 'rgb(157, 42, 17)' }} severity="danger" value={ahorro.toFixed(2)}></Tag>
                                    <Tag style={{ background: 'rgb(157, 42, 17)' }} severity="danger" value="USD/año"></Tag>
                                </Panel>
                            </div>
                        </div>

                        <div className="grid">
                            <div className="col">
                                <Panel
                                    header={
                                        <div className="flex align-items-center gap-2">
                                            <p>
                                                <img src={URL_MEDIA + 'panel.png'} width={20} /> <b style={{ color: 'rgb(157, 42, 17)' }}>Superficie</b> cubierta por paneles solares
                                            </p>
                                        </div>
                                    }
                                >
                                    <Tag style={{ margin: '5px', background: 'rgb(157, 42, 17)' }} severity="danger" value={superficie.toFixed(2)}></Tag>
                                    <Tag style={{ background: 'rgb(157, 42, 17)' }} severity="danger" value="m2"></Tag>
                                </Panel>
                            </div>
                            <div className="col">
                                <Panel
                                    header={
                                        <div className="flex align-items-center gap-2">
                                            <p>
                                                <img src={URL_MEDIA + 'porcentaje.png'} width={20} /> <b style={{ color: 'rgb(157, 42, 17)' }}>Autoconsumo</b> anual
                                            </p>
                                        </div>
                                    }
                                >
                                    <Tag style={{ margin: '5px', background: 'rgb(157, 42, 17)' }} severity="danger" value={autoconsumo.toFixed(2) + '%'}></Tag>
                                    <Tag style={{ background: 'rgb(157, 42, 17)' }} severity="danger" value="Fotovoltaica/consumo"></Tag>
                                </Panel>
                            </div>
                        </div>

                        <div className="grid">
                            <div className="col">
                                <Panel
                                    header={
                                        <div className="flex align-items-center gap-2">
                                            <p>
                                                <img src={URL_MEDIA + 'sol.png'} width={20} /> <b style={{ color: 'rgb(157, 42, 17)' }}>Relación</b> kWh/kWp
                                            </p>
                                        </div>
                                    }
                                >
                                    <Tag style={{ margin: '5px', background: 'rgb(157, 42, 17)' }} severity="danger" value={relacion.toFixed(2)}></Tag>
                                    <Tag style={{ background: 'rgb(157, 42, 17)' }} severity="danger" value="kWh/kWp"></Tag>
                                </Panel>
                            </div>
                            <div className="col">
                                <div className="grid">
                                    <div className="col">
                                        <Panel
                                            header={
                                                <div className="flex align-items-center gap-2">
                                                    <p>
                                                        <img src={URL_MEDIA + 'banco.png'} width={20} /> <b style={{ color: 'rgb(157, 42, 17)' }}>Costo</b> de la instalación
                                                    </p>
                                                </div>
                                            }
                                        >
                                            <Tag style={{ margin: '5px', background: 'rgb(157, 42, 17)' }} severity="danger" value={costo.toFixed(2)}></Tag>
                                            <Tag style={{ background: 'rgb(157, 42, 17)' }} severity="danger" value="USD"></Tag>
                                        </Panel>
                                    </div>
                                    <div className="col">
                                        <Panel
                                            header={
                                                <div className="flex align-items-center gap-2">
                                                    <p>
                                                        <img src={URL_MEDIA + 'banco.png'} width={20} /> <b style={{ color: 'rgb(157, 42, 17)' }}>Retorno</b> de la inversión
                                                    </p>
                                                </div>
                                            }
                                        >
                                            <Tag style={{ margin: '5px', background: 'rgb(157, 42, 17)' }} severity="danger" value={retorno.toFixed(2)}></Tag>
                                            <Tag style={{ background: 'rgb(157, 42, 17)' }} severity="danger" value="años"></Tag>
                                        </Panel>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-title">
                        <p>
                            <img src={URL_MEDIA + 'dolar.png'} width={20} /> <b style={{ color: 'rgb(157, 42, 17)' }}>Factura</b> electrica mensual
                        </p>
                    </div>
                    <Chart type="bar" data={chartData} options={chartOptions} />
                </div>

                <div className="card">
                    <div className="card-title">
                        <p>
                            <img src={URL_MEDIA + 'solB.png'} width={20} /> <b style={{ color: 'rgb(157, 42, 17)' }}>Irradiacion</b> diaria media mensual
                        </p>
                    </div>
                    <Chart type="bar" data={chartDataIrradiacion} options={chartOptionsIrradiacion} />
                </div>

                <div className="card" style={{ display: 'none' }}>
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
        </div>
    );
}
