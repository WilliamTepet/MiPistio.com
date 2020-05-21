const Empleado = require('../dto/Empleado');
const pool = require('../../config').pool;

const getEmpleado = async () => { //Query para listar empleados
    try {
        const query = `select nombre, cui, cod_empleado, estado
        from mipistio_catalogo.cat_empleados;`;
        const result = await pool.query(query);
        return result.rows;
    } catch (e) {
        console.log(e);
    }

}

module.exports = { getEmpleado };