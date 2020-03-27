const router = require('express').Router();
const { 
    obtenerCatalogos,
    insertarCatalogo,
    obtenerDatoCatalogo,
    insertarDatoCatalogo,
    obtenerPuntosAtencion,
    obtenerUsuariosPorPunto,
    actualizarPunto,
    getLogin 
} = require('../servicios/CatalogosServicio');

router.get('', async (req, res) => {
    let login = await getLogin(req);
    let status, resultado;
    if (login.auth) {
        resultado = await obtenerCatalogos(login.user, login.password);
        status = 200;
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }
    res.status(status).json(resultado);
});

router.get('/dato/:codigo', async (req, res) => {
    let login = await getLogin(req);
    let status, resultado;
    let codigoCatalogo = req.params.codigo;
    if (login.auth) {
        resultado = await obtenerDatoCatalogo(codigoCatalogo);
        status = 200;
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }
    res.status(status).json(resultado);
});

router.post('/insertar', async (req, res) => {
    let login = await getLogin(req);
    let status, resultado;
    let catalogo = req.body;
    console.log('Controller ', catalogo);
    if (login.auth) {
        resultado = await insertarCatalogo(catalogo);
        status = 200;
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }
    res.status(status).json(resultado);
})

router.post('/insertar-dato', async (req, res) => {
    let login = await getLogin(req);
    let status, resultado;
    let dato = req.body;
    console.log('Controller ', dato);
    if (login.auth) {
        resultado = await insertarDatoCatalogo(dato);
        status = 200;
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }
    res.status(status).json(resultado);
});

router.get('/puntos', async (req, res) => {
    let login = await getLogin(req);
    let status, resultado;
    if (login.auth) {
        resultado = await obtenerPuntosAtencion();
        status = 200;
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }
    res.status(status).json(resultado);
});

router.get('/usuarios-por-punto', async (req, res) => {
    let login = await getLogin(req);
    let status, resultado;
    if (login.auth) {
        resultado = await obtenerUsuariosPorPunto(req.body.punto);
        status = 200;
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }
    res.status(status).json(resultado);
});

router.put('/actualizar-punto-atencion', async (req, res) => {
    let login = await getLogin(req);
    let params = req.body;
    let status, resultado;
    if (login.auth) {
        usuarios = await obtenerUsuariosPorPunto(params.punto);
        if (usuarios.puntos == 0) {
            resultado = actualizarPunto(params.punto, params.estado);
            status = 200;
        } else if (usuarios.puntos > 0) {
            status = 500;
            resultado = { message: 'Existen usuarios activos' };
        }
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }
    res.status(status).json(resultado);
})

router.get('/prueba', async (req, res) => {
    let login = await getLogin(req);
    let status;
    let resultado;
    console.log(login);
    if (login.auth) {
        status = 200;
        resultado = {message: 'Esto es una prueba'};
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }

    res.status(status).json(resultado)
});


module.exports = router;
