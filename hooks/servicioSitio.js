import { get,post,getWithKey, postWithKey } from "./conexion";
//necesita token
export async function sitios(key) {
    var sitios = await getWithKey('admin/sitio',key);
    return sitios;
}


export async function sitios_cantones(external,key) {
    var sitios = await getWithKey('admin/sitio/canton/'+external,key);
    return sitios;
}
export async function sitios_activate(key) {
    var sitios = await getWithKey('admin/sitio/activate',key);
    return sitios;
}
export async function getSitios(external, key) {
    var sitios = await getWithKey('admin/sitio/'+external, key);
    return sitios;
}
export async function getSitiosNombres(external, key) {
    var sitios = await getWithKey('admin/sitio/nombre/'+external, key);
    return sitios;
}
export async function save_sitio(data, key) {
    console.log(data);
    var sitios = await postWithKey('admin/sitio/guardar', data, key);
    return sitios;
}
export async function update(data, key) {
    var sitios = await postWithKey('admin/sitio/modificar', data, key);
    return sitios;
}