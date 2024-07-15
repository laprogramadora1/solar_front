import { get,post,getWithKey,postWithKey } from "./conexion";
//necesita token
export async function provincias(key) {
    var sitios = await getWithKey('admin/provincias',key);
    return sitios;
}
export async function provincias_activate(key) {
    var sitios = await getWithKey('admin/provincias/activate',key);
    return sitios;
}
export async function getProvincias(external, key) {
    var sitios = await getWithKey('admin/provincias/'+external, key);
    return sitios;
}
export async function save(data, key) {
    var sitios = await postWithKey('admin/provincias/guardar', data, key);
    return sitios;
}
export async function update(data, key) {
    var sitios = await postWithKey('admin/provincias/modificar', data, key);
    return sitios;
}