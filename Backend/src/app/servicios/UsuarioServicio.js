const decode = require('atob');
const { getUsuario } = require('../repositorio/consultas');
const { getUsuarios, insertUsuarios, getCuiEmailUsuario, updateUsuario, getIdCatUser, 
        getCargoJefe, addPtoUsuario, getUserExistente, getCargoActual,
        getCui, getEmail, cod_cargo_jefe, cod_cargo_sup, cod_cargo_centr, cod_cargo_encar,
        cod_cargo_recep,cod_cargo_tit, cod_cargo_admin, getRolByEmail} = require('../repositorio/ConsultasUsuarios');  

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
    console.log('filas de DB para GetEmail', user);
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
            if (rolActual != cod_cargo_jefe){
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


async function verificarIdCatUsuario (pId, pCatalogo) {
    const idCat = await getIdCatUser(pId, pCatalogo);
    //console.log('filas de DB para usuario', cat);
    if (idCat.length >= 1) {
        userIdCat = true;
    }
    else{
        userIdCat = false;
    }

    return {userIdCat};
}

async function verificarCargoUsuarioId (pId) {
    const getCargo = await getCargoActual(pId);
    //console.log('filas de DB para usuario', getCargo);
    if (getCargo.length >= 1) {
        cargoNoJefe = true;
    }
    else{
        cargoNoJefe = false;
        codPtoAtencion = 0;
    }
    console.log ('codigo punto atencion no jefe', codPtoAtencion);
    return {cargoNoJefe, codPtoAtencion};
    
}


async function verificarRolByEmail (req) { 
    let headers = req.headers;
    // console.log('Headers: ', headers);
    if (headers.authorization) {
        auth = decode(headers.authorization.split(" ")[1]);
        auth = auth.split(':');
        let login = { user: auth[0], password: auth[1]};
        console.log ('usuario y clave ',login.user, login.password);
        if (login.user == '' || login.password == ''){
            return {auth: false};
        }
        else{   
            const getRol = await getRolByEmail(login.user, login.password);
            if (getRol.length >= 1) {
                auth = true; //variable para determinar que el usuario si se autentico
                nom_usuario = getRol[0].nombre;
                id_usuario = getRol[0].id_usuario;
                rolAdministrador = false, rolReceptor = false, rolCentralizador = false;
                for (i = 0; i<getRol.length; i++){
                    rolActual = getRol[i].cod_rol;
                    switch (rolActual){
                        case cod_cargo_admin:
                            rolAdministrador = true;
                            break;
                        case cod_cargo_centr:
                            rolCentralizador = true;
                            break;
                        case cod_cargo_recep:
                            rolReceptor = true;
                            break;
                    }
                }
            }
            else{
                rolAdministrador = false, rolReceptor = false, 
                rolCentralizador = false, auth = false, nom_usuario = '', id_usuario=0;
            }
        }
        
    }
    else{
        rolAdministrador = false, rolReceptor = false, rolCentralizador = false;
    }
    return {rolAdministrador, rolCentralizador, rolReceptor, auth, nom_usuario, id_usuario};
    
}



async function verificarCui (pCui) {
    const cui = await getCui(pCui);
    //console.log('filas de DB para usuario', cui);
    if (cui.length >= 1) {
        userId = cui[0].id_usuario;
    }
    else{
        userId= 0;
    }
    return {userId};
}


async function verificarEmail (pEmail) {
    const email = await getEmail(pEmail);
    //console.log('filas de DB para usuario', email);
    if (email.length >= 1) {
        userId = email[0].id_usuario;
    }
    else{
        userId = 0;
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
                    verificarCatUsuario, verificarCargoUsuario, verificarIdCatUsuario,
                    verificarCargoUsuarioId, verificarEmail, verificarCui, verificarRolByEmail};