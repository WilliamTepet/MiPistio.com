const router = require('express').Router();
const { obtenerUsuarios, insertarUsuarios, verificarUsuario, actualizarUsuarios, verificarRolUsuario, agregarPtoUsuario } = require('../servicios/UsuarioServicio');
const { getLogin } = require('../servicios/CatalogosServicio');


router.get('/listado', async (req, res) => {
    let getUser = await obtenerUsuarios();
    console.log(getUser);
    res.json(getUser);
});

router.post('/agregar', async (req, res)=>{
    let login = getLogin(req);
    let datos = req.body;
    if (login.auth) {
        const usuario =  await verificarUsuario(datos.cui, datos.email);
        const rol = await verificarRolUsuario(login.user, login.password);
        //console.log ('rol jefe en en controlador', usuario.cargoJefe, usuario.usuarioExiste);
        userExiste = false;
        if (((usuario.usuarioExiste && !usuario.cargoJefe) && (datos.cod_cargo != 11)) || 
            ((usuario.usuarioExiste && usuario.cargoJefe) && (datos.cod_cargo != 11 && usuario.cont >=1))
            ){
            userExiste = true;
            //console.log('validando si rol jefe no existe', usuarioExiste);
        }
        console.log('usuarioooooooo', userExiste);
        if (!userExiste && rol.rolAdmin){
            if (datos.cod_cargo == 11 &&(datos.codigo != usuario.codPtoActual )){
                let agregarPtoAten = await agregarPtoUsuario(usuario.idUser, datos);
                res.json({message: 'Se guardaron correctamente los datos del usuario para el punto de atención'});
            }
            else
                if (datos.cod_cargo == 11 &&(datos.codigo == usuario.codPtoActual )){
                res.json({message: 'El usuario ya tiene asignado el rol para este punto'});
            }
                else{
                    let postUser = await insertarUsuarios(datos);
                    res.json({message: 'Se guardaron correctamente los datos del usuario para el punto de atención'});
                }
        }
        else{
            if(userExiste){
                ptoAtencion = usuario.ptoAtencion;
                res.json({ message: 'Error el usuario ya existe en el punto de atención', ptoAtencion}); 
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
    let login = getLogin(req);
    let datos = req.body;
    let usuarioId = req.params.id;  
    if (login.auth) {
        const usuario =  await verificarUsuario(datos.cui, datos.email);
        const rol = await verificarRolUsuario(login.user, login.password);
        //console.log ('rol admin en controlador', rol.rolAdmin);
        if (!usuario.usuarioExiste && rol.rolAdmin){
            let updateUser = await actualizarUsuarios(usuarioId, datos);
            res.json({message: 'Datos actualizados'});
            } 
        else {
            if((usuario.usuarioExiste && rol.rolAdmin) && (usuarioId == usuario.idUser)){
                let updateUser = await actualizarUsuarios(usuarioId, datos)
                res.json({message: 'Datos actualizados'});
            }
            else{// (usuario.usuarioExiste && (usuarioId != usuario.idUser)){
                res.json({ message: 'Error al guardar los datos, el CUI o Email ya existen'});
            }
        }
    }
    else {
        res.json ({message: 'Error, Usuario no Autenticado'});
    }
    
});

module.exports = router;