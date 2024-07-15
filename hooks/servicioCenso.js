import { get,post,getWithKey, postWithKey } from "./conexion";
//necesita token
export async function censos(key) {
    var sitios = await getWithKey('admin/censo',key);
    return sitios;
}


export async function censos_sitio(external,key) {
    var sitios = await getWithKey('admin/censo/sitio/'+external,key);
    return sitios;
}

export async function getCensos(external, key) {
    var sitios = await getWithKey('admin/censo/'+external, key);
    return sitios;
}
export async function save_censo(data, key) {
    console.log(data);
    var sitios = await postWithKey('admin/censo/guardar', data, key);
    return sitios;
}
export async function update(data, key) {
    var sitios = await postWithKey('admin/censo/modificar', data, key);
    return sitios;
}