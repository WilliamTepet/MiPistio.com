import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { ServicioService } from 'app/servicios/servicio.service';
import { TableListComponent } from 'app/table-list/table-list.component';
import * as moment from "moment";
import Swal from 'sweetalert2';

@Component({
  selector: "app-quejas-denuncias",
  templateUrl: "./quejas-denuncias.component.html",
  styleUrls: ["./quejas-denuncias.component.css"],
})
export class QuejasDenunciasComponent implements OnInit {
  constructor(private service: ServicioService) {
    this.quejaForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      telefono: new FormControl("", Validators.required),
      oficina: new FormControl(""),
      empleado: new FormControl(""),
      detalle: new FormControl("", Validators.required),
      archivo: new FormControl(""),
    });

    this.reactiveForm = new FormGroup({
      recaptchaReactive: new FormControl(null, Validators.required),
    });
  }

  quejaForm: FormGroup;
  reactiveForm: FormGroup;
  siteKey: string = environment.site_key;
  nombreArchivo: string = "";
  archivo: File;
  caracteres: number = 0;
  puntos: any[] = [];
  empleados: any[] = [];
  nueva: boolean = false;

  recaptchaValido: boolean = false;

  oficinas: any[] = [{ codigo: 1, nombre: "Prueba" }];

  async ngOnInit() {
    //Componente para obtener nombres de puntos
    await this.service.getPuntos()
      .toPromise()
      .then((res) => {
        res.forEach((element2) => {
        let punto = {
          nombre: element2.nombre,
          estado: element2.estado,
        };
        let puntoActivo = this.getEstado(element2.estado);
        if (puntoActivo == "activo") {
          punto = {
            nombre: punto.nombre,
            estado: punto.estado,
          };
          this.puntos.push(punto);
        } else {
          console.log("Puntos Inactivos");
        }
      });
      console.log("Listado de Puntos Activos ", this.puntos);
    }).catch((e) => console.log("Ocurrio un error ", e));

    //Componente para obtener nombres de empleados
    await this.service
      .getEmpleado()
      .toPromise()
      .then((res) => {
        res.forEach((element3) => {
          let empleado = {
            nombre: element3.nombre,
            estado: element3.estado,
          };
          let empleadoActivo = this.getEstado(element3.estado);
          if (empleadoActivo == "activo") {
            empleado = {
              nombre: empleado.nombre,
              estado: empleado.estado,
            };
            this.empleados.push(empleado);
          } else {
            console.log("Empleados Inactivos");
          }
        });
        console.log("Listado de Empleados Activos ", this.empleados
        );
      })
      .catch((e) => console.log("Ocurrio un error ", e));
  }

  async resolved(captchaResponse: string, res) {
    console.log(`Resolved response token: ${captchaResponse}`);
    await this.sendTokenToBackend(captchaResponse); //declaring the token send function with a token parameter
  }

  sendTokenToBackend(tok) {
    // Realzo la petición para validar el token
    this.service.sendToken(tok).subscribe(
      (data) => {
        console.log(data);
        this.recaptchaValido = data.success;
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }

  // Metodo para recuperar el archivo que adjunte el cliente

  handleFile(archivos: FileList) {
    if (archivos[0].size / 1048576 > 10) {
      console.warn("El archivo es muy grande ", archivos[0].size);
      this.nombreArchivo = "El archivo es muy grande, el maximo son 10 MB";
      return;
    }

    if (
      archivos[0].type !== ("application/pdf" || "image/png" || "image/jpeg")
    ) {
      console.log("Formato archivo ", archivos[0].type);
      this.nombreArchivo =
        "El formato no es el correcto, los formatos validos son (.pdf, .png y .jpeg)";
      return;
    }
    this.archivo = archivos[0];
    this.nombreArchivo = this.archivo.name;
    console.log("Archivos ", this.archivo);
  }

  enviarQueja() {
    console.log(this.quejaForm);
    console.log(this.archivo);
    const formData = new FormData();
    formData.append("anio", moment(new Date()).format('YYYY'));
    formData.append("cod_estado_externo", '34');
    formData.append("cod_estado_interno", '36');
    formData.append("cod_medio_ingreso", '40');
    formData.append("cod_tipo_ingreso", "40");
    formData.append("cod_tipo_queja", "31");
    formData.append("descripcion", this.quejaForm.get("detalle").value);
    formData.append("email", this.quejaForm.get("email").value);
    formData.append("fechaIngreso", moment().format("YYYY-MM-DD hh:mm:ss A Z"));
    formData.append("fechaModifica", moment().format("YYYY-MM-DD hh:mm:ss A Z"));
    formData.append("id_usuario", "102");
    formData.append("nombre_cliente", this.quejaForm.get("nombre").value);
    formData.append("nombre_empleado", this.quejaForm.get("empleado").value);
    formData.append("punto_atencion", this.quejaForm.get("oficina").value);
    formData.append("telefono", this.quejaForm.get("telefono").value);
    formData.append("tipo_queja", "QMS");
    formData.append("usuarioAgrega", "filiberto");
    formData.append("usuarioModifica", "");
    formData.append("archivo", this.archivo, this.archivo.name);

    console.log("Formulario ", formData.getAll("archivo"));
    this.quejaForm.disable();
    this.nueva = true;
    this.service.enviarQueja(formData).subscribe(
      (res) => {
        if (res.status) {
          Swal.fire(`${res.mensaje}`);
        }
      },
      (err) => {
        console.log('Ocurrio un error al guardar la queja ', err)
        Swal.fire({
          icon: 'error',
          title: 'Error al insertar!',
          text: 'No se pudo guardar la queja solicitada'
        })
      }
    );
  }

  contar() {
    this.caracteres = this.quejaForm.get("detalle").value.length;
  }

  public getEstado(id: number) {
    let puntosComponent = new TableListComponent(this.service);
    let estadoPunto = puntosComponent.getEstado(id);
    return estadoPunto;
  }

  public nuevaQueja() {
    this.quejaForm.reset();
    this.quejaForm.enable();
    this.nueva = false;
  }
}
