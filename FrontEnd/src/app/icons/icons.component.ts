import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { TipoQuejaModelo } from '../modelos/TipoQuejaModelo';

import * as moment from 'moment';
import { ServicioService } from 'app/servicios/servicio.service';
import { element } from 'protractor';

declare interface REGION {
  id: number;
  nombre: string;
}


declare interface ESTADO {
  id: number;
  nombre: string;
}

declare interface DATOCATALOGO {
  codigoCatalogo: number;
  nombre: string;
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
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {

  constructor(private servicio: ServicioService) { 
    this.tipoQuejaForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
    });

    this.tipoQuejaActualizacionForm = new FormGroup({
      descripcion: new FormControl({ value: '' }, Validators.required),
      estadoTipoQueja: new FormControl({ value: '' }, Validators.required)
    });
  }

  displayedColumns: string[] = ['codigo', 'nombre', 'descripcion', 'estado', 'acciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  estados: ESTADO[] = [
    { id: 1, nombre: 'activo' },
    { id: 2, nombre: 'inactivo' }
  ];

  tipoQuejaForm: FormGroup;
  tipoQuejaActualizacionForm: FormGroup;
  ip: string;

  tiposQuejas: any[] = [];
  listaTiposQuejas: any[] = [];
  codigoCatalogo: number = 36;

  tipoQueja: any = {
    codigo: '',
    nombre: '',
    descripcion: '',
    estado: '',
    index: ''
  };

  async ngOnInit() {
    this.listaTiposQuejas = [];
    this.tiposQuejas = await this.getDatos(36);
    console.log('Tipos de queja ', this.tiposQuejas);
    this.tiposQuejas.forEach(element => {
      let tipoQueja = { codigo: element.codigo, nombre: element.nombre, descripcion: element.descripcion, estado: element.estado };
      this.listaTiposQuejas.push(tipoQueja);
    });

    this.dataSource = new MatTableDataSource(this.listaTiposQuejas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.servicio.getIp()
      .subscribe(res => {
        this.ip = res.ip;
      }, err => console.log('Hubo un error al obtener la ip ', err));

  }

  public async getDatos(codigo: number): Promise<any> {
    const result = await this.servicio.getDatoCatalogo(codigo).toPromise().catch(err => {
      console.error('Ocurrio un error, ', err);
      Swal.fire({
        icon: 'error',
        title: 'Error al obtener!',
        text: 'No se pudo obtener el catalogo'
      })
    });
    return result;
  }

  public async guardarTipoQueja() {
    console.log('Click');
    console.log(this.tipoQuejaForm.value);
    let coincide: boolean = this.listaTiposQuejas.some(e => e.nombre.split('-')[0] === this.tipoQuejaForm.value.nombre.toUpperCase());
    
    if (coincide) {
      console.log('Existe ', coincide);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar el tipo de queja!',
        text: 'Las siglas para la queja que ingresó, yafueron registradas previamente en el sistema, verifique.'
      });
      return;
    }

    let year = moment().year();
    let nuevoTipoQueja: TipoQuejaModelo = new TipoQuejaModelo(
      this.listaTiposQuejas[this.listaTiposQuejas.length - 1].codigo + 1,
      `${this.tipoQuejaForm.value.nombre.toUpperCase()}-${this.listaTiposQuejas.length + 1 }-${year}`,
      this.tipoQuejaForm.value.descripcion,
      1
    );
    
    let dato: DATOCATALOGO = {
      codigoCatalogo: this.codigoCatalogo,
      nombre: `${nuevoTipoQueja.nombre}-${this.listaTiposQuejas.length + 1 }-${year}`,
      descripcion: nuevoTipoQueja.descripcion,
      estado: nuevoTipoQueja.estado,
      usuarioAgrega: sessionStorage.getItem('username'),
      usuarioModifica: '',
      fechaIngreso: moment().format('YYYY-MM-DD hh:mm:ss A Z'),
      fechaModifica: moment().format('YYYY-MM-DD hh:mm:ss A Z'),
      ipAgrega: this.ip,
      ipModifica: this.ip
    }

    console.log(nuevoTipoQueja);
    console.log('Dato ', dato)

    Swal.fire({
      title: '¿Está seguro de que desea guardar el tipo de queja ingresada?',
      text: "¡El tipo de queja será guardado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.servicio.postDatoCatalogo(dato).subscribe(res => {
          if (res.status) {
            Swal.fire(`El tipo de queja ${nuevoTipoQueja.nombre} - ${nuevoTipoQueja.descripcion}`);
    
            this.listaTiposQuejas.push(nuevoTipoQueja);
            this.dataSource = new MatTableDataSource(this.listaTiposQuejas);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        }, err => {
            console.log('Ocurrio un error ', err);
            Swal.fire({
              icon: 'error',
              title: 'Error al insertar!',
              text: 'No se pudo el tipo de queja'
            })
          })
      }
    })

  }

  public getEstado(id: number): string {
    let estado = this.estados.find(e => e.id === id).nombre;
    return estado;
  }

  public editar(tipoQueja: any, i: number): void {
    console.log(tipoQueja);
    this.tipoQuejaActualizacionForm.get('descripcion').setValue(tipoQueja.descripcion);
    this.tipoQuejaActualizacionForm.get('estadoTipoQueja').setValue(tipoQueja.estado);
    this.tipoQueja = tipoQueja;
    this.tipoQueja.index = i;
    console.log(this.tipoQuejaActualizacionForm.value);
    console.log(this.tipoQueja);
  }

  public actualizarTipoQueja() {
    console.log('Tipo de queja ', this.tipoQuejaActualizacionForm.value);
    console.log('Actualizar!');
    let enviando = Swal
    enviando.fire('Enviando...');
    let dato = {
      codigo: this.tipoQueja.codigo,
      codigoCatalogo: this.codigoCatalogo,
      nombre: this.tipoQueja.nombre,
      descripcion: this.tipoQuejaActualizacionForm.get('descripcion').value,
      estado: this.tipoQuejaActualizacionForm.get('estadoTipoQueja').value,
      usuarioModifica: sessionStorage.getItem('username'),
      fechaModifica: moment().format('YYYY-MM-DD hh:mm:ss A Z'),
      ipModifica: this.ip
    }
    console.log(dato);

    Swal.fire({
      title: '¿Está seguro de guardar los cambios realizados?',
      text: "¡El tipo de queja será modificado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.servicio.updateDatoCatalogo(dato)
          .subscribe(res => {
            if(res.status === 1) {
              enviando.close();
              this.listaTiposQuejas[this.tipoQueja.index].descripcion = dato.descripcion;
              this.listaTiposQuejas[this.tipoQueja.index].estado = dato.estado;
              Swal.fire('Datos actualizados');
            } else if (res.status === 2 || res.status === 3) {
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
