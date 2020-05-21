class Queja {
    id_queja;
    codigo;
    nombre_cliente;
    email;
    telefono;
    punto_atencion;
    nombre_empleado;
    descripcion;
    estado_externo;
    estado_interno;
    ingreso_queja;
    cod_forma_ingreso;
    tipo_queja;
    archivo;
    fecha_ingreso;
    fecha_modifica;
    usuario_agrega;
    usuario_modifica;
    respuesta;

    constructor(id_queja){
        this.id_queja = id_queja;
    }
    
}

module.exports = Queja;