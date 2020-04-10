const Catalogo = require('../dto/Catalogo');
const Dato = require('../dto/Dato');
const DatoCatalogo = require('../dto/DatoCatalogo');
const pool = require('../../config').pool;


const getCatalogos = async () => {
    try {
        const result = await pool.query('SELECT * FROM mipistio_catalogo.catalogo');
        return result.rows;
    } catch (e) {
        console.log(e);
    }
    
}

const getCatalogo = async (codCatalogo) => {
    try {
        const result = await pool.query(`SELECT * FROM mipistio_catalogo.catalogo where codigo = ${codCatalogo}`);
        return result.rows;
    } catch (e) {
        console.log(e);
    }
    
}

const getDatoCatalogo = async (codCatalogo) => {
    try {
        console.log('codigo del catalogo ', codCatalogo);
        const result = await pool.query(`SELECT * FROM mipistio_catalogo.catalogo_dato where codigo_catalogo = ${codCatalogo}`);
        return result.rows;
    } catch (e) {
        console.log(e);
    }
    
}

const getPuntoAtencion = async () => {
    try {
        const result = await pool.query(`SELECT * FROM mipistio_catalogo.cat_punto_atencion`);
        return result.rows;
    } catch (e) {
        console.log(e);
    }
    
}

const updatePuntoAtencion = async (punto) => {
    try {
        await pool.query(`UPDATE mipistio_catalogo.cat_punto_atencion 
                                        SET estado = ${punto.estado}, nombre = '${punto.nombre}',
                                        usuario_modifica = '${punto.usuarioModifica}', fecha_modifica = '${punto.fechaModifica}',
                                        ip_modifica = '${punto.ipModifica}'
                                        WHERE id_punto_atencion = ${punto.id}`);
        return { status:1, message: 'punto actualizado' };
    } catch (e) {
        console.log(e)
        return [];
    }
}

const getUsuario = async (pUsuario, pPassword) => {
    try {
        const result = await pool.query(`SELECT * FROM mipistio_catalogo.cat_usuarios 
        where nombre = '${pUsuario}' and password = '${pPassword}' and cod_rol = 5`);
        return result.rows;
    } catch (e) {
        console.error('Error al consultar el usuario ', e);
        return [];
    }
}

const getUsuariosByPuntoAtencion = async (punto) => {
    try {
        const result = await pool.query(`SELECT COUNT(*) as puntos
                                            FROM mipistio_catalogo.cat_usuario_punto_atencion 
                                            WHERE cod_punto_atencion = ${punto}`);
        return result.rows[0];
    } catch (e) {
        console.error('Ocurrio un error ', e);
        return [];
    }
}

const insertCatalogo = async (pCatalogo) => {
    console.log('Consultas ', pCatalogo);
    try {
        let catalogo = new Catalogo();
        catalogo = pCatalogo
        const query = `INSERT INTO mipistio_catalogo.catalogo 
                    VALUES (nextval('s_catalogo'), ${catalogo.codigoCatPadre}, '${catalogo.nombre}', 
                            '${catalogo.descripcion}', ${catalogo.estado}, '${catalogo.usuarioAgrega}', 
                            '${catalogo.usuarioModifica}', '${catalogo.fechaIngreso}', '${catalogo.fechaModifica}', 
                            '${catalogo.ipAgrega}', '${catalogo.ipModifica}');`;
        console.log('Query ', query);
        const result = await pool.query(query);
        return result;
    } catch (e) {
        console.log(e);
        return { message: 'no se pudo insertar el catalogo' };
    }
}

const insertarPunto = async (pDatoCatalogo) => {
    console.log('Consultas ', pDatoCatalogo);
    try {
        let dato = new Dato();
        dato = pDatoCatalogo
        const query = `INSERT INTO mipistio_catalogo.cat_punto_atencion 
                    VALUES (nextval('s_cat_punto_atencion'), '${dato.nombre}', ${dato.region}, 
                            ${dato.estado}, '${dato.usuarioAgrega}', 
                            '${dato.usuarioModifica}', '${dato.fechaIngreso}', '${dato.fechaModifica}', 
                            '${dato.ipAgrega}', '${dato.ipModifica}', '${dato.descripcion}');`;
        console.log('Query ', query);
        const result = await pool.query(query);
        return result;
    } catch (e) {
        console.log(e);
        return { message: 'no se pudo insertar el dato' };
    }
}

const insertarDatoCatalogo = async (pDatoCatalogo) => {
    console.log('Consultas ', pDatoCatalogo);
    try {
        let dato = new DatoCatalogo();
        dato = pDatoCatalogo
        const query = `INSERT INTO mipistio_catalogo.catalogo_dato
                    VALUES (nextval('s_id_catalogo_dato'), ${dato.codigoCatalogo}, '${dato.nombre}', 
                            ${dato.estado}, '${dato.descripcion}', '${dato.usuarioAgrega}', 
                            '${dato.usuarioModifica}', '${dato.fechaIngreso}', '${dato.fechaModifica}', 
                            '${dato.ipAgrega}', '${dato.ipModifica}');`;
        console.log('Query ', query);
        const result = await pool.query(query);
        return result;
    } catch (e) {
        console.log(e);
        return { message: 'no se pudo insertar el dato al catalogo' };
    }
}

const updateDatoCatalogo= async (dato) => {
    try {
        const resultado = await pool.query(`UPDATE mipistio_catalogo.catalogo_dato
                                        SET estado = ${dato.estado}, descripcion = '${dato.descripcion}',
                                        usuario_modifica = '${dato.usuarioModifica}', fecha_modifica = '${dato.fechaModifica}',
                                        ip_modifica = '${dato.ipModifica}'
                                        WHERE codigo_catalogo = ${dato.codigoCatalogo} and codigo = ${dato.codigo}`);
        console.log('Resultado del update ', resultado)
        return resultado;
    } catch (e) {
        console.log(e)
        return [];
    }
}



module.exports = { 
    getCatalogos,
    getCatalogo,
    getDatoCatalogo,
    insertCatalogo,
    getUsuario,
    insertarPunto,
    getPuntoAtencion,
    getUsuariosByPuntoAtencion,
    updatePuntoAtencion,
    insertarDatoCatalogo,
    updateDatoCatalogo
};