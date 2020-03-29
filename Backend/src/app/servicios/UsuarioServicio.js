const { getUsuario } = require('../repositorio/consultas');
const { getUsuarios, insertUsuarios, getCuiEmailUsuario, updateUsuario, getIdUser, getCargoJefe, addPtoUsuario, getUserExistente} = require('../repositorio/ConsultasUsuarios');

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
    console.log('filas de DB para usuario', user);
    //console.log('id ', user[0].id_usuario);
    if (user.length >= 1) {
        usuarioExiste=true;
        ptoAtencion = user[0].nombre;
        idUser = user[0].id_usuario;
        email = user[0].email;
        cui = user[0].cui;
        //console.log(ptoAtencion);
        for (i = 0; i<user.length; i++){
            rolActual = user[i].cod_cargo;
            if (rolActual != 11){
                cargoJefe = false;
                codPtoActual = user[i].cod_punto_atencion;
                console.log('busqueda de rol ', cargoJefe);
            }
            
            else{
                codPtoActual = user[i].cod_punto_atencion;
                cargoJefe = true;
                //console.log('busqueda de rol ', cargoJefe);
            }
            
        }
        return {usuarioExiste,idUser,cui,ptoAtencion,email,cargoJefe, codPtoActual, message:'CUI o Email Duplicados... ',};    
    }
    usuarioExiste = false;
    catCodigo = false;
    codPtoActual = 0;
    return {usuarioExiste, codPtoActual, message: 'CUI o Email no existe' };
}


async function verificarCatUsuario (pCui, pCatalogo) {
    const cat = await getUserExistente(pCui, pCatalogo);
    //console.log('filas de DB para usuario', cat);
    if (cat.length >= 1) {
        userCatalogo = true;
    }
    else{
        userCatalogo = false;
    }

    return {userCatalogo};
}


async function verificarCargoUsuario (pCui) {
    const cargo = await getCargoJefe(pCui);
    //console.log('filas de DB para usuario', cat);
    if (cargo.length >= 1) {
        cargoNoJefe = true;
    }
    else{
        cargoNoJefe = false;
    }

    return {cargoNoJefe};
}


async function verificarIdUsuario (pId) {
    const id = await getIdUser(pId);
    //console.log('filas de DB para usuario', cat);
    if (id.length >= 1) {
        userId = true;
    }
    else{
        userId = false;
    }

    return {userId};
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


module.exports = { verificarAuthUsuario, verificarRolUsuario, obtenerUsuarios, 
                    insertarUsuarios, verificarUsuario, actualizarUsuarios,agregarPtoUsuario, 
                    verificarCatUsuario, verificarCargoUsuario, verificarIdUsuario };