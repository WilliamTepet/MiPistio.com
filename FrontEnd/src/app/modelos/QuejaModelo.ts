export class Queja {

    constructor(codigo: number, nombre: string, email: string, telefono: number, puntoAtencion: String, nombre_empleado:string,
        descripcion:string, cod_medio_ingreso:number, tipo_queja?:string, cod_tipo_queja?: number, cod_estado_externo?:number, cod_estado_interno?:number, 
        cod_tipo_ingreso?:number, archivo?:string, respuesta?: string) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.puntoAtencion = puntoAtencion;
        this.nombre_empleado = nombre_empleado;
        this.descripcion = descripcion;
        this.tipo_queja = tipo_queja;
        this.cod_medio_ingreso = cod_medio_ingreso;
        this.cod_tipo_queja = cod_tipo_queja;
        this.cod_estado_externo = cod_estado_externo;
        this.cod_estado_interno = cod_estado_interno;
        this.cod_tipo_ingreso = cod_tipo_ingreso;
        this.archivo = archivo;
        this.respuesta = respuesta;

    }

    public codigo: number;
    public nombre: string;
    public email: string;
    public telefono: number;
    public puntoAtencion: String;
    public nombre_empleado:string;
    public descripcion:string;
    public tipo_queja:string;
    public cod_medio_ingreso:number;
    public cod_tipo_queja: number;
    public cod_estado_externo:number;
    public cod_estado_interno:number; 
    public cod_tipo_ingreso:number;
    public archivo:string;
    public respuesta:string;

}