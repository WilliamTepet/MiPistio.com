import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { ServicioService } from 'app/servicios/servicio.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private servicio: ServicioService) {
    this.formLogin = new FormGroup({
      usuario: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
   }

  formLogin: FormGroup;

  ngOnInit(): void {
  }

  async login() {
    let userLogin = this.formLogin.value;
    let auth = await this.servicio.getUsuario(userLogin).toPromise().catch(e => console.log('Ocurrio un error'));
    if (auth.usuario) {
      sessionStorage.setItem('username', auth.usuario);
      sessionStorage.setItem('password', auth.password);
      this.router.navigate(['table-list']);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas!',
        text: 'Las credenciales ingresadas son incorrectas'
      })
    }
  }

}
