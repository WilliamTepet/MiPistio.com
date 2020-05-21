const router = require('express').Router();
const { obtenerUsuarios,  insertarUsuarios, verificarCargoUsuario, verificarUsuario, actualizarUsuarios, 
    verificarRolUsuario, agregarPtoUsuario, verificarCatUsuario, verificarIdCatUsuario, 
    verificarCargoUsuarioId, verificarCui, verificarEmail } = require('../servicios/UsuarioServicio');
const { getLogin } = require('../servicios/CatalogosServicio');
const cod_rol_jefe = 22; //codigo del rol de jefe


router.get('/listado', async (req, res) => {
    let login = await getLogin(req);
    let status, resultado;
    if (login.auth) {
        resultado = await obtenerUsuarios();
        status = 200;
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }
    res.status(status).json(resultado);
});

router.post('/agregar', async (req, res)=>{
    let login = await getLogin(req);
    let datos = req.body;
    if (login.auth) {
        const usuario =  await verificarUsuario(datos.cui, datos.email);
        const rol = await verificarRolUsuario(login.user, login.password);
        console.log ('validar codigo', datos.codigo, usuario.usuarioExiste, usuario.cargoJefe);
        userExiste = false;
        if (usuario.usuarioExiste){
            const cargo = await verificarCargoUsuario (datos.cui);
            console.log ('obteniendo cargo',cargo.cargoNoJefe);
            if (cargo.cargoNoJefe && datos.cod_cargo != cod_rol_jefe){
                userExiste = true;
            }
        }
        console.log('usuarioo', userExiste, rol.rolAdmin, usuario.codPtoActual);
        if (!userExiste && rol.rolAdmin){
            const usuarioCat = await verificarCatUsuario (datos.cui, datos.codigo);
            console.log ('catalogo usuario ', usuarioCat.userCatalogo);
            if (/*(datos.cod_cargo == 11 && */(usuario.codPtoActual >=1 && !usuarioCat.userCatalogo)
                && (usuario.email == datos.email) && (usuario.cui == datos.cui)){
            /*(datos.codigo != usuario.codPtoActual)){*/
                let agregarPtoAten = await agregarPtoUsuario(usuario.idUser, datos);
                res.json({message: 'Se guardaron correctamente los datos del usuario para el punto de atención 2'});
            }
            else{
                if ((usuario.codPtoActual >=1 && usuarioCat.userCatalogo) && 
                    (usuario.email == datos.email) && (usuario.cui == datos.cui))/*(datos.cod_cargo == 11 && (datos.codigo == usuario.codPtoActual ))*/{
                res.json({message: 'El usuario ya existe en este punto'});
                }
                else {
                    if((usuario.codPtoActual >=1 && usuarioCat.userCatalogo) &&
                        ((usuario.email != datos.email) || (usuario.cui != datos.cui))){
                        res.json({message: 'Error, verifique la información del usuario'});
                    }
                    else{
                        let postUser = await insertarUsuarios(datos);
                        res.json({message: 'Se guardaron correctamente los datos del usuario para el punto de atención v2'});
                    }
                }
            }
        }
        else{
            if(userExiste){
                ptoAtencion = usuario.ptoAtencion;
                res.json({ message: 'Error al guardar el usuario'}); 
            }
            else {
                res.json({ message: 'Error privilegios insuficientes'}); 
            }    
        }
    }
    else{
        res.json ({message: 'Error, Usuario no Autenticado'});
    }
});


router.put('/actualizar/:id', async (req, res)=>{
    let login = await getLogin(req);
    let datos = req.body;
    let usuarioId = req.params.id;
    const rol = await verificarRolUsuario(login.user, login.password);
    if (login.auth && rol.rolAdmin) {
        const ptoAtencion = await verificarIdCatUsuario(usuarioId, datos.puntoAtencion);
        if(ptoAtencion.userIdCat){
            const cargo = await verificarCargoUsuarioId(usuarioId);
            const cuiUsuario =  await verificarCui(datos.cui);
            const emailUsuario = await verificarEmail(datos.email);
            valCargo = false;
            //validacion para condiciones de actualización de cargo
            if (cargo.cargoNoJefe && datos.cod_cargo != cod_rol_jefe && (datos.puntoAtencion != cargo.codPtoAtencion)){
                    valCargo = true;
            }
            console.log('actualizandoo', valCargo, cargoNoJefe, cuiUsuario.userId, emailUsuario.userId);
            //validaciones email y cui
            if (cuiUsuario.userId == usuarioId && emailUsuario.userId == usuarioId){
                if (!valCargo){
                    let updateUser = await actualizarUsuarios(usuarioId, datos);
                    // res.json({message: 'Datos actualizados'});
                    res.status(200).json(updateUser);
                }
                else {
                    res.status(401).json({message: 'Error de validacion de cargo'});
                }
            } 
            else {
                if (cuiUsuario.userId == 0 && emailUsuario.userId == 0){
                    if (!valCargo){
                        let updateUser = await actualizarUsuarios(usuarioId, datos);
                        // res.json({message: 'Datos actualizados'});
                        res.status(200).json(updateUser);
                    }
                    else {
                        res.status(401).json({message: 'Error de validacion de cargo'});
                    }
                }
                else{
                    if (cuiUsuario.userId == 0 && emailUsuario.userId == usuarioId){
                        if (!valCargo){
                            let updateUser = await actualizarUsuarios(usuarioId, datos);
                            // res.json({message: 'Datos actualizados'});
                            res.status(200).json(updateUser);
                        }
                        else {
                            res.status(401).json({message: 'Error de validacion de cargo'});
                        }
                    }
                    else{
                        if (cuiUsuario.userId == usuarioId && emailUsuario.userId == 0){
                            if (!valCargo){
                                let updateUser = await actualizarUsuarios(usuarioId, datos);
                                // res.json({message: 'Datos actualizados'});
                                res.status(200).json(updateUser);
                            }
                            else {
                                res.status(401).json({message: 'Error de validacion de cargo'});
                            }
                        }
                        else {
                            res.status(401).json({ message: 'Error, verifique la informacion del usuario'});
                        }
                    }
                }
            }
        }
        else{
            res.status(401).json({ message: 'Error, verifique la informacion del usuario'});
        }
    }
    else{
        res.status(401).json ({message: 'Usuario no Autenticado o Priviliegios insuficientes'});
    }
    
});

module.exports = router;