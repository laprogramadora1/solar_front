'use client';
import 'primeflex/primeflex.css';

import React, { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { Card } from 'primereact/card';

import { Toast } from 'primereact/toast';
import { get, removeKey } from '../../../../hooks/utiles/utiles';
import { getPerfil, save_profile } from '../../../../hooks/servicioPersona';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import message from '../../../../component/message';

const GuardarPerfil = () => {
    const ruote = useRouter();
    const base_url = process.env.path;
    const external_cuenta = get("external");
    let [user, setUser] = useState(null);


    /* 
    Validations
    */
    const validationShema = Yup.object().shape({
        apellidos: Yup.string().trim().required('Ingrese un dato'),
        nombres: Yup.string().trim().required('Ingrese un dato'),
        clave: Yup.string().trim().required('Ingrese su nueva clave').min(4, 'La clave debe tener minimo 4 caracteres').max(8, 'La clave debe tener maximo 8 caracteres')
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState, reset } = useForm(formOptions);
    let { errors } = formState;
    const myToast = useRef(null);

    const sendInfo = (datos) => {
        //{"email":"xxxx", "passsword":"xxxxxx"}
        //console.log(datos);
        let data1 = {"apellidos":datos.apellidos,
            "nombres":datos.nombres,
            "clave": datos.clave,
            "external":external_cuenta
        }
        save_profile(data1, get("token")).then((data) => {
           // console.log(data.props.datos);
            const info = data.props.datos;
            if (info.code == '200') {
                //myToast.current?.show({ severity: "success", summary: "Respuesta", detail: info.datos });
                
                removeKey('token');
                removeKey('user');
                removeKey('permiso');
                message(info.datos,"Operación existosa!");
                ruote.push(base_url + "auth/login");
            } else {
                if (info.code == '401') {
                    message("Token no existe, inicie sesion", "Error de verificacion", "error");
                    ruote.push(base_url + "auth/login");
                } else {
                    myToast.current?.show({ severity: "error", summary: "Respuesta", detail: "Faltan datos" });
                }
            }
            //setSitio(data.props.data.datos);
        });
    };

    useEffect(() => {
        getPerfil(external_cuenta, get("token")).then((data) => {
            if (data.props.data.code == '200') {
                setUser(data.props.data.datos);
                reset({
                    "apellidos": data.props.data.datos.apellidos,
                    "nombres": data.props.data.datos.nombres,
                    "clave": ""
                });
            } else {
                setUser(null);
            }
            //console.log(data);
        });
    }, []);

    const footer = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Sugerencia</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>Al menos un caracter en mayuscula</li>
                <li>Al menos un caracter numerico</li>
                <li>Minimo 4 caracteres</li>
                <li>Maximo 8 caracteres</li>
            </ul>
        </React.Fragment>
    );

    return (

        <div className="col-12 xl:col-12">
            <Toast ref={myToast} />
            <Card title="Perfil de usuario">
                <div className="my-2">
                    <form onSubmit={handleSubmit(sendInfo)} className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-grid" style={{ margin: "10px" }}>
                            <label htmlFor="firstname3" className="p-col-fixed" ><b>Apellidos</b></label>
                            <div className="p-col">
                                <InputText id="firstname3" type="text" style={{ marginTop: "10px" }}
                                    placeholder='Ingrese su apellido'
                                    {...register('apellidos')}
                                    defaultValue={user && user.apellidos}

                                />
                            </div>
                            {errors.apellidos && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.apellidos?.message}</small>}
                        </div>

                        <div className="p-field p-grid" style={{ margin: "10px" }}>
                            <label htmlFor="firstname" className="p-col-fixed" ><b>Nombres</b></label>
                            <div className="p-col">
                                <InputText id="firstname2" type="text" style={{ marginTop: "10px" }}
                                    placeholder='Ingrese su nombre'
                                    {...register('nombres')}
                                    defaultValue={user && user.nombres}


                                />
                            </div>
                            {errors.nombres && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.nombres?.message}</small>}
                        </div>

                        <div className="p-field p-grid" style={{ margin: "10px" }}>
                            <label htmlFor="firstname4" className="p-col-fixed" ><b>Identificacion</b></label>
                            <div className="p-col">
                                <InputText id="firstname4" type="text" style={{ marginTop: "10px" }}
                                    placeholder='Ingrese su dni'
                                    defaultValue={user && user.dni}

                                    {...register('dni')}
                                    readOnly
                                />
                            </div>
                            {errors.dni && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.dni?.message}</small>}
                        </div>

                        <div className="p-field p-grid" style={{ margin: "10px" }}>
                            <label htmlFor="firstname5" className="p-col-fixed" ><b>Correo electronico</b></label>
                            <div className="p-col">
                                <InputText id="firstname5" type="text" style={{ marginTop: "10px" }}
                                    placeholder='Ingrese su correo'
                                    defaultValue={user && user.cuenta[0].correo}
                                    {...register('correo')}
                                    readOnly
                                    autoFocus
                                />
                            </div>
                            {errors.correo && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.correo?.message}</small>}
                        </div>

                        <div className="p-field p-grid" style={{ margin: "10px" }}>
                            <label htmlFor="firstname6" className="p-col-fixed" ><b>Correo electronico</b></label>
                            <div className="p-col">
                                <Password id="firstname6"
                                    style={{ marginTop: "10px" }}
                                    placeholder='Ingrese su clave'
                                    {...register('clave')}
                                    onChange={(e) => { reset({ "clave": e.target.value }) }}
                                    footer={footer}
                                    toggleMask
                                />
                            </div>
                            {errors.clave && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.clave?.message}</small>}
                        </div>

                        <div className="p-field p-col-12 p-md-3" style={{ margin: "10px" }}>
                            <Button label="Guardar" icon="pi pi-check" type='submit' />
                            <Button label="Cancelar" icon="pi pi-times" text onClick={(e) => { ruote.push(base_url + "dashboard/provincia") }} />

                        </div>


                    </form>
                </div>
            </Card>


        </div>

    );
};
export default GuardarPerfil;
