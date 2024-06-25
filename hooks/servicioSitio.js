import { get,post } from "./conexion";
//necesita token
export async function sitios() {
    var sitios = await get('admin/sitio');
    return sitios;
}