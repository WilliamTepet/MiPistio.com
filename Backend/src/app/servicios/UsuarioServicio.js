const { getUsuario } = require('../repositorio/consultas');

async function verificarUsuario(pUsuario, pPassword) {
    const user = await getUsuario(pUsuario, pPassword);
    console.log('usuario ', user);
    if (user.length == 1) {
        return { usuario: user[0].nombre, password: user[0].password };
    }

    return { message: 'usuario no existe' };
}

module.exports = { verificarUsuario };