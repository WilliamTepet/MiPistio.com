const router = require('express').Router();
const { obtenerEmpleado } = require('../servicios/EmpleadoServicio');


router.get('', async (req, res) => {
    //let login = await verificarRolByEmail(req); 
    let status, resultado;
    resultado = await obtenerEmpleado();
    status = 200;
    /*if (login.auth) {
        resultado = await obtenerEmpleado();
        status = 200;
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }*/
    res.status(status).json(resultado);
});

module.exports = router;