import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { ServicioService } from 'app/servicios/servicio.service';

@Component({
  selector: 'app-quejas-denuncias',
  templateUrl: './quejas-denuncias.component.html',
  styleUrls: ['./quejas-denuncias.component.css']
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
      recaptchaReactive: new FormControl(null, Validators.required)
    });
  }

  quejaForm: FormGroup;
  reactiveForm: FormGroup;
  siteKey: string = environment.site_key;
  nombreArchivo: string = '';
  archivo: File;
  caracteres: number = 0;

  recaptchaValido: boolean = false;
  
  oficinas: any[] = [
    { codigo: 1, nombre: 'Prueba' }
  ];

  ngOnInit(): void {
  }

  async resolved(captchaResponse: string, res) {
    console.log(`Resolved response token: ${captchaResponse}`);
    await this.sendTokenToBackend(captchaResponse); //declaring the token send function with a token parameter
  }

  sendTokenToBackend(tok){
    // Realzo la petición para validar el token
    this.service.sendToken(tok).subscribe(data => {
        console.log(data)
        this.recaptchaValido = data.success;
      },
      err => {
        console.log(err)
      },
      () => {}
    );
  }

  // Metodo para recuperar el archivo que adjunte el cliente
  
  handleFile(archivos: FileList) {
    
    if ((archivos[0].size / 1048576) > 10) {
      console.warn("El archivo es muy grande ", archivos[0].size);
      this.nombreArchivo = 'El archivo es muy grande, el maximo son 10 MB';
      return;
    }

    if (archivos[0].type !== ("application/pdf" || "image/png" || "image/jpeg")) {
      this.nombreArchivo = 'El formato no es el correcto, los formatos validos son (.pdf, .png y .jpeg)';
      return;
    }
    this.archivo = archivos[0];
    this.nombreArchivo = this.archivo.name;
    console.log('Archivos ', this.archivo);
  }

  enviarQueja() {

    console.log(this.quejaForm);
    console.log(this.archivo);
    const formData = new FormData();
    formData.append('nombre', 'dsafd');
    formData.append('email', this.quejaForm.get('email').value);
    formData.append('telefono', this.quejaForm.get('telefono').value);
    formData.append('oficina', this.quejaForm.get('oficina').value);
    formData.append('empleado', this.quejaForm.get('empleado').value);
    formData.append('detalle', this.quejaForm.get('detalle').value);
    formData.append('archivo', this.archivo, this.archivo.name);

    console.log('Formulario ', formData.getAll('file'));

    this.service.enviarQueja(formData)
      .subscribe(res => console.log('Respuesta ', res)
      ,err => console.error('Ocurrio un error ', err));
  }

  contar() {
    
    this.caracteres = this.quejaForm.get('detalle').value.length;
  }

}
