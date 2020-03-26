const decode = require('atob');
const { getCatalogos, getPuntoAtencion, getDatoCatalogo, insertCatalogo, getUsuario, insertDatoCatalogo } = require('../repositorio/consultas');


async function obtenerCatalogos(pUsuario, pPassword) {
    const user = await getUsuario(pUsuario, pPassword);
    console.log(user);
    if (user.length === 1) {
        const result = await getCatalogos();
        return result;
    }

    return { message: 'Error al obtener el catalogo' };
}

async function obtenerPuntosAtencion(pUsuario, pPassword) {
    const user = await getUsuario(pUsuario, pPassword);
    console.log('punto atencion', user);
    if (user.length === 1) {
        const result = await getPuntoAtencion();
        return result;
    }

    return { message: 'Error al obtener el catalogo' };
}

async function obtenerDatoCatalogo(pUsuario, pPassword, pCodigo) {
    const user = await getUsuario(pUsuario, pPassword);
    console.log(user, 'datosss');
    if (user.length === 1) {
        const result = await getDatoCatalogo(pCodigo);
        return result;
    }

    return { message: 'Error al obtener el catalogo' };
}

async function insertarCatalogo(pUsuario, pPassword, catalogo) {
    const user = await getUsuario(pUsuario, pPassword);
    console.log('Servicio ', catalogo);
    if (user.length === 1) {
        const result = await insertCatalogo(catalogo);
        return result;
    }

    return { message: 'Error al ingresar el catalogo' };
}

async function insertarDatoCatalogo(pUsuario, pPassword, pDato) {
    const user = await getUsuario(pUsuario, pPassword);
    console.log('Servicio ', pDato);
    if (user.length === 1) {
        const result = await insertDatoCatalogo(pDato);
        return { status: 'ok' };
    }

    return { message: 'Error al ingresar el dato' };
}

function getLogin(req) {
    let headers = req.headers;
    // console.log('Headers: ', headers);
    if (headers.authorization) {
        let auth = decode(headers.authorization.split(" ")[1]);
        auth = auth.split(':');
        let login = { user: auth[0], password: auth[1]};
        if (login.user == '' || login.password == ''){
            //auten = false;
           // console.log(auten);
            return {auth: false};
        }
        else{
            return { user: auth[0], password: auth[1], auth: true};
        }
    }

    return { user: '', password: '', auth: false };
}

module.exports = {
    obtenerCatalogos,
    insertarCatalogo,
    obtenerDatoCatalogo,
    insertarDatoCatalogo,
    obtenerPuntosAtencion,
    getLogin
}