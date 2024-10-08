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
import { save } from '../../../../../hooks/servicioProvincia';
import { Toast } from 'primereact/toast';
import { get } from '../../../../../hooks/utiles/utiles';
import message from '../../../../../component/message';
const GuardarProvincia = () => {
    const ruote = useRouter();
    const base_url = process.env.path;
    /* 
    Validations
    */
    const validationShema = Yup.object().shape({
        nombre: Yup.string().trim().required('Ingrese un dato')
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    let { errors } = formState;
    const myToast = useRef(null);

    const sendInfo = (datos) => {
        //{"email":"xxxx", "passsword":"xxxxxx"}
        console.log(datos);
        save(datos, get('token')).then((data) => {
            console.log(data.props.datos);
            const info = data.props.datos;
            if (info.code == '200') {
                myToast.current?.show({ severity: 'success', summary: 'Respuesta', detail: info.datos });
                message('Provincia registrada', 'Operacion exitosa!');
                ruote.push(base_url + 'dashboard/provincia');
            } else {
                if (info.code == '401') {
                    message('Token no existe, inicie sesion', 'Error de verificacion', 'error');
                    ruote.push(base_url + 'auth/login');
                } else if (info.code == '406') {
                    myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: info.datos });
                } else {
                    myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'Faltan datos' });
                }
            }
            //setSitio(data.props.data.datos);
        });
    };

    return (
        <div className="col-12 xl:col-12">
            <Toast ref={myToast} />
            <Card title="Registrar provincias">
                <div className="my-2">
                    <form onSubmit={handleSubmit(sendInfo)} className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label htmlFor="firstname3" className="p-col-fixed">
                                <b>Nombre</b>
                            </label>
                            <div className="p-col">
                                <InputText id="firstname3" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el nombre de la provincia" {...register('nombre')} autoFocus />
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
                                    ruote.push(base_url + 'dashboard/provincia');
                                }}
                            />
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};
export default GuardarProvincia;
