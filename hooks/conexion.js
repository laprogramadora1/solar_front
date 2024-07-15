//let URL = "https://computacion.unl.edu.ec/pdml/solar_back/api/";
let URL = "http://localhost:5000/api/";
export async function get(recurso) {
    const response = await fetch(URL + recurso);
    try {
        const data = await response.json();
        return {
            props: {
                data,
            },
        };
    } catch (e) {
        return {
            props: {
                "datos": {
                    "msg": "error",
                    "code": "500",
                    "datos": "Error de conexion"
                }
            }
        };
    }

}

export async function getWithKey(recurso, llave) {
    try {
        const header = {
            "Content-Type": "application/json",
            "X-Access-Token": llave
        };
        const response = await fetch(URL + recurso, {headers:header});
        const data = await response.json();
        return {
            props: {
                data,
            },
        };
    } catch (e) {

        return {
            props: {
                "datos": {
                    "msg": "error",
                    "code": "500",
                    "datos": "Error de conexion"
                }
            }
        };

    }

}

export async function post(recurso, data) {
    console.log(data);
    const headers = {
        "Content-Type": "application/json"
    };

    try {
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
    } catch (e) {

        return {
            props: {
                "datos": {
                    "msg": "error",
                    "code": "500",
                    "datos": "Error de conexion"
                }
            }
        };

    }

}

export async function postWithKey(recurso, data, key) {
    const headers = {
        "Content-Type": "application/json",
        "X-Access-Token": key
    };
    try {
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
    } catch (e) {

        return {
            props: {
                "datos": {
                    "msg": "error",
                    "code": "500",
                    "datos": "Error de conexion"
                }
            }
        };

    }

}