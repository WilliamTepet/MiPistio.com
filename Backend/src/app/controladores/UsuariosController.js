const router = require('express').Router();
const { obtenerUsuarios, insertarUsuarios, verificarUsuario, actualizarUsuarios } = require('../servicios/UsuarioServicio');


router.get('/listado', async (req, res) => {
    let getUser = await obtenerUsuarios();
    console.log(getUser);
    res.json(getUser);
});

router.post('/agregar', async (req, res)=>{
    let datos = req.body;
    const usuario =  await verificarUsuario(datos.cui, datos.email);
    if (!usuario.usuarioExiste){
        console.log('Controller ', datos);
        let postUser = await insertarUsuarios(datos);
        res.json({message: 'Se guardaron correctamente los datos del usuario para el punto de atención'});
       /* ptoAtencion = usuario.ptoAtencion;
        console.log(ptoAtencion);*/
    }
    else{
        ptoAtencion = usuario.ptoAtencion;
        res.json({ message: 'Error al guardar los datos, el usuario ya existe en el punto de atención', ptoAtencion});
    }
});


router.put('/actualizar/:id', async (req, res)=>{
    let datos = req.body;
    let usuarioId = req.params.id;
    const usuario =  await verificarUsuario(datos.cui, datos.email);
    console.log ('validando si cui o email existe', datos.cui, datos.email, usuario.idUser);  
    if (!usuario.usuarioExiste){
        let updateUser = await actualizarUsuarios(usuarioId, datos);
        console.log('Controller ', datos);
        res.json({message: 'Datos actualizados'});
        } 
    if(usuario.usuarioExiste && (usuarioId == usuario.idUser)){
        let updateUser = await actualizarUsuarios(usuarioId, datos)
        console.log('Controller ', datos);
        res.json({message: 'Datos actualizados'});
        }
    if (usuario.usuarioExiste && (usuarioId != usuario.idUser)){
        res.json({ message: 'Error al guardar los datos, el CUI o Email ya existen'});
    }

});

module.exports = router;