const { getEmpleado } = require('../repositorio/ConsultasEmpleados');

async function obtenerEmpleado () {
    console.log('Obteniendo listado de empleados... ');
    const result = await getEmpleado();
    return result;
};



module.exports = { obtenerEmpleado };