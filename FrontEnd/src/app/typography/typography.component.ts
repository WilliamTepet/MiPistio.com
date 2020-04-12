import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioService } from 'app/servicios/servicio.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { element } from 'protractor';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import * as moment from 'moment';


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
   }

  displayedColumns: string[] = ['id', 'cui', 'nombre', 'email', 'cargo','estado','acciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  usuarioFormulario: FormGroup;

    puntosAtencion: any = [
      
    ];

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
      console.log(res);
      res.forEach(element => {
        let usuario = { cui: element.cui, nombre: element.nombre, email: element.email, estado: element.estado, cargo: element.cod_cargo};
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
        "fecha_ingreso": moment().format('YYYY-MM-DD hh:mm:ss A Z'),
        "fecha_modifica": moment().format('YYYY-MM-DD hh:mm:ss A Z'),
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

}