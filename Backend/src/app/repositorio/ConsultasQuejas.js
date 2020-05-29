const Usuario = require('../dto/Usuario');
const Queja = require('../dto/Catalogo');
const pool = require('../../config').pool;

const insertQueja = async (pQueja, pUsername, pId) => { //Query para agregar quejas
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

const getLastQueja = async () => { //Query para obtener última queja agregada
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


const getQueja= async () => { //Query para listar todas las quejas creadas
    try {
        const query = `select Q.codigo, Q.nombre_cliente, Q.email, Q.telefono, Q.punto_atencion, Q.nombre_empleado, Q.descripcion, Q.usuario_agrega,
        Q.fecha_ingreso, Q.fecha_modifica, QD.cod_estado_externo, QD.cod_estado_interno, QD.cod_medio_ingreso, QD.cod_tipo_ingreso
        from mipistio_catalogo.queja Q
        join mipistio_catalogo.queja_dato QD on QD.cod_queja = Q.id_queja
        join mipistio_catalogo.queja_usuario QU on QU.cod_queja = Q.id_queja`;
        const result = await pool.query(query);
        return result.rows;
    } catch (e) {
        console.log(e);
    }

}


module.exports = { insertQueja, getLastQueja, getQueja };