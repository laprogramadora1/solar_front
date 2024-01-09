"use client";
import { Chart } from 'primereact/chart';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
//import { provincias, cantonesPorProvincia, sitiosPorCanton, postCalculos } from '@/hooks/servicios';
import { provincias, cantonesPorProvincia, sitiosPorCanton, postCalculos, fuentes, edificio } from '../../../hooks/servicios';
//import { Link } from 'components';
import { Link } from 'next/link';
//import { LayoutContext } from '../../../../layout/context/layoutcontext'; 
//import { userService, alertService } from 'services';
import { useState } from 'react';

export default function Home() {
    const [listaprovincia, setListaprovincia] = useState([]);
    const [estadoP, setEstadoP] = useState(false);
    const [listaCanton, setListaCanton] = useState([]);
    const [listaSitios, setListaSitios] = useState([]);
    const [listaFuentes, setListaFuentes] = useState([]);
    const [listaEdificio, setListaEdificio] = useState([]);

    //chart
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

        if (event.target.value) {
            cantonesPorProvincia(event.target.value).then((info) => {
                //console.log(info);
                if (info.props.data.message === 'OK') {
                    setListaCanton(info.props.data.datos);

                }
            });
        }
    };
    const changeSelectOptionHandlerC = (event) => {

        if (event.target.value) {
            sitiosPorCanton(event.target.value).then((info) => {
                //console.log(info);
                if (info.props.data.message === 'OK') {
                    setListaSitios(info.props.data.datos);

                }
            });
        }
    };
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

        edificio().then((info) => {
            if (info.props.data.message === 'OK') {
                setListaEdificio(info.props.data.datos);

            }
        });


    }

    //<coef_reflexion>/<inclinacion>/<orientacion>/<external>/<potencia>/<eficiencia>/<fs>/<rendimiento>
    const validationSchema = Yup.object().shape({
        coef_reflexion: Yup.number()
            .required('Se requiere el coeficiente de reflexion'),
        inclinacion: Yup.number()
            .required('se requiere la inclinacion'),
        orientacion: Yup.number()
            .required('se requiere la orientacion'),
        external: Yup.string()
            .required('Se requiere el sitio'),
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
        demanda_potencia_electronica: Yup.number()
            .required('Se requiere la demanda de potencial electrico en KW')
    });

    const onSubmit = (data) => {
        var datos = {
            "coef_reflexion": data.coef_reflexion,
            "inclinacion": data.inclinacion,
            "orientacion": data.orientacion,
            "potencia": data.potencia,
            "external": data.external,
            "eficiencia": data.eficiencia,
            "fs": data.fs,
            "rendimiento": data.rendimiento,
            "tipo_edificio": data.edificio,
            "costo_instalacion": data.costo_instalacion,
            "consumo_mensual": data.consumo_mensual,
            "demanda_potencia_electronica": data.demanda_potencia_electronica
        };
        console.log(datos);
        postCalculos(datos).then((info) => {
            console.log(info);
            if (info.props.datos.message === 'OK') {
                console.log("calculos");
                var aux = info.props.datos.datos[0].calculos;
                var aux1 = [];
                //console.log(aux);

                aux.map(function (key, i) {
                    aux1[i] = { "mes": key[0].mes, "dia": key[1].dia, "eps": key[2].eps, "declinacion": key[3].declinacion, "none": key[4].none, "w0": key[5].w0, "w180": key[6].w180, "wsard": key[7].wsard, "ws0": key[8].ws0, "bodm": key[9].bodm, "gdm": key[10].gdm, "ktm": key[11].ktm, "kdm": key[12].kdm, "ddm": key[13].ddm, "bdm0": key[14].bdm0, "bdmab": key[16].bdmab, "ddmab": key[17].ddmab, "rdmab": key[18].rdmab, "idp": key[19].idpmgdm };

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
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','septiembre','Octubre', 'Noviembre', 'Diciembre'],
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
            } else {
                setCalculos([]);
                //setTitles([]);
            }

        });
        //console.log(datos);
    }

    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    //if (!isAddMode) {
    //  formOptions.defaultValues = props.user;
    //}

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    //const { register, handleSubmit, formState: { errors } } = useForm();
    //onSubmit={handleSubmit(onSubmit)}
    return (
        <main className="col-12">
            <div className="card p-fluid">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid">
                        <div className='col'>
                            <div className="card">
                                <div class="card-body">
                                    <h5 class="card-title">Datos del lugar</h5>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Provincia</label>

                                            <select name="provincia" {...register('provincia')} className={`p-dropdown p-component p-inputtext ${errors.provincia ? 'p-invalid' : ''}`} onChange={changeSelectOptionHandlerP}>
                                                <option>Seleccione una provincia</option>
                                                {listaprovincia.map((prov, i) => (
                                                    <option key={i} value={prov.external}>{prov.nombre}</option>

                                                ))}
                                            </select>
                                            <div className="p-error">{errors.firstName?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Seleccione el canton</label>
                                            <select name="canton" {...register('canton')} className={`p-dropdown p-component p-inputtext ${errors.canton ? 'p-invalid' : ''}`} onChange={changeSelectOptionHandlerC}>
                                                <option>Seleccione un canton</option>
                                                {listaCanton.map((cant, i) => (
                                                    <option key={i} value={cant.external}>{cant.nombre}</option>

                                                ))}
                                            </select>
                                            <div className="p-error">{errors.canton?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Seleccione el Lugar</label>
                                            <select name="external" {...register('external', {
                                                required: true
                                            })} className={`p-dropdown p-component p-inputtext ${errors.external ? 'p-invalid' : ''}`} >
                                                <option value="">Seleccione un lugar</option>
                                                {listaSitios.map((sit, i) => (
                                                    <option key={i} value={sit.external}>{sit.nombre} -- fuente -- {sit.fuente}</option>

                                                ))}
                                            </select>
                                            <div className="p-error">{errors.external?.message}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div class="card-body">
                                    <h5 class="card-title">Carácterísticas del edificio</h5>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Seleccione el tipo de edificio</label>
                                            <select name="edificio" {...register('edificio')} className={`p-dropdown p-inputtext ${errors.edificio ? 'p-invalid' : ''}`} >
                                            <option>Seleccione un tipo de edificio</option>
                                                {listaEdificio.map((cant, i) => (
                                                    <option key={i} value={cant.nombre}>{cant.nombre}</option>

                                                ))}
                                            </select>
                                            <div className="p-error">{errors.fuente?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Consumo eléctrico promedio mensual [kWh]</label>
                                            <InputText name="consumo_mensual" type="text" {...register('consumo_mensual')} className={`form-control ${errors.consumo_mensual ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.consumo_mensual?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Demanda de potencia electrica [KW]</label>
                                            <InputText name="demanda_potencia_electronica" type="text" {...register('demanda_potencia_electronica')} className={`form-control ${errors.demanda_potencia_electronica ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.demanda_potencia_electronica?.message}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col'>

                            <div className="card">
                                <div class="card-body">
                                    <h5 class="card-title">Características del Sistema Fotovoltaico</h5>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Angulo de Inclinación, b [º]</label>
                                            <InputText name="inclinacion" type="text" {...register('inclinacion')} className={`form-control ${errors.inclinacion ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.inclinacion?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Orientación, a [º]</label>
                                            <InputText name="orientacion" type="text" {...register('orientacion')} className={`form-control ${errors.orientacion ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.orientacion?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Coeficiente de reflexion</label>
                                            <InputText name="coef_reflexion" type="text" {...register('coef_reflexion')} className={`${errors.coef_reflexion ? 'p-invalid' : ''}`} />

                                            <div className="p-error">{errors.coef_reflexion?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Potencia nominal del generador PNOM,G, [kWp]</label>
                                            <InputText name="potencia" type="text" {...register('potencia')} className={`form-control ${errors.potencia ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.potencia?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Eficiencia del panel fotovoltaico [%]</label>
                                            <InputText name="eficiencia" type="text" {...register('eficiencia')} className={`form-control ${errors.eficiencia ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.eficiencia?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Factor de sombras, FS, (0 - 1)</label>
                                            <InputText name="fs" type="text" {...register('fs')} className={`form-control ${errors.fs ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.fs?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Rendimiento característico PR4, (0 - 1)</label>
                                            <InputText name="rendimiento" type="text" {...register('rendimiento')} className={`form-control ${errors.rendimiento ? 'p-invalid' : ''}`} />
                                            <div className="p-error">{errors.rendimiento?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="field p-fluid">
                                            <label>Costo de compra e instalalción (USD/kWp)</label>
                                            <InputText name="costo_instalacion" type="text" {...register('costo_instalacion')} className={`form-control ${errors.costo_instalacion ? 'p-invalid' : ''}`} />
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
                                    <Button severity="success" type="submit" disabled={formState.isSubmitting} className="mr-2">
                                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                        Calcular
                                    </Button>
                                </div>
                                <div className="field col">
                                    <Button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Nuevo calculo</Button>

                                </div>
                            </div>
                        </div>


                    </div>



                </form>
            </div >


            <div style={{ display: calculos.length > 0 ? "block" : "none" }} className="card p-fluid">
                <div className='card'>

                    <h5 className='card-header'>INFORME DE RESULTADOS</h5>
                    <div className='container'>
                        <div className='grid'>
                            <div className='col'>
                                <Panel header="Energía solar fotovoltaica">
                                    <p className="m-0">
                                        {eneria} kWh/año
                                    </p>
                                </Panel>
                            </div>
                            <div className='col'>
                                <Panel header="Ahorro anual">
                                    <p className="m-0">
                                        {ahorro} USD/año
                                    </p>
                                </Panel>
                            </div>
                        </div>

                        <div className='grid'>
                            <div className='col'>
                                <Panel header="Superficie requerida">
                                    <p className="m-0">
                                        {superficie} m2
                                    </p>
                                </Panel>
                            </div>
                            <div className='col'>
                                <Panel header="Autoconsumo anual">
                                    <p className="m-0">
                                        {autoconsumo} Fotovoltaica/consumo
                                    </p>
                                </Panel>
                            </div>
                        </div>

                        <div className='grid'>
                            <div className='col'>
                                <Panel header="Relación kWh/kWp">
                                    <p className="m-0">
                                        {relacion} kWh/kWp
                                    </p>
                                </Panel>
                            </div>
                            <div className='col'>
                                <div className='grid'>
                                    <div className='col'>
                                        <Panel header="Costo de la instalación (USD)">
                                            <p className="m-0">
                                                {costo}
                                            </p>
                                        </Panel>
                                    </div>
                                    <div className='col'>
                                        <Panel header="Retorno de la inversión (años)">
                                            <p className="m-0">
                                                {retorno}
                                            </p>
                                        </Panel>
                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>
                </div>

                <div className="card">
                    <Chart type="bar" data={chartData} options={chartOptions} />
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