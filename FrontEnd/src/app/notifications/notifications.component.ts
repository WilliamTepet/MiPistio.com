import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator/';
import { MatTableDataSource } from '@angular/material/table/';
import * as moment from 'moment';
import { ServicioService } from 'app/servicios/servicio.service';
import { dateChangeValidator } from 'app/utils/utils.interface';
import { GenericService } from './../servicios/generic.service';


declare var $: any;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  
  searchForm: FormGroup;
  tipoReporte: string = 'Reporte de quejas por mal servicio o servicio no conforme';
  showRepo = false;
  showRepoFail = false;
  displayedColumns: string[] = [
    'numqueja',
    'tipoqueja',
    'puntoatencion',
    'estado',
    'etapa',
    'resultado',
    'medioingreso',
    'fechacreacion',
    'tiempoatencion',
    'detalle'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  filtered: boolean;

  showReporte = false;


  fechaDesde = new FormControl(moment(), Validators.required);
  fechaHasta = new FormControl(moment(), Validators.required);
  maxFecha = new Date();
  minFecha = new Date(2000, 0, 1);

  quejas: any[] = [];
  puntosAtencion: any = [];
  regiones: any = [
    { codigo: 1, nombre: 'Central' },
    { codigo: 2, nombre: 'Sur' },
    { codigo: 3, nombre: 'Occidente' },
    { codigo: 4, nombre: 'Nororiente' }
  ];
  medios_ingreso: any = [
    { codigo: 26, nombre: 'Telefono' },
    { codigo: 27, nombre: 'Correo' },
    { codigo: 28, nombre: 'Chat' },
    { codigo: 29, nombre: 'Presencial' },
    { codigo: 30, nombre: 'Movil' }
  ];
  esInternoQuejas: any = [
    { codigo: 36, nombre: 'Presentada' },
    { codigo: 37, nombre: 'Analisis' }
  ];
  esExternoQuejas: any = [
    { codigo: 34, nombre: 'Presentada' },
    { codigo: 35, nombre: 'En Analisis' }
  ];
  puntosRegion: any = [];


  fechaActual = new Date();

  estado = false;
  showError = false;
  mensajeError = '';


  constructor(private servicio: ServicioService, private genericService: GenericService) {

    // Formulario para los filtros
    this.searchForm = new FormGroup({
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
      numQueja: new FormControl('', Validators.required),
      region: new FormControl('', Validators.required),
      puntoAtencion: new FormControl('', Validators.required)
    });
   }


  async ngOnInit() {

    // Metodo para obtener puntos
    await this.servicio.getPuntos().toPromise().then(res => {
      res.forEach(element => {
        let punto = { 
          id: element.id_punto_atencion,
          nombre: element.nombre,
          region: element.region,
          estado: element.estado
        };
        this.puntosAtencion.push(punto);
      });
      console.log('Puntos de atencion ', this.puntosAtencion);
    }).catch(e => console.log('Ocurrio un error ', e))

    // Metodo para obtener quejas
    await this.servicio.getQueja().toPromise().then(res => {
      res.forEach((element, i = 0) => {
        i++;
        let queja = {
          numqueja: i,
          tipoqueja: element.codigo,
          puntoatencion: element.punto_atencion,
          estado: element.cod_estado_interno,
          etapa: element.cod_estado_externo,
          resultado: 'pendiente',
          medioingreso: element.cod_medio_ingreso,
          fechacreacion: moment(element.fecha_ingreso).format('DD/MM/YYYY'),
          tiempoatencion: 'pendiente',
          detalle: 'ver',
        };
        this.quejas.push(queja);
      });
      console.log('Listado de Quejas ', this.quejas);
      this.dataSource = new MatTableDataSource(this.quejas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }).catch(e => console.log('Ocurrio un error ', e))
  }

  public async generarReporte() {

    console.log('Validacion de los filtros ', this.searchForm.value);

    if (!this.searchForm.valid) {return 0};
    
    this.estado = true;

    // Objeto con los valores de busqueda
    const params = {
      fdesde: moment(this.searchForm.get('fechaDesde').value).format('DD/MM/YYYY'),
      fhasta: moment(this.searchForm.get('fechaHasta').value).format('DD/MM/YYYY'),
      nqueja: this.searchForm.get('numQueja').value,
      region: this.returnValue(this.searchForm.get('region').value),
      patencion: this.returnValue(this.searchForm.get('puntoAtencion').value)
    }

    

    // Metodo para extraer datos obtenido de quejas
    

    

  }

  public getPuntosRegion(id: number): void {
    this.puntosRegion = this.puntosAtencion.filter(e => e.region === id);
    console.log('estos son los puntos de atencion de una region ',this.puntosRegion);
  }

  public dateChangeValidator($event, control: FormControl) {
    dateChangeValidator($event, control);
  }

  public filterKey(event) {
    if (event.charCode === 13) {
      this.applyFilter();
    }
  }

  public applyFilter() {
    this.filtered = true;
    this.refrescarBusqueda();
    return;
  }

  public refrescarBusqueda() {
    return
  }

  public returnValue(dato: string) {
    if (dato === 'TODOS' || dato === '' || dato === null) {
      return null
    }

    return dato.toUpperCase()
  }

  public generarArchivo(boton: HTMLElement) {

    let encabezado = {
      tipoInforme: `${this.tipoReporte.toUpperCase()}`
    }


    if (boton.id === 'pdf') {
      this.genericService.generatePdf(
          encabezado,
          this.dataSource.data,
        ).catch(err => console.log('Ocurrio un error al generar el pdf ', err))
    } else if (boton.id === 'excel') {
      this.genericService.generateExcel(
        encabezado,
        this.dataSource.data,
      ).catch(err => console.log('Ocurrio un error al generar el excel ', err));
    }
  }

}

export interface Reporte {
  numQueja: number;
  tipoQueja: string;
  puntoAtencion: string;
  estado: string;
  etapa: string;
  resultado: string;
  medioDeIngreso: string;
  fechaCreacion: string;
  tiempoAtencion: string;
  detalle: any;
}