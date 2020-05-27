import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator/';
import { MatTableDataSource } from '@angular/material/table/';
import * as moment from 'moment';
import { ServicioService } from 'app/servicios/servicio.service';
import { dateChangeValidator } from 'app/utils/utils.interface';


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

  reporteForm: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  filtered: boolean;

  showReporte = false;


  fechaDesde = new FormControl(moment(), Validators.required);
  fechaHasta = new FormControl(moment(), Validators.required);
  numQueja: any;
  puntoAtencion: string;
  listadoPuntAtencion: any [];
  listadoRegiones: any [];


  maxFecha = new Date();
  minFecha = new Date(2000, 0, 1);
  lsRegiones = [];
  lsPersonas = [];
  lsUsuarios = [];
  puntosAtencion: any = [];
  regiones: any = [
    { codigo: 1, nombre: 'Central' },
    { codigo: 2, nombre: 'Sur' },
    { codigo: 3, nombre: 'Occidente' },
    { codigo: 4, nombre: 'Nororiente' }
  ];
  puntosRegion: any = [];

  fechaActual = new Date();

  showError = false;
  mensajeError = '';


  constructor(private servicio: ServicioService) {

    // Formulario para los filtros
    this.searchForm = new FormGroup({
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
      numQueja: new FormControl('', Validators.required),
      region: new FormControl('', Validators.required),
      puntoAtencion: new FormControl('', Validators.required)
    });
   }
   
  showNotification(from, align){
      const type = ['','info','success','warning','danger'];

      const color = Math.floor((Math.random() * 4) + 1);

      $.notify({
          icon: "notifications",
          message: "Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer."

      },{
          type: type[color],
          timer: 4000,
          placement: {
              from: from,
              align: align
          },
          template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
            '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
            '<i class="material-icons" data-notify="icon">notifications</i> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
              '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
      });
  }
  async ngOnInit() {
    await this.servicio.getPuntos().toPromise().then(res => {
      res.forEach(element => {
        let punto = { id: element.id_punto_atencion, nombre: element.nombre, region: element.region, estado: element.estado };
        this.puntosAtencion.push(punto);
      });
      console.log('Puntos de atencion ', this.puntosAtencion);
    }).catch(e => console.log('Ocurrio un error ', e))
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