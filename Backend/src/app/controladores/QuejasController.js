const router = require('express').Router();
const path = require("path");
const multer = require("multer");

const { obtenerUsuarios,  insertarUsuarios, verificarCargoUsuario, verificarUsuario, actualizarUsuarios, 
    verificarRolUsuario, agregarPtoUsuario, verificarCatUsuario, verificarIdCatUsuario, 
    verificarCargoUsuarioId, verificarCui, verificarEmail } = require('../servicios/UsuarioServicio');
const { getLogin } = require('../servicios/CatalogosServicio');

var nombreArchivo = '';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/public/uploads"));
  },
  filename: function (req, file, cb) {
    nombreArchivo = Date.now() + path.extname(file.originalname);
    cb(null, nombreArchivo); //Appending extension
  },
});
var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc|docx|jpg)$/)) {
      return cb(new Error("Error en el tipo de archivo."));
    }
    cb(null, true);
  },
});


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

// Agregar queja desde portal
router.post('/agregar-portal', upload.single('archivo'), async (req, res) => {
    console.log("Request: ", req.body);
    console.log('Nombre archivo ', nombreArchivo);
    res.json({ message: 'ok' });
});

router.put('/actualizar/:id', async (req, res)=>{
    let login = await getLogin(req);
    let datos = req.body;
    let usuarioId = req.params.id;
    const rol = await verificarRolUsuario(login.user, login.password);
    if (login.auth && rol.rolAdmin) {
        const ptoAtencion = await verificarIdCatUsuario(usuarioId, datos.codigo);
        if(ptoAtencion.userIdCat){
            const cargo = await verificarCargoUsuarioId(usuarioId);
            const cuiUsuario =  await verificarCui(datos.cui);
            const emailUsuario = await verificarEmail(datos.email);
            valCargo = false;
            //validacion para condiciones de actualización de cargo
            if (cargo.cargoNoJefe && datos.cod_cargo != 11 && (datos.codigo != cargo.codPtoAtencion)){
                    valCargo = true;
            }
            console.log('actualizandoo', valCargo, cargoNoJefe, cuiUsuario.userId, emailUsuario.userId);
            //validaciones email y cui
            if (cuiUsuario.userId == usuarioId && emailUsuario.userId == usuarioId){
                if (!valCargo){
                    let updateUser = await actualizarUsuarios(usuarioId, datos);
                    res.json({message: 'Datos actualizados'});
                }
                else {
                    res.json({message: 'Error de validacion de cargo'});
                }
            } 
            else {
                if (cuiUsuario.userId == 0 && emailUsuario.userId == 0){
                    if (!valCargo){
                        let updateUser = await actualizarUsuarios(usuarioId, datos);
                        res.json({message: 'Datos actualizados'});
                    }
                    else {
                        res.json({message: 'Error de validacion de cargo'});
                    }
                }
                else{
                    if (cuiUsuario.userId == 0 && emailUsuario.userId == usuarioId){
                        if (!valCargo){
                            let updateUser = await actualizarUsuarios(usuarioId, datos);
                            res.json({message: 'Datos actualizados'});
                        }
                        else {
                            res.json({message: 'Error de validacion de cargo'});
                        }
                    }
                    else{
                        if (cuiUsuario.userId == usuarioId && emailUsuario.userId == 0){
                            if (!valCargo){
                                let updateUser = await actualizarUsuarios(usuarioId, datos);
                                res.json({message: 'Datos actualizados'});
                            }
                            else {
                                res.json({message: 'Error de validacion de cargo'});
                            }
                        }
                        else {
                            res.json({ message: 'Error, verifique la informacion del usuario'});
                        }
                    }
                }
            }
        }
        else{
            res.json({ message: 'Error, verifique la informacion del usuario'});
        }
    }
    else{
        res.json ({message: 'Usuario no Autenticado o Priviliegios insuficientes'});
    }
    
});

module.exports = router;