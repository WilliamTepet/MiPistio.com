class Catalogo {
    codigo;
    codigoCatPadre;
    nombre;
    descripcion;
    estado;
    usuarioAgrega;
    usuarioModifica;
    fechaIngreso;
    fechaModifica;
    ipAgrega;
    ipModifica;

    constructor(codigo){
        this.codigo = codigo;
    }
    
}

module.exports = Catalogo;