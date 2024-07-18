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
import { getProvincias, update } from '../../../../../hooks/servicioProvincia';
import { Toast } from 'primereact/toast';
import { get } from '../../../../../hooks/utiles/utiles';
import message from '../../../../../component/message';
const ModificarProvincia = ({ params }) => {
    const ruote = useRouter();
    const base_url = process.env.path;
    const external = params.external;
    let [obj, setObj] = useState(null);
    useEffect(() => {
        getProvincias(external, get('token')).then((data) => {
            console.log(data.props.data);
            if (data.props.data.code == '200') {
                setObj(data.props.data.datos);
            } else {
                if (data.props.data.code == '401') {
                    message('Token no existe, inicie sesion', 'Error de verificacion', 'error');
                    ruote.push(base_url + 'auth/login');
                }
            }
        });
    }, []);
    //console.log(params.external);
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
        const aux = { nombre: datos.nombre, external: external };
        console.log(aux);
        update(aux, get('token')).then((data) => {
            const info = data.props.datos;
            if (info.code == '200') {
                message('Provincia modificada', 'Operacion exitosa!');
                //myToast.current?.show({severity: "success", summary: "Respuesta", detail: info.datos});
                ruote.push(base_url + 'dashboard/provincia');
            } else {
                myToast.current?.show({ severity: 'error', summary: 'Respuesta', detail: 'Faltan datos' });
            }
            //setSitio(data.props.data.datos);
        });
    };

    return (
        <div className="col-12 xl:col-12">
            <Toast ref={myToast} />
            <Card title="Editar provincias">
                <div className="my-2">
                    <form onSubmit={handleSubmit(sendInfo)} className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-grid" style={{ margin: '10px' }}>
                            <label htmlFor="firstname3" className="p-col-fixed">
                                <b>Nombre</b>
                            </label>
                            <div className="p-col">
                                <InputText defaultValue={obj && obj.nombre} id="firstname3" type="text" style={{ marginTop: '10px' }} placeholder="Ingrese el nombre de la provincia" {...register('nombre')} autoFocus />
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
export default ModificarProvincia;
