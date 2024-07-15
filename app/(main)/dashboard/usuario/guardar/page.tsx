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
import { get, removeKey } from '../../../../../hooks/utiles/utiles';
import { getPerfil, save_profile, save_user } from '../../../../../hooks/servicioPersona';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import message from '../../../../../component/message';

const GuardarUsuario = () => {
    const ruote = useRouter();
    const base_url = process.env.path;
    
    /* 
    Validations
    */
    const validationShema = Yup.object().shape({
        apellidos: Yup.string().trim().required('Ingrese un dato'),
        nombres: Yup.string().trim().required('Ingrese un dato'),
        correo: Yup.string().trim().email('Ingrese un correo valido').required('Ingrese un dato'),
        dni: Yup.string().trim().required('Ingrese la identifiacion').min(10, 'La identificacion debe tener minimo 10 caracteres').max(15, 'La identificacion debe tener maximo 15 caracteres')
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState, reset } = useForm(formOptions);
    let { errors } = formState;
    const myToast = useRef(null);

    const sendInfo = (datos) => {
        //{"email":"xxxx", "passsword":"xxxxxx"}
        //console.log(datos);
        let data1 = {
            "apellidos":datos.apellidos,
            "nombres":datos.nombres,
            "clave": datos.dni,
            "dni":datos.dni,
            "correo": datos.correo
        }
        save_user(data1, get("token")).then((data) => {
            //console.log(data.props.datos);
            const info = data.props.datos;
            if (info.code == '200') {                
                message(info.datos,"Operación existosa!");
                ruote.push(base_url + "dashboard/usuario");
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
    
    return (

        <div className="col-12 xl:col-12">
            <Toast ref={myToast} />
            <Card title="Registro   de usuario">
                <div className="my-2">
                    <form onSubmit={handleSubmit(sendInfo)} className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-grid" style={{ margin: "10px" }}>
                            <label htmlFor="firstname3" className="p-col-fixed" ><b>Apellidos</b></label>
                            <div className="p-col">
                                <InputText id="firstname3" type="text" style={{ marginTop: "10px" }}
                                    placeholder='Ingrese su apellido'
                                    {...register('apellidos')}
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
                                />
                            </div>
                            {errors.nombres && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.nombres?.message}</small>}
                        </div>

                        <div className="p-field p-grid" style={{ margin: "10px" }}>
                            <label htmlFor="firstname4" className="p-col-fixed" ><b>Identificacion</b></label>
                            <div className="p-col">
                                <InputText id="firstname4" type="text" style={{ marginTop: "10px" }}
                                    placeholder='Ingrese su dni'
                                    

                                    {...register('dni')}
                                    
                                />
                            </div>
                            {errors.dni && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.dni?.message}</small>}
                        </div>

                        <div className="p-field p-grid" style={{ margin: "10px" }}>
                            <label htmlFor="firstname5" className="p-col-fixed" ><b>Correo electronico</b></label>
                            <div className="p-col">
                                <InputText id="firstname5" type="text" style={{ marginTop: "10px" }}
                                    placeholder='Ingrese su correo'                                    
                                    {...register('correo')}
                                    
                                    autoFocus
                                />
                            </div>
                            {errors.correo && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.correo?.message}</small>}
                        </div>

                        
                        <div className="p-field p-col-12 p-md-3" style={{ margin: "10px" }}>
                            <Button label="Guardar" icon="pi pi-check" type='submit' />
                            <Button label="Cancelar" icon="pi pi-times" text onClick={(e) => { ruote.push(base_url + "dashboard/usuario") }} />

                        </div>


                    </form>
                </div>
            </Card>


        </div>

    );
};
export default GuardarUsuario;
