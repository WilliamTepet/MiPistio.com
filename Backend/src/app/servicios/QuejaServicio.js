const { insertQueja, getLastQueja, getQueja, updateQueja } = require('../repositorio/ConsultasQuejas');

//verifica password y usuario correcto para login
async function insertarQuejas(pQueja,pUsername,pId) {
    console.log('Creando Queja... ', pQueja);
    const result = await insertQueja(pQueja,pUsername,pId);
    return result;
};


async function ultimaQueja () {
    console.log('Obteniendo ultima queja agregada... ');
    const result = await getLastQueja();
    codQueja = result[0].codigo;
    idQueja = result[0].id_queja;
    return {codQueja, idQueja};
};

async function obtenerQueja () {
    console.log('Obteniendo listado de quejas... ');
    const result = await getQueja();
    return result;
};


async function actualizarQueja(id, queja) {
    const result = await updateQueja(id, queja);
    //return { message: 'usuario ingresado correctamente' };
    return result;

};


module.exports = { insertarQuejas, ultimaQueja, obtenerQueja, actualizarQueja };