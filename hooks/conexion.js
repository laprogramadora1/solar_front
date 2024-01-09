//let URL = "https://computacion.unl.edu.ec/pdml/solar_back/api/";
let URL = "http://localhost:5000/api/";
export async function get(recurso) {
    const response = await fetch(URL + recurso);
    const data = await response.json();
    return {
        props: {
            data,
        },
    };
}

export async function getWithKey(recurso, llave) {
    const response = await fetch(URL + recurso);
    const data = await response.json();
    return {
        props: {
            data,
        },
    };
}

export async function post(recurso, data) {
    const headers = {
        'Accept': 'application/json',
        "Content-Type": "application/json"
    };
    const response = await fetch(URL + recurso, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });
    const datos = await response.json();
    return {
        props: {
            datos,
        },
    };
}

export async function postWithKey(recurso, data, key) {
    const headers = {
        'Accept': 'application/json',
        "Content-Type": "application/json",
        "X-API-TOKEN": key
    };
    const response = await fetch(URL + recurso, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });
    const datos = await response.json();
    return {
        props: {
            datos,
        },
    };
}