import { get,post,getWithKey, postWithKey } from "./conexion";
//necesita token
export async function personas(key) {
    var sitios = await getWithKey('admin/persona/lista',key);
    return sitios;
}
export async function getPerfil(external, key) {
    var sitios = await getWithKey('admin/perfil/'+external, key);
    return sitios;
}

export async function save_profile(data, key) {
    console.log(data);
    var sitios = await postWithKey('admin/perfil/modificar', data, key);
    return sitios;
}
export async function save_user(data, key) {
    var sitios = await postWithKey('admin/persona/guardar', data, key);
    return sitios;
}

export async function change_state(external, key) {
    var sitios = await getWithKey('admin/persona/estado/'+external, key);
    return sitios;
}