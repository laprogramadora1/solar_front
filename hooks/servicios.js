//import { data } from "browserslist";
import { get,post } from "./conexion";
export async function provincias() {
    var provincias = await get('provincia');
    return provincias;
}

export async function cantonesPorProvincia(external) {
    var cantones = await get('canton/'+external);
    return cantones;
}

export async function fuentes() {
    var fuentes = await get('fuentes');
    return fuentes;
}

export async function tarifa() {
    var edificios = await get('catalogo/tarifa');
    return edificios;
}

export async function edificio_tarifa(external_tarifa) {
    var edificios = await get('catalogo/tarifa/'+external_tarifa);
    return edificios;
}

export async function edificio() {
    var edificios = await get('catalogo/edificio');
    return edificios;
}

export async function sitiosPorCanton(external) {
    var sitios = await get('sitio/canton/'+external);
    return sitios;
}

export async function sitiosSoloNombrePorCanton(external) {
    var sitios = await get('sitio/soloCanton/'+external);
    return sitios;
}


export async function sitiosPorCantonFuente(external, fuente) {
    var sitios = await get('sitio/canton/'+external+'/'+fuente);
    return sitios;
}


export async function postCalculos(data) {
    var calculos = await post('calculos', data);
    return calculos;
}

export async function totales() {
    var calculos = await get('admin/total');
    return calculos;
}