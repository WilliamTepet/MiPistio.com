const router = require('express').Router();
const { obtenerCatalogos, obtenerPuntosAtencion,obtenerDatoCatalogo, insertarCatalogo, insertarDatoCatalogo, getLogin } = require('../servicios/CatalogosServicio');

router.get('', async (req, res) => {
    let login = getLogin(req);
    if (login.auth) {
        let result = await obtenerCatalogos(login.user, login.password);
        // console.log(result);
        res.json(result);
    }
    res.json({ message: 'no hay autenticacion' });
});

router.get('/dato/:codigo', async (req, res) => {
    let login = getLogin(req);
    let codigoCatalogo = req.params.codigo;
    if (login.auth) {
        let result = await obtenerDatoCatalogo(login.user, login.password, codigoCatalogo);
        // console.log(result);
        res.json(result);
    }
    res.json({ message: 'no hay autenticacion' });
});

router.post('/insertar', async (req, res) => {
    let login = getLogin(req);
    let catalogo = req.body;
    console.log('Controller ', catalogo);
    if (login.auth) {
        let result = await insertarCatalogo(login.user, login.password, catalogo);
        res.json(result);
    }

    res.json({ message: 'no hay autenticacion' });
})

router.post('/insertar-dato', async (req, res) => {
    let login = getLogin(req);
    let dato = req.body;
    console.log('Controller ', dato);
    if (login.auth) {
        let result = await insertarDatoCatalogo(login.user, login.password, dato);
        res.json(result);
    }

    res.json({ message: 'no hay autenticacion' });
});

router.get('/puntos', async (req, res) => {
    let login = getLogin(req);
    if (login.auth) {
        let result = await obtenerPuntosAtencion(login.user, login.password);
        
        res.json(result);
    }
    res.json({ message: 'no hay autenticacion' });
});


module.exports = router;
