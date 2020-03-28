const router = require('express').Router();
const { obtenerUsuarios, insertarUsuarios, verificarCargoUsuario, verificarUsuario, actualizarUsuarios, verificarRolUsuario, agregarPtoUsuario, verificarCatUsuario } = require('../servicios/UsuarioServicio');
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
        console.log ('validar codigo', datos.codigo, usuario.usuarioExiste, usuario.cargoJefe, usuario.cont);
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
            if (/*(datos.cod_cargo == 11 && */usuario.codPtoActual >=1 && !usuarioCat.userCatalogo){
            /*(datos.codigo != usuario.codPtoActual)){*/
                let agregarPtoAten = await agregarPtoUsuario(usuario.idUser, datos);
                res.json({message: 'Se guardaron correctamente los datos del usuario para el punto de atención'});
            }
            else{
                if (usuario.codPtoActual >=1 && usuarioCat.userCatalogo)/*(datos.cod_cargo == 11 && (datos.codigo == usuario.codPtoActual ))*/{
                res.json({message: 'El usuario ya existe en este punto'});
                }
                else{
                    let postUser = await insertarUsuarios(datos);
                    res.json({message: 'Se guardaron correctamente los datos del usuario para el punto de atención'});
                }
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
                res.json({message: 'Datos actualizados 2'});
            }
            else{ 
                if(usuario.usuarioExiste && (usuarioId != usuario.idUser)){
                res.json({ message: 'Error al guardar los datos, el CUI o Email ya existen'});
                }
            }
        }
    }
    else {
        res.json ({message: 'Error, Usuario no Autenticado'});
    }
    
});

module.exports = router;