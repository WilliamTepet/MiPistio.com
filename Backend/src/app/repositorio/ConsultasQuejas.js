const Usuario = require('../dto/Usuario');
const Queja = require('../dto/Catalogo');
const pool = require('../../config').pool;


//Query para agregar quejas
const insertQueja = async (pQueja, pUsername, pId) => { 
    //var today = new Date();
    //anio = today.getFullYear();
    //var fecha = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    //var hora = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //var fechaHora = fecha+' '+hora;
    /*let tipo_queja = 'QMS';
    let cod_tipo_queja = 31;
    let cod_estado_externo = 34;
    let cod_estado_interno = 36;
    let cod_tipo_ingreso = 38;
    let respuesta = 'Ingresada exitosamente su queja';*/
    try {
        let queja = new Queja();
        queja = pQueja;
        let nom_user_agrega = pUsername;
        let id_user_agrega = pId;
        const query = `insert into mipistio_catalogo.queja values (nextval('s_id_queja'),
        concat('${queja.tipo_queja}-', cast(nextval('s_cod_queja') as varchar),'-${queja.anio}'),'${queja.nombre_cliente}',
        '${queja.email}',${queja.telefono},'${queja.punto_atencion}','${queja.nombre_empleado}','${queja.descripcion}',
        '${queja.archivo}','${queja.fechaIngreso}', '${queja.fechaModifica}','${nom_user_agrega}','${nom_user_agrega}','${queja.respuesta}');
        insert into mipistio_catalogo.queja_dato values (nextval('s_id_dato_queja'), (select currval ('s_cod_queja')),
        ${queja.cod_tipo_queja},${queja.cod_estado_externo},${queja.cod_estado_interno},${queja.cod_tipo_ingreso},${queja.cod_medio_ingreso});
        insert into mipistio_catalogo.queja_usuario values (nextval('s_usuario_queja'),(select currval ('s_cod_queja')),${id_user_agrega});`;
        //console.log('Query ', query);
        const result = await pool.query(query);
        return result;
    } catch (e) {
        console.log(e);
    }

}


//Query para obtener última queja agregada
const getLastQueja = async () => { 
    try {
        const query = `select id_queja, codigo from mipistio_catalogo.queja
        order by id_queja desc
        limit 1;`;
        const result = await pool.query(query);
        return result.rows;
    } catch (e) {
        console.log(e);
    }

}

//Query para listar todas las quejas creadas
const getQueja= async () => {
    try {
        const query = `select Q.id_queja, Q.codigo, Q.nombre_cliente, Q.email, Q.telefono, Q.punto_atencion, Q.nombre_empleado, Q.descripcion, Q.usuario_agrega,
        QD.cod_estado_externo, QD.cod_estado_interno, QD.cod_medio_ingreso, QD.cod_tipo_ingreso
        from mipistio_catalogo.queja Q
        join mipistio_catalogo.queja_dato QD on QD.cod_queja = Q.id_queja
        join mipistio_catalogo.queja_usuario QU on QU.cod_queja = Q.id_queja`;
        const result = await pool.query(query);
        return result.rows;
    } catch (e) {
        console.log(e);
    }

}

//Query para actualizar quejas
const updateQueja = async (pId, pQueja) => { 
    console.log('Actualizando Queja...', pId);
    try {
        let queja = new Usuario();
        queja = pQueja;
        const result = await pool.query(`update mipistio_catalogo.queja
            set nombre_cliente = '${queja.nombre_cliente}', email = '${queja.email}', 
            telefono = ${queja.telefono}, punto_atencion = '${queja.punto_atencion}', 
            nombre_empleado = '${queja.nombre_empleado}', descripcion = '${queja.descripcion}', 
            archivo = '${queja.archivo}', fecha_modifica = '${queja.fecha_modifica}', usuario_modifica = '${queja.usuario_modifica}'
                where id_queja = ${pId};
            update mipistio_catalogo.queja_dato
            set cod_estado_externo = ${queja.cod_estado_externo}, 
            cod_estado_interno = ${queja.cod_estado_interno}, cod_tipo_ingreso = ${queja.cod_tipo_ingreso}, cod_medio_ingreso = ${queja.cod_medio_ingreso}
                where cod_queja = ${pId};`
        );
        return { status:1, message: 'actualizado queja' };
    } catch (e) {
        console.log(e);
        console.error('Usuario no encontrado en la DB',e);
        return [];
    }
    
}



module.exports = { insertQueja, getLastQueja, getQueja, updateQueja };