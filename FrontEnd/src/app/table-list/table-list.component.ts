import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PuntoAtencion } from '../modelos/PuntoAtencionModelo';

import * as $ from 'jquery';
import * as moment from 'moment';
import 'datatables.net';
import 'datatables.net-bs4';
import { ServicioService } from 'app/servicios/servicio.service';

declare interface REGION {
  id: number;
  nombre: string;
}

declare interface ESTADO {
  id: number;
  nombre: string;
}

declare interface DATO {
  nombre: string;
  region: string;
  descripcion: string;
  estado: number;
  usuarioAgrega: string;
  usuarioModifica: string;
  fechaIngreso: string;
  fechaModifica: string;
  ipAgrega: string;
  ipModifica: string;
}

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  // @ViewChild('dataTable', {static: true}) table: ElementRef;
  dataTable: any;
  punto: any = {
    nombre: '',
    region: '',
    estado: ''
  };
  puntoUpdate: PuntoAtencion;

  constructor(private servicio: ServicioService) { 
    this.puntoAtencionForm = new FormGroup({
      regionPunto: new FormControl('', Validators.required),
      nombrePuntoAtencion: new FormControl('', Validators.required)
    });

    this.puntoAtencionActualizacionForm = new FormGroup({
      regionPunto: new FormControl({value: '', disabled: true}, Validators.required),
      nombrePuntoAtencion: new FormControl({ value: '' }, Validators.required),
      estadoPunto: new FormControl({ value: '' }, Validators.required)
    });
  }

  puntosAtencion: any[] = [
    
  ];

  regiones: any = [];

  estados: ESTADO[] = [
    { id: 1, nombre: 'activo' },
    { id: 2, nombre: 'inactivo' }
  ];

  puntoAtencionForm: FormGroup;
  puntoAtencionActualizacionForm: FormGroup;
  ip: string;

  catalogos: any = [];

  async ngOnInit() {
    // $.noConflict();
    this.regiones = await this.getDatos(1);
    this.servicio.getIp()
      .subscribe(res => {
        this.ip = res.ip;
      }, err => console.log('Hubo un error al obtener la ip ', err));
    
    await this.servicio.getPuntos().toPromise().then(res => {
      this.puntosAtencion = res;
    }).catch(e => console.log('Ocurrio un error ', e))

  }

  public async getDatos(codigo: number): Promise<any> {
    const result = await this.servicio.getDatoCatalogo(codigo).toPromise();
    return result;
  }

  public async guardarPunto() {
    console.log('Click');
    console.log(this.puntoAtencionForm.value);
    let nuevoPunto: PuntoAtencion = new PuntoAtencion(
      this.puntosAtencion.length + 1,
      this.puntoAtencionForm.value.regionPunto,
      this.puntoAtencionForm.value.nombrePuntoAtencion
    );

    let dato: DATO = {
      nombre: this.puntoAtencionForm.value.nombrePuntoAtencion,
      region: this.puntoAtencionForm.value.regionPunto,
      descripcion: '',
      estado: 1,
      usuarioAgrega: sessionStorage.getItem('username'),
      usuarioModifica: '',
      fechaIngreso: moment().format('YYYY-MM-DD hh:mm:ss A Z'),
      fechaModifica: moment().format('YYYY-MM-DD hh:mm:ss A Z'),
      ipAgrega: this.ip,
      ipModifica: this.ip
    }

    await this.servicio.postDatoCatalogo(dato).toPromise().then(res => {
      if (res.status) {
        Swal.fire(`Se guardaron correctamente los datos del punto de atención ${nuevoPunto.id} - ${nuevoPunto.nombre}`);

        this.puntosAtencion.push(nuevoPunto);
      }
    })
      .catch(err => {
        console.log('Ocurrio un error');
        Swal.fire({
          icon: 'error',
          title: 'Error al insertar!',
          text: 'No se pudo guardar el punto de atención'
        })
      })

    console.log(nuevoPunto);
    console.log('Dato ', dato)
  }
  public getRegion(codigo: any): string {
    // console.log('codigos de regiones ', codigo);
    // console.log(this.regiones.find(e => e.codigo === codigo));
    let nombre = this.regiones.find(e => e.codigo === codigo).nombre
    return nombre;
  }

  public getEstado(id: number): string {
    let estado = this.estados.find(e => e.id === id).nombre;
    return estado;
  }

  public editar(punto: PuntoAtencion): void {
    console.log(punto);
    this.puntoAtencionActualizacionForm.setValue(
      { regionPunto: punto.region, nombrePuntoAtencion: punto.nombre, estadoPunto: punto.estado }
    );
    this.punto = punto;
    console.log(this.puntoAtencionActualizacionForm.value);
  }

  public actualizarPunto() {
    console.log('Actualizar!');
  }

}
