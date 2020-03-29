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


const getCuiEmailUsuario = async (pCui, pEmail) => {
    try {
        const result = await pool.query(`select PA.nombre, CU.id_usuario, CPA.cod_cargo, CPA.cod_punto_atencion, CU.email, CU.cui
        from mipistio_catalogo.cat_punto_atencion 
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
            (nextval('s_id_usuario'),'${usuario.cui}','${usuario.nombre}','${usuario.email}',${usuario.estado},${usuario.cod_rol},
            '${usuario.usuario_agrega}','${usuario.usuario_modifica}','${usuario.fecha_ingreso}','${usuario.fecha_modifica}','${usuario.ip_agrega}',
            '${usuario.ip_modifica}','${usuario.password}');
            insert into mipistio_catalogo.cat_usuario_punto_atencion values (nextval('s_usuario_p_atencion'),
            (select currval ('s_id_usuario')),${usuario.codigo},${usuario.cod_cargo});`;

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
        cod_rol = ${usuario.cod_rol}, usuario_modifica = '${usuario.usuario_modifica}', fecha_modifica = 
        '${usuario.fecha_modifica}', ip_modifica = '${usuario.ip_modifica}', password = '${usuario.password}'
        where id_usuario = '${pId}';
        update mipistio_catalogo.cat_usuario_punto_atencion set cod_cargo = ${usuario.cod_cargo}
        where cod_usuario = '${pId}' and cod_punto_atencion = '${usuario.codigo}';`);



        return result.rows;
    } catch (e) {
        console.log(e);
        console.error('Usuairo no encontrado en la DB',e);
    }
    
}


const addPtoUsuario = async (pId, pUsuario) => {
    console.log('Agregando punto de atención a usuario...', pId);
    try {
        let usuario = new Usuario();
        usuario = pUsuario;
        const result = await pool.query(`insert into mipistio_catalogo.cat_usuario_punto_atencion 
        values (nextval('s_usuario_p_atencion'),'${pId}','${usuario.codigo}','${usuario.cod_cargo}');`);

        return result.rows;
    } catch (e) {
        console.log(e);
        console.error('Usuairo no encontrado en la DB',e);
    }
    
}

const getUserExistente = async (pCui, pCatalogo) => {
    console.log('Verificando si usuario ya existe en catalogo...', pCatalogo);
    try {
        const result = await pool.query(`select CU.id_usuario, PA.nombre
        from mipistio_catalogo.cat_punto_atencion PA
        join mipistio_catalogo.cat_usuario_punto_atencion CPA on CPA.cod_punto_atencion = PA.id_punto_atencion
        join mipistio_catalogo.cat_usuarios CU on CU.id_usuario = CPA.cod_usuario
        where cui = '${pCui}' and CPA.cod_punto_atencion = '${pCatalogo}';`);

        return result.rows;
    } catch (e) {
        console.log(e);
        console.error('Usuairo no encontrado en la DB',e);
    }
    
}

const getCargoJefe = async (pCui) => {
    console.log('Verificando si usuario tiene cargo no jefe...', pCui);
    try {
        const result = await pool.query(`select CU.id_usuario, PA.nombre
        from mipistio_catalogo.cat_punto_atencion PA
        join mipistio_catalogo.cat_usuario_punto_atencion CPA on CPA.cod_punto_atencion = PA.id_punto_atencion
        join mipistio_catalogo.cat_usuarios CU on CU.id_usuario = CPA.cod_usuario
        where cui = '${pCui}' and CPA.cod_cargo < 11;`);

        return result.rows;
    } catch (e) {
        console.log(e);
        console.error('Usuario no encontrado en la DB',e);
    }
    
}

const getIdUser = async (pId) => {
    console.log('Veficando ID de Usuario...', pId);
    try {
        const result = await pool.query(`select nombre, cui 
        from mipistio_catalogo.cat_usuarios
        where id_usuario = ${pId};`);

        return result.rows;
    } catch (e) {
        console.log(e);
        console.error('Usuario no encontrado en la DB',e);
    }
    
}


module.exports = { getUsuarios, insertUsuarios, getCuiEmailUsuario, updateUsuario, addPtoUsuario, getUserExistente, getCargoJefe, getIdUser };