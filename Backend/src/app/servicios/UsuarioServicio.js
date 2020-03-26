const { getUsuario } = require('../repositorio/consultas');
const { getUsuarios, insertUsuarios, getCuiEmailUsuario, updateUsuario, addPtoUsuario } = require('../repositorio/ConsultasUsuarios');

//verifica password y usuario correcto para login
async function verificarAuthUsuario(pUsuario, pPassword) {
    const user = await getUsuario(pUsuario, pPassword);
    console.log('usuario ', user);
    if (user.length == 1) {
        return { usuario: user[0].nombre, password: user[0].password };
    }

    return { message: 'usuario no existe' };
}

async function verificarRolUsuario(pUsuario, pPassword) {
    const user = await getUsuario(pUsuario, pPassword);
    console.log(user);
    if (user.length === 1) {
        rolAdmin = true;
        //console.log('rol',rolAdmin);
        return {rolAdmin};
       
    }
    else{
        rolAdmin = false;
        console.log('rol',rolAdmin);
        return { message: 'Privilegios insuficientes',rolAdmin};
    }
}


//verifica si el cui o email ya existe en BDD
async function verificarUsuario(pCui, pEmail) {
    const user = await getCuiEmailUsuario(pCui, pEmail);
    //console.log('filas de DB para usuario', user);
    //console.log('id ', user[0].id_usuario);
    if (user.length >= 1) {
        usuarioExiste=true;
        ptoAtencion = user[0].nombre;
        idUser = user[0].id_usuario;
        //console.log(ptoAtencion);
        for (i = 0; i<user.length; i++){
            rolActual = user[i].cod_cargo;
            if (rolActual != 11){
                cargoJefe = false;
                
                cont = 0;
                cont = cont + 1;
                //console.log('busqueda de rol ', cargoJefe, cont);
            }
            
            else{
                codPtoActual = user[i].cod_punto_atencion;
                cargoJefe = true;
                //console.log('busqueda de rol ', cargoJefe);
            }
            
        }
        return {usuarioExiste,idUser,ptoAtencion, cargoJefe, cont,codPtoActual, message:'CUI o Email Duplicados... ',};    
    }
    usuarioExiste = false;
    return {usuarioExiste, message: 'CUI o Email no existe' };
}

async function obtenerUsuarios(){
    const result = await getUsuarios();
    return result;

}

async function insertarUsuarios(usuario) {
        console.log('Creando Usuario... ', usuario);
        const result = await insertUsuarios(usuario);
        //return { message: 'usuario ingresado correctamente' };
        return result;
    return {message:'El CUI o Email ingresados ya existen, verifique'};

};

async function actualizarUsuarios(id, usuario) {
    const result = await updateUsuario(id, usuario);
    //return { message: 'usuario ingresado correctamente' };
    return result;

};

async function agregarPtoUsuario(id, usuario) {
    const result = await addPtoUsuario(id, usuario);
    //return { message: 'usuario ingresado correctamente' };
    return result;

};


module.exports = { verificarAuthUsuario, verificarRolUsuario, obtenerUsuarios, insertarUsuarios, verificarUsuario, actualizarUsuarios,agregarPtoUsuario };