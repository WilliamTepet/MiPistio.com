const decode = require('atob');
const { 
    getCatalogos,
    getPuntoAtencion,
    getDatoCatalogo,
    insertCatalogo,
    getUsuario,
    insertarPunto,
    getUsuariosByPuntoAtencion,
    updatePuntoAtencion,
    insertarDatoCatalogo,
    updateDatoCatalogo
} = require('../repositorio/consultas');


async function obtenerCatalogos() {
    const result = await getCatalogos();
    return result;
}

async function obtenerPuntosAtencion() {
    const result = await getPuntoAtencion();
    return result;
}

async function obtenerDatoCatalogo(pCodigo) {
    const result = await getDatoCatalogo(pCodigo);
    return result;
}

async function insertarCatalogo(catalogo) {
    console.log('Servicio ', catalogo);
    const result = await insertCatalogo(catalogo);
    return result;
}

async function insertarPuntoAtencion(pDato) {
    console.log('Servicio ', pDato);
    const result = await insertarPunto(pDato);
    return { status: 'ok' };
}

async function insertarDatoCat(pDato) {
    console.log('Servicio ', pDato);
    const result = await insertarDatoCatalogo(pDato);
    return { status: 'ok' };
}

async function updateDatoCat(pDato) {
    console.log('Servicio ', pDato);
    const result = await updateDatoCatalogo(pDato);
    if (result.rowCount > 0) {
        return { status:1, message: 'dato actualizado' };
    } else if (result.rowCount === 0) {
        return { status:2, message: 'dato no existe' };
    } else {
        return { status:3, message: 'ocurrio un error' };
    }
    
}

async function obtenerUsuariosPorPunto(pPunto) {
    const usuarios = await getUsuariosByPuntoAtencion(pPunto);
    return usuarios;
}

async function actualizarPunto(punto) {
    const result = await updatePuntoAtencion(punto);
    console.log('Actualizacion ', result);
    return result;
}

async function getLogin(req) {
    let headers = req.headers;
    // console.log('Headers: ', headers);
    if (headers.authorization) {
        let auth = decode(headers.authorization.split(" ")[1]);
        auth = auth.split(':');
        let login = { user: auth[0], password: auth[1]};
        if (login.user == '' || login.password == ''){
            return {auth: false};
        }
        else{
            const user = await getUsuario(login.user, login.password);
            if (user.length === 1) {
                return { user: auth[0], password: auth[1], auth: true }
            }
            else {
                return {auth: false};
            }
        }
    }

    return { user: '', password: '', auth: false };
}

module.exports = {
    obtenerCatalogos,
    insertarCatalogo,
    obtenerDatoCatalogo,
    insertarPuntoAtencion,
    obtenerPuntosAtencion,
    obtenerUsuariosPorPunto,
    actualizarPunto,
    insertarDatoCat,
    updateDatoCat,
    getLogin
}