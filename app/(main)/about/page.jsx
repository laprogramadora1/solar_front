'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { Fieldset } from 'primereact/fieldset';
import { Image } from 'primereact/image';
const AboutPage = () => {
    const URL_MEDIA = process.env.path_only_images+"/";


    return (


        <div id="home" className="grid col-12 md:col-12">
            <div className="card col-12" style={{textAlign:"center", marginTop:"10px",marginBottom:"10px"}} width="100%">
            <h5>DESARROLLO DE UN SISTEMA DE SOPORTE DE DECISIONES PARA EL AUTOCONSUMO FOTOVOLTAICO EN EL ECUADOR: CASO PRÁCTICO EN LA REGIÓN SUR</h5>
            </div>
            <div className="col-6  md:col-6">
                <div className="card">
                    <div>
                        <Fieldset legend="Juan Carlos Solano Jiménez" toggleable collapsed={true}>
                            <div className="form-group row" style={{ marginBottom: "10px" }}>
                                <div className="flex justify-content-center">
                                    <Image src={URL_MEDIA + 'photo/jc.jpeg'} alt="Image" width="250" preview />
                                </div>
                                <p>
                                    Ingeniero en Electrónica y Telecomunicaciones.
                                </p>
                                <p>
                                    Máster en Electromecánica.
                                </p>
                                <p>
                                    Doctor en Energía Solar Fotovoltaica
                                </p>
                                <p>
                                    <b>Línea de investigación:</b>Energía Solar Fotovoltaica
                                </p>
                                 
                                <p>
                                <a href="mailto:juan.solano@unl.edu.ec">juan.solano@unl.edu.ec</a> 
                             
                                </p>
                            </div>
                        </Fieldset>
                    </div>
                </div>
            </div>

            <div className="col-6  md:col-6">
                <div className="card">
                    <div>
                        <Fieldset legend="Ángel José Ordóñez Mendieta" toggleable collapsed={true}>
                            <div className="form-group row" style={{ marginBottom: "10px" }}>
                                <div className="flex justify-content-center">
                                    <Image src={URL_MEDIA + 'photo/ordonez.jpg'} alt="Image" width="250" preview />
                                </div>
                                <p>
                                    Ingeniero en Electrónica y Telecomunicaciones.
                                </p>
                                <p>
                                    Magíster en Redes de Comunicaciones.
                                </p>
                                <p>
                                    Doctor en FÍSICA APLICADA Y TECNOLOGÍA
                                </p>
                                <p>
                                    <b>Línea de investigación:</b>Energía Solar Fotovoltaica
                                </p>
                               
                                
                                <p>
                                <a href="mailto:angel.j.ordonez@unl.edu.ec">angel.j.ordonez@unl.edu.ec</a> 
                             
                                </p>

                            </div>
                        </Fieldset>
                    </div>
                </div>
            </div>

            <div className="col-6  md:col-6">
                <div className="card">
                    <div>
                        <Fieldset legend="Miguel Ángel Caraballo Núñez" toggleable collapsed={true}>
                            <div className="form-group row" style={{ marginBottom: "10px" }}>
                                <div className="flex justify-content-center">
                                    <Image src={URL_MEDIA + 'photo/caraballo.jpeg'} alt="Image" width="250" preview />
                                </div>
                                <p>

                                    Ingeniero Electromecánico.
                                </p>
                                <p>
                                    Máster en Ingeniería Electromecánica.
                                </p>
                                <p>
                                    Doctor en Ciencias Técnicas.
                                </p>
                                <p>
                                    <b>Línea de investigación:</b>Energía Solar Fotovoltaica
                                </p>
                                <p>
                                <a href="mailto:miguel.caraballo@unl.edu.ec">miguel.caraballo@unl.edu.ec</a> 
                             
                                </p>
                            </div>
                        </Fieldset>
                    </div>
                </div>
            </div>

            <div className="col-6  md:col-6">
                <div className="card">
                    <div>
                        <Fieldset legend="Valeria del Rosario Herrera Salazar" toggleable collapsed={true}>
                            <div className="form-group row" style={{ marginBottom: "10px" }}>
                                <div className="flex justify-content-center">
                                    <Image src={URL_MEDIA + 'photo/valeria1.jpg'} alt="Image" width="250" preview />
                                </div>
                                <p>

                                Docente Titular de la Universidad Nacional de Loja.
                                </p>
                                <p>
                                Profesora de Auditoría en Sistemas,
                                </p>
                                <p>
                                Ingeniería.
                                </p>
                                <p>
                                <a href="mailto:vherrera@unl.edu.ec">vherrera@unl.edu.ec</a> 
                                </p>
                            </div>
                        </Fieldset>
                    </div>
                </div>
            </div>

           


        </div>
    );
};

export default AboutPage;
