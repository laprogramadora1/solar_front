import { get,post } from "./conexion";
//necesita token
export async function provincias() {
    var sitios = await get('admin/provincias');
    return sitios;
}
export async function getProvincias(external, key) {
    var sitios = await get('admin/provincias/'+external);
    return sitios;
}
export async function save(data, key) {
    var sitios = await post('admin/provincias/guardar', data);
    return sitios;
}
export async function update(data, key) {
    var sitios = await post('admin/provincias/modificar', data);
    return sitios;
}