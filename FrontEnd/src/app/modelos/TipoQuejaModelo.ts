export class TipoQuejaModelo {

    constructor(codigo: number, nombre: string, descripcion: string, estado: number) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
    }

    public codigo: number;
    public nombre: string;
    public descripcion: string;
    public estado: number;
}