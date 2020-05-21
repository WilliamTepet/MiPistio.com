export class UsuarioModelo {

    constructor(codigo: number, cui: number, nombre: string, estado: number){
        this.codigo = codigo;
        this.cui = cui;
        this.nombre = nombre;
        this.estado = estado;
    }

    codigo: number;
    cui: number;
    nombre: string;
    estado: number;
}