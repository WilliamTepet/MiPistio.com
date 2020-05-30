import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Queja } from '../modelos/QuejaModelo';
import * as moment from 'moment';
import 'datatables.net';
import 'datatables.net-bs4';
import { ServicioService } from 'app/servicios/servicio.service';
import { TableListComponent} from 'app/table-list/table-list.component';

declare interface ESTADO {
  id: number;
  nombre: string;
}

declare interface DATO {
  //codigo: number;
  id_usuario: number;
  nombre_cliente: string;
  email: string;
  telefono: number;
  punto_atencion: String;
  nombre_empleado:string;
  descripcion:string;
  tipo_queja:string;
  cod_medio_ingreso:number;
  cod_tipo_queja: number;
  cod_estado_externo:number;
  cod_estado_interno:number;
  cod_tipo_ingreso:number;
  archivo:string
  usuarioAgrega: string;
  usuarioModifica: string;
  fechaIngreso: string;
  fechaModifica: string;
  anio: string;
  respuesta: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-quejas',
  templateUrl: './quejas.component.html',
  styleUrls: ['./quejas.component.css']
})
export class QuejasComponent implements OnInit {
  quejasForm: FormGroup;
  quejasActualizacionForm: FormGroup;

  constructor(private servicio: ServicioService) { 
    this.quejasForm = new FormGroup({
      nombreCliente: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      puntoAtencion: new FormControl('', Validators.required),
      empleado: new FormControl('', Validators.required),
      medio_ingreso: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required)
    });

    this.quejasActualizacionForm = new FormGroup({
      nombreCliente: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      puntoAtencion: new FormControl('', Validators.required),
      empleado: new FormControl('', Validators.required),
      medio_ingreso: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required)
    });

  }
  
  displayedColumns: string[] = ['codigo','cliente', 'correo', 'telefono', 'puntoAtencion', 'empleado',/*'medio_ingreso',*/'descripcion','acciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
 
  
  queja: any = {
    cliente: '',
    correo: '',
    telefono: '',
    puntoAtencion: '',
    empleado: '',
    //medio_ingreso:'',
    descripcion: ''
  };

  //puntoUpdate: PuntoAtencion;

  quejas: any[] = [];
  puntos: any[];
  empleados: any [];

  medios_ingreso: any = [
    { codigo: 26, nombre: 'Telefono' },
    { codigo: 27, nombre: 'Correo' },
    { codigo: 28, nombre: 'Chat' },
    { codigo: 29, nombre: 'Presencial' },
    { codigo: 30, nombre: 'Movil' }
  ];

  ip: string;
  catalogos: any = [];

  async ngOnInit() {
    this.empleados = [];
    this.quejas = [];
    this.puntos = [];
    this.servicio.getIp()
      .subscribe(res => {
        this.ip = res.ip;
      }, err => console.log('Hubo un error al obtener la ip ', err));
    
      //Componente para obtener quejas
    await this.servicio.getQueja().toPromise().then(res => {
      res.forEach(element => {
        let queja = { id: element.id_queja, codigo: element.codigo, cliente: element.nombre_cliente, correo: element.email, 
          telefono: element.telefono, puntoAtencion: element.punto_atencion, empleado: element.nombre_empleado, 
          medio_ingreso: element.cod_medio_ingreso, descripcion: element.descripcion };
        this.quejas.push(queja);
      });
      console.log('Listado de Quejas ', this.quejas);
      this.dataSource = new MatTableDataSource(this.quejas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }).catch(e => console.log('Ocurrio un error ', e))

    //Componente para obtener nombres de puntos
    await this.servicio.getPuntos().toPromise().then(res => {
      res.forEach(element2 => {
        let punto = { nombre: element2.nombre, estado: element2.estado };
        let puntoActivo = this.getEstado(element2.estado);
        if (puntoActivo == "activo"){
          punto = {nombre: punto.nombre, estado: punto.estado}
          this.puntos.push(punto);
        }
        else{
          console.log('Puntos Inactivos');
        }
      });
        console.log('Listado de Puntos Activos ', this.puntos);
    }).catch(e => console.log('Ocurrio un error ', e))

    //Componente para obtener nombres de empleados
    await this.servicio.getEmpleado().toPromise().then(res => {
      res.forEach(element3 => {
        let empleado = { nombre: element3.nombre, estado: element3.estado };
        let empleadoActivo = this.getEstado(element3.estado);
        if (empleadoActivo == "activo"){
          empleado = {nombre: empleado.nombre, estado: empleado.estado}
          this.empleados.push(empleado);
        }
        else{
          console.log('Empleados Inactivos');
        }
      });
        console.log('Listado de Empleados Activos ', this.empleados);
    }).catch(e => console.log('Ocurrio un error ', e))

  }

  public getEstado(id: number) {
    let puntosComponent = new TableListComponent(this.servicio);
    let estadoPunto = puntosComponent.getEstado(id);
    return estadoPunto;
  }

  public async getEmpleados(){
    this.empleados = [];
    await this.servicio.getEmpleado().toPromise().then(res => {
      res.forEach(element => {
        let empleado = { nombre: element.nombre, estado: element.estado };
        let empleadoActivo = this.getEstado(element.estado);
        //let nomPunto {nombre: puntoActivo};
        if (empleadoActivo == "activo"){
          empleado = {nombre: empleado.nombre, estado: empleado.estado}
          this.empleados.push(empleado);
          console.log('lista de empleados', this.empleados);
        }
        else{
          console.log('Empleados Inactivos');
        }
      });
        console.log('Listado de Empleados Activos ', this.empleados);
    }).catch(e => console.log('Ocurrio un error ', e))
  }


  public async guardarQueja() {
    console.log('Click');
    console.log(this.quejasForm.value);
    let nuevaQueja: Queja = new Queja(
      this.quejas.length + 1,
      this.quejasForm.value.nombreCliente,
      this.quejasForm.value.email,
      this.quejasForm.value.telefono,
      this.quejasForm.value.puntoAtencion,
      this.quejasForm.value.empleado,
      this.quejasForm.value.medio_ingreso,
      this.quejasForm.value.descripcion
    );

    let dato: DATO = {
      nombre_cliente: this.quejasForm.value.nombreCliente,
      email: this.quejasForm.value.email,
      telefono: this.quejasForm.value.telefono,
      punto_atencion: this.quejasForm.value.puntoAtencion,
      nombre_empleado: this.quejasForm.value.empleado,
      cod_medio_ingreso: this.quejasForm.value.medio_ingreso,
      descripcion: this.quejasForm.value.descripcion,
      tipo_queja: 'QMS',
      cod_tipo_queja: 31,
      cod_estado_externo: 34,
      cod_estado_interno: 36,
      cod_tipo_ingreso: 38,
      archivo:'',
      respuesta: 'Ingresada exitosamente su queja',
      //usuarioAgrega: sessionStorage.getItem('username'),
      usuarioAgrega:'filberto',
      id_usuario: 102,
      usuarioModifica: '',
      anio: moment().format('YYYY'),
      fechaIngreso: moment().format('YYYY-MM-DD hh:mm:ss A Z'),
      fechaModifica: moment().format('YYYY-MM-DD hh:mm:ss A Z')
    }

    await this.servicio.postQueja(dato).toPromise().then(res => {
      if (res.status) {
        Swal.fire(`${res.mensaje}`);
        this.quejas.push(nuevaQueja);
        this.dataSource = new MatTableDataSource(this.quejas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
      .catch(err => {
        console.log('Ocurrio un error');
        Swal.fire({
          icon: 'error',
          title: 'Error al insertar!',
          text: 'No se pudo guardar la queja solicitada'
        })
      })

    console.log(nuevaQueja);
    console.log('Dato ', dato)
  }

  
  /*public getRegion(codigo: any): string {
    // console.log(this.regiones.find(e => e.codigo === codigo));
    let nombre = this.regiones.find(e => e.codigo === codigo).nombre
    return nombre;
  }

  public getEstado(id: number): string {
    let estado = this.estados.find(e => e.id === id).nombre;
    return estado;
  }*/

  //Metodo para editar quejas
  public editar(queja: any, i: number): void {
    console.log("valor de queja",queja);
    this.quejasActualizacionForm.get('nombreCliente').setValue(queja.cliente);
    this.quejasActualizacionForm.get('email').setValue(queja.correo);
    this.quejasActualizacionForm.get('telefono').setValue(queja.telefono);
    this.quejasActualizacionForm.get('puntoAtencion').setValue(queja.puntoAtencion);
    this.quejasActualizacionForm.get('empleado').setValue(queja.empleado);
    this.quejasActualizacionForm.get('medio_ingreso').setValue(queja.medio_ingreso);
    this.quejasActualizacionForm.get('descripcion').setValue(queja.descripcion);
    this.queja = queja;
    this.queja.index = i;
    console.log(this.quejasActualizacionForm.value);
    console.log(this.queja);
    console.log(this.quejas);
  }

  public actualizarQueja() {
    console.log('Queja ', this.quejasActualizacionForm.value);
    console.log('Actualizar!');
    let enviando = Swal
    enviando.fire('Enviando...');
    let dato = {
      id: this.queja.id,
      nombre_cliente: this.quejasActualizacionForm.get('nombreCliente').value,
      email: this.quejasActualizacionForm.get('email').value,
      telefono: this.quejasActualizacionForm.get('telefono').value,
      punto_atencion: this.quejasActualizacionForm.get('puntoAtencion').value,
      nombre_empleado: this.quejasActualizacionForm.get('empleado').value,
      cod_medio_ingreso: this.quejasActualizacionForm.get('medio_ingreso').value,
      descripcion: this.quejasActualizacionForm.get('descripcion').value,
      cod_estado_externo: 34,
      cod_estado_interno: 36,
      cod_tipo_ingreso: 38,
      archivo:'',
      usuario_modifica: 'Filberto 2',
      fecha_modifica: moment().format('YYYY-MM-DD hh:mm:ss A Z')
    }
    console.log(dato);

    this.servicio.updateQueja(dato)
      .subscribe(res => {
        if(res.status === 1) {
          enviando.close();
          this.quejas[this.queja.index].cliente = dato.nombre_cliente;
          this.quejas[this.queja.index].correo = dato.email;
          this.quejas[this.queja.index].telefono = dato.telefono;
          this.quejas[this.queja.index].puntoAtencion = dato.punto_atencion;
          this.quejas[this.queja.index].empleado = dato.nombre_empleado;
          this.quejas[this.queja.index].descripcion = dato.descripcion;
          //this.quejas[this.queja.index].correo = dato.email;
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
