'use client';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { provincias } from '../../../../hooks/servicioProvincia';
import { get } from '../../../../hooks/utiles/utiles';
import message from '../../../../component/message';
import { Toast } from 'primereact/toast';
import { change_state, personas } from '../../../../hooks/servicioPersona';

const ListaUsuarios = () => {
    useEffect(() => {
        console.log(window.document);
    }, []);
    const ruote = useRouter();
    const base_url = process.env.path;
    const [sitio, setSitio] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const myToast = useRef(null);
    useEffect(() => {
        //KEY
        personas(get('token')).then((data) => {
            console.log(data.props.data);
            if (data.props.data.code == '200') {
                setSitio(data.props.data.datos);
            } else {
                if (data.props.data.code == '401') {
                    message('Token no existe, inicie sesion', 'Error de verificacion', 'error');
                    ruote.push(base_url + 'auth/login');
                } else {
                    myToast.current?.show({ severity: 'error', summary: 'Error', detail: data.props.data.datos });
                }
            }
        });
    }, []);

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Lista de usuarios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );
    let change_state1 = function (external) {
        change_state(external, get('token')).then((data) => {
            console.log(data.props.data);
            if (data.props.data.code == '200') {
                message(data.props.data.datos, 'Operación exitosa');
                ruote.push(base_url + 'auth/login');
            } else {
                if (data.props.data.code == '401') {
                    message('Token no existe, inicie sesion', 'Error de verificacion', 'error');
                    ruote.push(base_url + 'auth/login');
                } else {
                    myToast.current?.show({ severity: 'error', summary: 'Error', detail: data.props.data.datos });
                }
            }
        });
    };
    const searchBodyTemplate = (value) => {
        //console.log(value);
        if (value.rol.nombre != 'ADMIN') {
            if (value.cuenta.estado == 'true' || value.cuenta.estado == true) {
                return (
                    <Button
                        label="Desactivar"
                        link
                        icon="pi pi-user-minus"
                        onClick={(e) => {
                            const confirmBox = window.confirm('Desea realizar esta operación?');
                            if (confirmBox === true) {
                                change_state1(value.external);
                            }
                        }}
                    ></Button>
                );
            } else {
                return (
                    <Button
                        label="Activar"
                        link
                        icon="pi pi-user-plus"
                        onClick={(e) => {
                            const confirmBox = window.confirm('Desea realizar esta operación?');
                            if (confirmBox === true) {
                                change_state1(value.external);
                            }
                        }}
                    ></Button>
                );
            }
        }

        //<Button icon="pi pi-search" />;
    };
    const typeState = (value) => {
        console.log(value);
        if (value.cuenta.estado == 'true' || value.cuenta.estado == true) {
            return <span>Activo</span>;
        } else {
            return <span>Desactivado</span>;
        }
        //return <Link href={base_url+"dashboard/usuario/"+value.external}><b className='pi pi-pencil'></b></Link>//<Button icon="pi pi-search" />;
    };
    return (
        <div className="grid">
            <Toast ref={myToast} />
            <div className="col-12 xl:col-12">
                <div className="card">
                    <h5>Usuarios registradas</h5>
                    <div className="my-2">
                        <Button
                            onClick={(e) => {
                                ruote.push(base_url + 'dashboard/usuario/guardar');
                            }}
                            label="Nuevo"
                            outlined
                            icon="pi pi-plus"
                            severity="success"
                            className=" mr-2"
                        />
                    </div>
                    {sitio && (
                        <DataTable value={sitio} dataKey="external" rows={10} paginator responsiveLayout="scroll" emptyMessage="No hay datos." className="datatable-responsive" header={header} globalFilter={globalFilter}>
                            <Column body={(data, options) => options.rowIndex + 1} header="#" sortable style={{ width: '15%' }} />
                            <Column field="apellidos" header="Apellidos" sortable style={{ width: '35%' }} />
                            <Column field="nombres" header="Nombres" sortable style={{ width: '35%' }} />
                            <Column field="cuenta.correo" header="Correo electronico" sortable style={{ width: '25%' }} />
                            <Column field="rol.descripcion" header="Permiso" style={{ width: '25%' }} />
                            <Column header="Estado" body={typeState} />
                            <Column header="Acciones" body={searchBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ListaUsuarios;
