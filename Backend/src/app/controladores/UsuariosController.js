const router = require('express').Router();
const { obtenerUsuarios,  insertarUsuarios, verificarCargoUsuario, verificarUsuario, actualizarUsuarios, 
    verificarRolUsuario, agregarPtoUsuario, verificarCatUsuario, verificarIdUsuario } = require('../servicios/UsuarioServicio');
const { getLogin } = require('../servicios/CatalogosServicio');


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
        /*if (((usuario.usuarioExiste && !usuario.cargoJefe) && (datos.cod_cargo != 11)) || 
            ((usuario.usuarioExiste && usuario.cargoJefe) && (datos.cod_cargo != 11 && usuario.cont >=1))
            ){
            userExiste = true;
            //console.log('validando si rol jefe no existe', usuarioExiste);
        }*/
        if (usuario.usuarioExiste){
            const cargo = await verificarCargoUsuario (datos.cui);
            if (cargo.cargoNoJefe && datos.cod_cargo != 11){
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
                        res.json({message: 'Se guardaron correctamente los datos del usuario para el punto de atención'});
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
    if (login.auth) {
        const usuario =  await verificarUsuario(datos.cui, datos.email);
        const rol = await verificarRolUsuario(login.user, login.password);
        //console.log ('rol admin en controlador', rol.rolAdmin);
        const id = await verificarIdUsuario(usuarioId)
        if (!usuario.usuarioExiste && rol.rolAdmin && id.userId) {
            let updateUser = await actualizarUsuarios(usuarioId, datos);
            res.json({message: 'Datos actualizados'});
            } 
        else {
            if((usuario.usuarioExiste && rol.rolAdmin) && (usuarioId == usuario.idUser)){
                let updateUser = await actualizarUsuarios(usuarioId, datos)
                res.json({message: 'Datos actualizados 2'});
            }
            else{ 
                if(usuario.usuarioExiste && (usuarioId != usuario.idUser)){
                    res.json({ message: 'Error, verifique la informacion del usuario'});
                }
                else{
                    res.json({ message: 'Error, verifique la informacion del usuario'});
                }
            }
        }
    }
    else {
        res.json ({message: 'Error, Usuario no Autenticado'});
    }
    
});

module.exports = router;