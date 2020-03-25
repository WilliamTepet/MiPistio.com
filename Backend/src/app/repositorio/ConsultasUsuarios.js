const Usuario = require('../dto/Usuario');
const Catalogo = require('../dto/Catalogo');
const pool = require('../../config').pool;

const getUsuarios = async () => {
    try {
        const result = await pool.query('SELECT * FROM mipistio_catalogo.cat_usuarios');
        return result.rows;
    } catch (e) {
        console.log(e);
    }
    
}

/*const getCuiEmailUsuario = async (pCui, pEmail) => {
    try {
        const result = await pool.query(`select cui, email from mipistio_catalogo.cat_usuarios 
                                        where cui = '${pCui}' or email = '${pEmail}'`);
        return result.rows;
    } catch (e) {
        console.log(e);
        console.error('Usuairo no encontrado en la DB',e);
    }
    
}*/

const getCuiEmailUsuario = async (pCui, pEmail) => {
    try {
        const result = await pool.query(`select PA.nombre, CU.id_usuario from mipistio_catalogo.cat_punto_atencion 
        PA join mipistio_catalogo.cat_usuario_punto_atencion CPA on CPA.cod_punto_atencion = PA.id_punto_atencion 
        join mipistio_catalogo.cat_usuarios CU on CU.id_usuario = CPA.cod_usuario 
        where cui = '${pCui}' or email = '${pEmail}';`);
        return result.rows;

    } catch (e) {
        console.log(e);
        console.error('Usuairo no encontrado en la DB',e);
    }
    
}

const insertUsuarios = async (pUsuario) => {
    console.log('Consultas Usuario ', pUsuario);
    try {
        let usuario = new Usuario();
        usuario = pUsuario;
        const query = `insert into mipistio_catalogo.cat_usuarios values 
            (nextval('s_id_usuario'),'${usuario.cui}','${usuario.nombre}','${usuario.email}',${usuario.estado},${usuario.cod_cargo},${usuario.cod_rol},
            '${usuario.usuario_agrega}','${usuario.usuario_modifica}','${usuario.fecha_ingreso}','${usuario.fecha_modifica}','${usuario.ip_agrega}',
            '${usuario.ip_modifica}','${usuario.password}');
            insert into mipistio_catalogo.cat_usuario_punto_atencion values (nextval('s_usuario_p_atencion'),
            (select currval ('s_id_usuario')),${usuario.codigo});`;

        console.log('Query ', query);
        const result = await pool.query(query);
        return result;
    } catch (e) {
        console.log(e);
    }
}


const updateUsuario = async (pId, pUsuario) => {
    console.log('Actualizando Usuario...', pId);
    try {
        let usuario = new Usuario();
        let usuarioId = new Usuario();
        usuario = pUsuario;
        const result = await pool.query(`update mipistio_catalogo.cat_usuarios
        set cui = '${usuario.cui}', nombre = '${usuario.nombre}', email='${usuario.email}', estado = ${usuario.estado}, 
        cod_rol = ${usuario.cod_rol}, cod_cargo = ${usuario.cod_cargo}, usuario_modifica = '${usuario.usuario_modifica}', fecha_modifica = 
        '${usuario.fecha_modifica}', ip_modifica = '${usuario.ip_modifica}', password = '${usuario.password}'
        where id_usuario = '${pId}';`);
        return result.rows;
    } catch (e) {
        console.log(e);
        console.error('Usuairo no encontrado en la DB',e);
    }
    
}



module.exports = { getUsuarios, insertUsuarios, getCuiEmailUsuario, updateUsuario };