import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioService } from 'app/servicios/servicio.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { element } from 'protractor';
import { FormGroup, FormControl, Validators, EmailValidator } from '@angular/forms';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import * as moment from 'moment';
import Swal from 'sweetalert2';


declare interface REGION {
  id: number;
  nombre: string;
}

declare interface ESTADO {
  id: number;
  nombre: string;
}



@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {

  constructor(private servicio: ServicioService) {
    this.usuarioFormulario = new FormGroup({
      region: new FormControl('', Validators.required),
      puntoAtencion: new FormControl('', Validators.required),
      dpi: new FormControl('',Validators.required),
      nombre: new FormControl('',Validators.required),
      email: new FormControl('',Validators.required),
      cargo: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    });

    this.usuarioActualizacionForm = new FormGroup({
      emailUsuario: new FormControl({ value: '' },[ Validators.required, Validators.email]),
      cargoUsuario: new FormControl({ value: '' }, Validators.required),
      estadoUsuario: new FormControl({ value: ''}, Validators.required)

    });
   }

  displayedColumns: string[] = ['id', 'cui', 'nombre', 'email', 'punto','cargo','estado','acciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  usuarioFormulario: FormGroup;
  usuarioActualizacionForm: FormGroup;

   usuario: any = {
    email: '',
    cargo: '',
    estado: ''
  };
    puntosAtencion: any = [
      
    ];

    regiones: any = [
      { codigo: 1, nombre: 'Central' },
      { codigo: 2, nombre: 'Sur' },
      { codigo: 3, nombre: 'Occidente' },
      { codigo: 4, nombre: 'Nororiente' }
    ];

    estados: ESTADO[] = [
      { id: 1, nombre: 'Activo' },
      { id: 2, nombre: 'Inactivo' }
    ];

    cargos: any = [];
    usuarios: any = [];
    puntosRegion: any = [];
    ip: string;

  async ngOnInit() {
    this.servicio.getIp()
    .subscribe(res => {
      this.ip = res.ip;
    }, err => console.log('Hubo un error al obtener la ip ', err));

    this.cargos = await this.getDatos(2).catch(e => console.log('Ocurrio un error ', e));
    console.log('estos son los puestos ',this.cargos);
    
    await this.servicio.getPuntos().toPromise().then(res => {
      res.forEach(element => {
        let punto = { id: element.id_punto_atencion, nombre: element.nombre, region: element.region, estado: element.estado };
        this.puntosAtencion.push(punto);
      });
      console.log('Puntos de atencion ', this.puntosAtencion);
    }).catch(e => console.log('Ocurrio un error ', e))

    await this.servicio.getUsuarios().toPromise().then(res => {
      console.log('esta es la respuesta del servicio',res);
      res.forEach(element => {
        let usuario = {id: element.id_usuario, cui: element.cui, nombre: element.nombre, email: element.email, punto: element.punto, estado: element.estado, cargo: element.cod_cargo};
        console.log(usuario);
        this.usuarios.push(usuario);
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })  
    }).catch(e => console.log('Ocurrio un error ', e))
  }

  public getEstado(id: number): string {
    let estado = this.estados.find(e => e.id === id).nombre;
    return estado;
  }

  public getCargo(id: number): string {
    let cargo = this.cargos.find(e => e.codigo === id).nombre;
    return cargo;
  }

  /* public getPuntoAtencion(id: number): string {
    let puntoAtencion = this.puntosAtencion.find(e => e.id === id).nombre;
    return puntoAtencion;
  } */

  public async guardarUsuario() {
    let usuario = this.usuarioFormulario.value;
    let dato = {
        "codigo": usuario.puntoAtencion,
        "cui": usuario.dpi,
        "nombre": usuario.nombre,
        "email": usuario.email,
        "estado": 1,
        "cod_cargo": usuario.cargo,
        "cod_rol": 2,
        "usuario_agrega": sessionStorage.getItem('username'),
        "usuario_modifica": sessionStorage.getItem('username'),
        "fecha_ingreso": moment().format('YYYY-MM-DD hh:mm:ss'),
        "fecha_modifica": moment().format('YYYY-MM-DD hh:mm:ss'),
        "ip_agrega": this.ip,
        "ip_modifica": this.ip,
        "password": usuario.password
    }
    console.log(this.usuarioFormulario.value);
    console.log('esta es la variable dato', dato);
    await this.servicio.postUsuario(dato).toPromise().then(e => console.log('esta es la respuesta del post ', e)).catch(e => console.log('Ocurrio un error ', e));
  }

  public async getDatos(codigo: number): Promise<any> {
    const result = await this.servicio.getDatoCatalogo(codigo).toPromise();
    return result;
  }

  public getPuntosRegion(id: number): void {
    this.puntosRegion = this.puntosAtencion.filter(e => e.region === id);
    console.log('estos son los puntos de atencion de una region ',this.puntosRegion);
  }

  // Metodo para editar usuarios
  public editar(usuario: any, i: number): void {
    console.log('this is the value of usuario ', usuario)
    this.usuarioActualizacionForm.get('emailUsuario').setValue(usuario.email);
    this.usuarioActualizacionForm.get('cargoUsuario').setValue(usuario.cargo);
    this.usuarioActualizacionForm.get('estadoUsuario').setValue(usuario.estado);
    this.usuario = usuario;
    this.usuario.index = i;
    console.log(this.usuarioActualizacionForm.value);
    console.log(this.usuario);
    console.log(this.usuarios);
  }

  public actualizarUsuario() {
    console.log('Usuario ', this.usuarioActualizacionForm.value);
    console.log('Actualizar!');
    let enviando = Swal
    enviando.fire('Enviando...');
    let dato = {
      id: this.usuario.id,
      cui: this.usuario.cui,
      email: this.usuarioActualizacionForm.get('emailUsuario').value,
      puntoAtencion: this.puntosAtencion.find(e => e.nombre === this.usuario.punto).id,
      cod_cargo: this.usuarioActualizacionForm.get('cargoUsuario').value,
      estado: this.usuarioActualizacionForm.get('estadoUsuario').value,
      usuarioModifica: sessionStorage.getItem('username'),
      fechaModifica: moment().format('YYYY-MM-DD hh:mm:ss'),
      ipModifica: this.ip
    }
    console.log(dato);

    this.servicio.updateUsuario(dato)
      .subscribe(res => {
        if(res.status === 1) {
          enviando.close();
          this.usuarios[this.usuario.index].email = dato.email;
          this.usuarios[this.usuario.index].cargo = dato.cod_cargo;
          this.usuarios[this.usuario.index].estado = dato.estado;
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


}
