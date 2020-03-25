class Usuario {
    id_usuario;
    cargo;
    cui;
    nombre;
    email;
    estado;
    cod_cargo;
    cod_rol;
    usuario_agrega;
    usuario_modifica;
    fecha_ingreso;
    fecha_modifica;
    ip_agrega;
    ip_modifica;
    password;

    constructor(id_usuario){
        this.id_usuario = id_usuario;
    }
    
}

module.exports = Usuario;