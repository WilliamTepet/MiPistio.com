const router = require('express').Router();
const path = require("path");
const multer = require("multer");

const { obtenerUsuarios,  insertarUsuarios, verificarCargoUsuario, verificarUsuario, actualizarUsuarios, 
    verificarRolUsuario, agregarPtoUsuario, verificarCatUsuario, verificarIdCatUsuario, 
    verificarCargoUsuarioId, verificarCui, verificarEmail } = require('../servicios/UsuarioServicio');
const { getLogin } = require('../servicios/CatalogosServicio');
const { verificarRolByEmail } = require('../servicios/UsuarioServicio');
const { insertarQuejas, ultimaQueja, obtenerQueja } = require('../servicios/QuejaServicio');
const { enviarCorreo } = require('../servicios/EnvioCorreos');

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
    if (!file.originalname.match(/\.(pdf|doc|docx|jpg|png)$/)) {
      return cb(new Error("Error en el tipo de archivo."));
    }
    cb(null, true);
  },
});


router.post('/agregar', async (req, res) => {
    //let login = await verificarRolByEmail(req); 
    let datos = req.body;
    let status, resultado, ultQueja, respuesta;
    //if (login.auth && login.rolReceptor) {
        //resultado = await insertarQuejas(datos, login.nom_usuario, login.id_usuario);
        resultado = await insertarQuejas(datos, datos.usuarioAgrega, datos.id_usuario);
        ultQueja = await ultimaQueja();
        respuesta = {mensaje: "La queja número " + ultQueja.codQueja + ", ha sido ingresada exitosamente al sistema de control de quejas", status: "ok"};
        status = 200;
        
    //} else {
    //    status = 401;
    //    mensaje = "No tiene autorizacion";
    //}
    res.status(status).json(respuesta);
});


router.get('', async (req, res) => {
    //let login = await verificarRolByEmail(req); 
    let status, resultado;
    resultado = await obtenerQueja();
    status = 200;
    /*if (login.auth && login.rolReceptor) {
        resultado = await obtenerQueja();
        status = 200;
    } else {
        status = 401;
        resultado = { message: 'No tiene autorizacion' };
    }*/
    res.status(status).json(resultado);
});

// Agregar queja desde portal
router.post('/agregar-portal', upload.single('archivo'), async (req, res) => {
    console.log("Request: ", req.body);
    console.log("Nombre archivo ", nombreArchivo);

    //let login = await verificarRolByEmail(req); 
    let datos = req.body;
    datos.archivo = nombreArchivo;
    let status, resultado, ultQueja, respuesta;
    //if (login.auth && login.rolReceptor) {
    //resultado = await insertarQuejas(datos, login.nom_usuario, login.id_usuario);
    resultado = await insertarQuejas(datos, datos.usuarioAgrega, datos.id_usuario);
    ultQueja = await ultimaQueja();
    respuesta = { mensaje: "La queja número " + ultQueja.codQueja + ", ha sido ingresada exitosamente al sistema de control de quejas", status: "ok" };
    status = 200;
    await enviarCorreo(datos.email, ultQueja.codQueja);
    //} else {
    //    status = 401;
    //    mensaje = "No tiene autorizacion";
    //}
    res.status(status).json(respuesta);
});
                                                                               


module.exports = router;