export class PuntoAtencion {

    constructor(id: number, region: number, nombre: string, estado?: number) {
      this.id = id;
      this.region = region;
      this.nombre = nombre;
      this.estado = estado || 1;
    }
  
    id: number;
    region: number;
    nombre: string;
    estado: number;
  }

