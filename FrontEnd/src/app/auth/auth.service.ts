import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { ServicioService } from 'app/servicios/servicio.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private servicio: ServicioService) { }

  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(userLogin): Observable<boolean> {

    const login = new Observable<boolean>(subscriber => {
      this.servicio.getUsuario(userLogin).subscribe(res => {
        console.log('resultado login ', res);
        if (res.usuario !== undefined) {
          sessionStorage.setItem('username', res.usuario);
          sessionStorage.setItem('password', res.password);

          this.isLoggedIn = true;
          subscriber.next(true);
          subscriber.complete();
        } else {
          this.isLoggedIn = false;
          subscriber.next(false);
          subscriber.complete();
        }
      }, err => {
        console.log('Ocurrio un error ', err);
      });
    })

    return login;

  }

  logout(): void {
    this.isLoggedIn = false;
  }

  getAuthorization() {
    const LOGIN = btoa(`${sessionStorage.getItem('username')}:${sessionStorage.getItem('password')}`);
    const AUTH = `Basic ${LOGIN}`;
    return AUTH;
  }
}
