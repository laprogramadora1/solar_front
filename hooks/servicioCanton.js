import { get,post,getWithKey,postWithKey } from "./conexion";
//necesita token
export async function cantones(key) {
    var sitios = await getWithKey('admin/canton',key);
    return sitios;
}
export async function cantones_provincia(external,key) {
    var sitios = await getWithKey('admin/canton/provincia/'+external,key);
    return sitios;
}
export async function cantones_activate(key) {
    var sitios = await getWithKey('admin/canton/activate',key);
    return sitios;
}
export async function getCantones(external, key) {
    var sitios = await getWithKey('admin/canton/'+external, key);
    return sitios;
}
export async function save(data, key) {
    var sitios = await postWithKey('admin/canton/guardar', data, key);
    return sitios;
}
export async function update(data, key) {
    var sitios = await postWithKey('admin/canton/modificar', data, key);
    return sitios;
}