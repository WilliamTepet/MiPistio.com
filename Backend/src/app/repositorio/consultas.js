const Catalogo = require('../dto/Catalogo');
const Dato = require('../dto/Dato');
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

const insertDatoCatalogo = async (pDatoCatalogo) => {
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



module.exports = { getCatalogos, getCatalogo, getDatoCatalogo, insertCatalogo, getUsuario, insertDatoCatalogo, getPuntoAtencion };