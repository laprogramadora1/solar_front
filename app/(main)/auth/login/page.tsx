/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter, redirect } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { sesion } from '../../../../hooks/servicios';
import { Toast } from 'primereact/toast';
import { add, isSession } from '../../../../hooks/utiles/utiles';
import message from '../../../../component/message';

const LoginPage = () => {
    const base_url = process.env.path;
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    /* 
    Validations
    */
    const validationShema = Yup.object().shape({
        correo: Yup.string().trim().email().required('Ingrese un correo valido'),
        clave: Yup.string().trim().required('Ingrese su clave')
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState, reset } = useForm(formOptions);
    let { errors } = formState;
    const myToast = useRef(null);

    

    const sendInfo = (datos) => {
        //let datitos = datos;
        const datito = {"correo": datos.correo,"clave":datos.clave};    
        sesion(datito).then((data) => {
           
            const info = data.props.datos;
            if (info.code == '200') {
                myToast.current?.show({ severity: "success", summary: "Respuesta", detail: info.msg });
                console.log(info);
                add("token", info.datos.token);
                add("user", info.datos.user);
                add("permiso", info.datos.permiso);
                add("external",info.datos.external);
                message("Bienvenido " + info.datos.user, "Acceso exitoso!");
                //router.refresh();
                router.push(base_url + "dashboard",  { refresh: true });
                isSession();
                router.refresh();
                //router.replace(base_url + "dashboard", { scroll: false });
                //redirect(base_url + "dashboard");
            } else {
                myToast.current?.show({ severity: "error", summary: "Respuesta", detail: info.datos });
            }

        });
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <Toast ref={myToast} />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenido, usuario!</div>
                            <span className="text-600 font-medium">Inicie sesion para continuar</span>
                        </div>
                        <form onSubmit={handleSubmit(sendInfo)} className="p-fluid p-formgrid p-grid">
                            <div>
                                {(errors.correo || errors.clave) && <Panel header="Errores">
                                    {errors.correo && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.correo?.message}</small>}
                                    {errors.clave && <small style={{ marginTop: "10px" }} className="p-invalid text-xs inline-block py-1 px-2 rounded text-red-600">{errors.clave?.message}</small>}

                                </Panel>}
                                <Divider />
                                <div>
                                    <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                        Correo electronico
                                    </label>
                                    <InputText id="email1" type="text" {...register('correo')} placeholder="Ingrese el Correo electronico" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                                </div>
                                <div>
                                    <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                        Clave
                                    </label>
                                    <Password inputId="password1" feedback={false} onKeyUp={(e) => reset({ "clave": e.target.value })} {...register('clave')} placeholder="Ingrese su clave" className="w-full mb-5" toggleMask></Password>

                                </div>


                                <div className="flex align-items-center justify-content-between mb-5 gap-5">

                                    <a href={base_url} className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                        Regresar al inicio
                                    </a>
                                </div>
                                <Button label="Inicio de sesion"  type='submit' className="w-full p-3 text-xl" ></Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default LoginPage;
