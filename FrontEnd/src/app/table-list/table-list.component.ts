import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { PuntoAtencion } from '../modelos/PuntoAtencionModelo';
import { environment } from '../../environments/environment';

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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  constructor(private servicio: ServicioService) { 
    this.puntoAtencionForm = new FormGroup({
      regionPunto: new FormControl('', Validators.required),
      nombrePuntoAtencion: new FormControl('', Validators.required)
    });

    this.puntoAtencionActualizacionForm = new FormGroup({
      nombrePuntoAtencion: new FormControl({ value: '' }, Validators.required),
      estadoPunto: new FormControl({ value: '' }, Validators.required)
    });

    /* this.reactiveForm = new FormGroup({
      recaptchaReactive: new FormControl(null, Validators.required)
    }); */
  }

  siteKey: string = environment.site_key;

  displayedColumns: string[] = ['id', 'region', 'nombre', 'estado', 'acciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  punto: any = {
    nombre: '',
    region: '',
    estado: ''
  };

  puntoUpdate: PuntoAtencion;

  puntosAtencion: any[] = [];

  regiones: any = [
    { codigo: 1, nombre: 'Central' },
    { codigo: 2, nombre: 'Sur' },
    { codigo: 3, nombre: 'Occidente' },
    { codigo: 4, nombre: 'Nororiente' }
  ];

  estados: ESTADO[] = [
    { id: 1, nombre: 'activo' },
    { id: 2, nombre: 'inactivo' }
  ];

  puntoAtencionForm: FormGroup;
  puntoAtencionActualizacionForm: FormGroup;
  // reactiveForm: FormGroup;
  ip: string;

  catalogos: any = [];

  async ngOnInit() {

    this.puntosAtencion = [];

    /* this.regiones = await this.getDatos(1);
    console.log('Regiones ', this.regiones); */
    this.servicio.getIp()
      .subscribe(res => {
        this.ip = res.ip;
      }, err => console.log('Hubo un error al obtener la ip ', err));
    
    await this.servicio.getPuntos().toPromise().then(res => {
      res.forEach(element => {
        let punto = { id: element.id_punto_atencion, nombre: element.nombre, region: element.region, estado: element.estado };
        this.puntosAtencion.push(punto);
      });
      console.log('Puntos de atencion ', this.puntosAtencion);
      this.dataSource = new MatTableDataSource(this.puntosAtencion);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

    await this.servicio.postPuntoAtencion(dato).toPromise().then(res => {
      console.log(res.status);
      if (res.status) {
        Swal.fire(`Se guardaron correctamente los datos del punto de atención ${nuevoPunto.id} - ${nuevoPunto.nombre}`);

        this.puntosAtencion.push(nuevoPunto);
        this.dataSource = new MatTableDataSource(this.puntosAtencion);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
    // console.log(this.regiones.find(e => e.codigo === codigo));
    let nombre = this.regiones.find(e => e.codigo === codigo).nombre
    return nombre;
  }

  public getEstado(id: number): string {
    let estado = this.estados.find(e => e.id === id).nombre;
    return estado;
  }

  public editar(punto: any, i: number): void {
    console.log(punto);
    this.puntoAtencionActualizacionForm.get('nombrePuntoAtencion').setValue(punto.nombre);
    this.puntoAtencionActualizacionForm.get('estadoPunto').setValue(punto.estado);
    this.punto = punto;
    this.punto.index = i;
    console.log(this.puntoAtencionActualizacionForm.value);
    console.log(this.punto);
  }

  public actualizarPunto() {
    console.log('Punto ', this.puntoAtencionActualizacionForm.value);
    console.log('Actualizar!');
    let enviando = Swal
    enviando.fire('Enviando...');
    let dato = {
      id: this.punto.id,
      nombre: this.puntoAtencionActualizacionForm.get('nombrePuntoAtencion').value,
      estado: this.puntoAtencionActualizacionForm.get('estadoPunto').value,
      usuarioModifica: sessionStorage.getItem('username'),
      fechaModifica: moment().format('YYYY-MM-DD hh:mm:ss A Z'),
      ipModifica: this.ip
    }
    console.log(dato);

    this.servicio.updatePunto(dato)
      .subscribe(res => {
        if(res.status === 1) {
          enviando.close();
          this.puntosAtencion[this.punto.index].nombre = dato.nombre;
          this.puntosAtencion[this.punto.index].estado = dato.estado;
          Swal.fire('Datos actualizados');
        } else if (res.status === 2) {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar!',
            text: res.message
          })
        }
      }, e => {
        enviando.close();
        Swal.fire({
          icon: 'error',
          title: 'Error en el servidor!',
          text: 'No se pudo enviar la información'
        })
        console.log('Ocurrio un error ', e);
      })
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  

}
