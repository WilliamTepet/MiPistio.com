const router = require('express').Router();
const { verificarUsuario } = require('../servicios/UsuarioServicio');

router.post('/login', async (req, res) => {
    console.log('Autenticando..')
    let login = req.body;
    const result = await verificarUsuario(login.usuario, login.password);
    res.json(result);
});

module.exports = router;