const router = require('express').Router();
const { 
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
        resultado = await insertarPuntoAtencion(dato);
        status = 200;
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }
    res.status(status).json(resultado);
});

router.post('/insertar-dato-catalogo', async (req, res) => {
    let login = await getLogin(req);
    let status, resultado;
    let dato = req.body;
    console.log('Controller ', dato);
    if (login.auth) {
        resultado = await insertarDatoCat(dato);
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
    let punto = req.body;
    let status, resultado;
    if (login.auth) {
        usuarios = await obtenerUsuariosPorPunto(punto.id);
        if (usuarios.puntos == 0) {
            resultado = await actualizarPunto(punto);
            console.log('Punto actualizado ', resultado)
            status = 200;
        } else if (usuarios.puntos > 0) {
            status = 200;
            resultado = { status: 2, message: `Existen ${usuarios.puntos} usuarios activos` };
        }
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }
    res.status(status).json(resultado);
})

router.put('/actualizar-dato-catalogo', async (req, res) => {
    let login = await getLogin(req);
    let dato = req.body;
    let status, resultado;
    if (login.auth) {
        resultado = await updateDatoCat(dato);
        console.log('dato actualizado ', resultado)
        status = 200;
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
