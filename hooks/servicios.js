//import { data } from "browserslist";
import { get,post } from "./conexion";

export async function inicio() {
    var provincias = await get('inicio');
    return provincias;
}

export async function sesion(datos) {
    var provincias = await post('sesion', datos);
    return provincias;
}

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

export async function meses() {
    var fuentes = await get('meses');
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

export async function postCalculosSinSitio(data) {
    var calculos = await post('calculos/sinsitio', data);
    return calculos;
}

export async function totales() {
    var calculos = await get('admin/total');
    return calculos;
}

export async function sito_censo_fuente(external_sito, fuente) {
    var calculos = await get('sitio/censo/'+external_sito+"/"+fuente);
    return calculos;
}