class Dato {
    idPuntoAtencion;
    nombre;
    region;
    descripcion;
    estado;
    usuarioAgrega;
    usuarioModifica;
    fechaIngreso;
    fechaModifica;
    ipAgrega;
    ipModifica;

    constructor(idPuntoAtencion){
        this.idPuntoAtencion = idPuntoAtencion;
    }
    
}

module.exports = Dato;