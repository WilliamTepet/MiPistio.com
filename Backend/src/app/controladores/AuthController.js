const router = require('express').Router();
const { verificarAuthUsuario } = require('../servicios/UsuarioServicio');

router.post('/login', async (req, res) => {
    console.log('Autenticando..')
    let login = req.body;
    const result = await verificarAuthUsuario(login.usuario, login.password);
    res.json(result);
});

module.exports = router;