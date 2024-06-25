'use client';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { provincias } from '../../../../hooks/servicios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';

const ListaProvincia = () => {
    const ruote = useRouter();
    const base_url = process.env.path;
    const [sitio, setSitio] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');

    useEffect(() => {
        provincias().then((data) => {
            console.log(data.props.data);
            setSitio(data.props.data.datos);
        });

    }, []);
   
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Products</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const searchBodyTemplate = (value) => {
        //console.log(value);
        return <Link href={base_url+"dashboard/provincia/"+value.external}><b className='pi pi-pencil'></b></Link>//<Button icon="pi pi-search" />;
    }
    return (
        <div className="grid">
            <div className="col-12 xl:col-12">
                <div className="card">
                    <h5 >Provincias registradas</h5>
                    <div className="my-2">
                        <Button onClick={(e)=>{ruote.push(base_url+"dashboard/provincia/guardar")}}  label="Nuevo" outlined icon="pi pi-plus" severity="success" className=" mr-2" />
                        

                    </div>
                    {sitio && <DataTable value={sitio} 
                        dataKey="external"
                        rows={10} paginator responsiveLayout="scroll"
                        emptyMessage="No hay datos."
                        className="datatable-responsive"
                        header={header}
                        globalFilter={globalFilter}
                    >
                        <Column body={(data, options) => options.rowIndex + 1} header="#" sortable style={{ width: '15%' }} />
                        <Column field="nombre" header="Nombre" sortable style={{ width: '35%' }} />
                        <Column field="nro_cantones" header="Nro cantones" sortable style={{ width: '25%' }} />
                        <Column field="estado"  header="Estado"  style={{ width: '25%' }} />
                        <Column header="Acciones" body={searchBodyTemplate} headerStyle={{ minWidth: '10rem' }}>
                            
                        </Column>

                    </DataTable>}
                </div>

            </div>
        </div>
    );
};
export default ListaProvincia;
