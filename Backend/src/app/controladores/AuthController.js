const router = require('express').Router();
const { verificarAuthUsuario } = require('../servicios/UsuarioServicio');
const request = require('request-promise');
const config = require('../../config').config;

router.post('/login', async (req, res) => {
    console.log('Autenticando..')
    let login = req.body;
    const result = await verificarAuthUsuario(login.usuario, login.password);
    res.json(result);
});

router.post('/token_validate', (req, res) => {
    let token = req.body.recaptcha;
    let secret = config.secretKey;
 
    const options = {
        method: 'POST',
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        form: {
            secret: secret,
            response: token,
            remoteip: req.connection.remoteAddress
        },
        headers: {
            'content-type': 'application/x-www-form-urlencodend',
            'Accept': '*/*'
        },
        json: true
    }

    if (token === null || token === undefined) {
        res.status(201).send({ success: false, message: 'El token está vacio o es invalido' })
        return console.log('Token invalido')
    }

    request(options)
        .then(body => {
            console.log('Respuesta ', body);
            if (body.success) {
                res.status(200).json({ success: body.success, message: 'recaptcha valido' })
            } else {
                res.status(200).json({ success: body.success, message: 'recaptcha invalido' })
            }
        }).catch(err => {
            console.log('Ocurrio un error al consultar el token ', err);
        })
})
module.exports = router;