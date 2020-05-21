const router = require('express').Router();
const { verificarRolByEmail } = require('../servicios/UsuarioServicio');
const { insertarQuejas, ultimaQueja, obtenerQueja } = require('../servicios/QuejaServicio');


router.post('/agregar', async (req, res) => {
    //let login = await verificarRolByEmail(req); 
    let datos = req.body;
    let status, resultado, ultQueja, respuesta;
    //if (login.auth && login.rolReceptor) {
        //resultado = await insertarQuejas(datos, login.nom_usuario, login.id_usuario);
        resultado = await insertarQuejas(datos, datos.usuarioAgrega, datos.id_usuario);
        ultQueja = await ultimaQueja();
        respuesta = {mensaje: "La queja número " + ultQueja.codQueja + ", ha sido ingresada exitosamente al sistema de control de quejas", status: "ok"};
        status = 200;
        
    //} else {
    //    status = 401;
    //    mensaje = "No tiene autorizacion";
    //}
    res.status(status).json(respuesta);
});


router.get('', async (req, res) => {
    //let login = await verificarRolByEmail(req); 
    let status, resultado;
    resultado = await obtenerQueja();
    status = 200;
    /*if (login.auth && login.rolReceptor) {
        resultado = await obtenerQueja();
        status = 200;
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }*/
    res.status(status).json(resultado);
});

module.exports = router;