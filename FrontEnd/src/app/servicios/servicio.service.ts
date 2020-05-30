import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { catchError, retry } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: "root",
})
export class ServicioService {
  constructor(private http: HttpClient) {}

  BASE_URL = `${environment.BASE_URL}/api`;
  URL_CATALOGOS = `${this.BASE_URL}/catalogos`;
  URL_LOGIN = `${this.BASE_URL}/login`;
  URL_CAPTCHA = `${this.BASE_URL}/token_validate`;
  URL_PUNTOS = `${this.URL_CATALOGOS}/puntos`;
  URL_QUEJAS = `${this.BASE_URL}/quejas`;

  URL_EMPLEADOS =`${this.BASE_URL}/empleados`;
  URL_USUARIOS = `${this.BASE_URL}/usuarios`;
 
  /* LOGIN = btoa(`${sessionStorage.getItem('username')}:${sessionStorage.getItem('password')}`);
  AUTH = `Basic ${this.LOGIN}`; */

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
    }),
  };

  httpOptions2 = {
    headers: new HttpHeaders({
      "Content-Type": "multipart/form-data",
      Accept: "*/*",
    }),
  };

  public sendToken(token): Observable<any> {
    return this.http
      .post<any>(this.URL_CAPTCHA, { recaptcha: token })
      .pipe(retry(3), catchError(this.handleError))
      .map((res) => res);
  }

  public getDatoCatalogo(pCodCatalogo): Observable<any> {
    return this.http
      .get<any>(`${this.URL_CATALOGOS}/dato/${pCodCatalogo}`, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError))
      .map((res) => res);
  }

  public postPuntoAtencion(pDato): Observable<any> {
    return this.http
      .post<any>(`${this.URL_CATALOGOS}/insertar-dato`, pDato, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError))
      .map((res) => res);
  }

  public postDatoCatalogo(pDato): Observable<any> {
    return this.http
      .post<any>(
        `${this.URL_CATALOGOS}/insertar-dato-catalogo`,
        pDato,
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError))
      .map((res) => res);
  }

  public postQueja(pDato): Observable<any> {
    return this.http.post<any>(`${this.URL_QUEJAS}/agregar`, pDato,this.httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
      .map(res => res);
  }

  
  public getQueja(): Observable<any> {
    return this.http.get<any>(this.URL_QUEJAS, this.httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
      .map(res => res);
  }

  public getEmpleado(): Observable<any> {
    return this.http.get<any>(this.URL_EMPLEADOS, this.httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
      .map(res => res);
  }

  public getUsuario(userLogin: any): Observable<any> {
    return this.http
      .post<any>(this.URL_LOGIN, userLogin)
      .pipe(retry(3), catchError(this.handleError))
      .map((res) => res);
  }

  public getPuntos(): Observable<any> {
    return this.http
      .get<any>(this.URL_PUNTOS, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError))
      .map((res) => res);
  }

  public getIp(): Observable<any> {
    return this.http.get<any>('https://api.ipify.org?format=json')
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
      .map(res => res);
  }

  public updatePunto(punto): Observable<any> {
    return this.http
      .put<any>(
        `${this.URL_CATALOGOS}/actualizar-punto-atencion`,
        punto,
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError))
      .map((res) => res);
  }

  public getUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.URL_USUARIOS}/listado`, this.httpOptions)
      .map(res => res);
  }

  public updateUsuario(usuario): Observable<any> {
    return  this.http.put<any>(`${this.URL_USUARIOS}/actualizar/${usuario.id}`, usuario, this.httpOptions)
    .pipe(
      retry(3),
      catchError(this.handleError)
    )
    .map(res => res);
  }

  public updateQueja(queja): Observable<any> {
    return  this.http.put<any>(`${this.URL_QUEJAS}/actualizar/${queja.id}`, queja, this.httpOptions)
    .pipe(
      retry(3),
      catchError(this.handleError)
    )
    .map(res => res);
  }

  public postUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.URL_USUARIOS}/agregar`,usuario,this.httpOptions)
      .map(res => res);
  }
  public updateDatoCatalogo(dato): Observable<any> {
    return this.http
      .put<any>(
        `${this.URL_CATALOGOS}/actualizar-dato-catalogo`,
        dato,
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError))
      .map((res) => res);
  }

  public enviarQueja(form: any): Observable<any> {
    return this.http
      .post<any>(
        `${this.URL_QUEJAS}/agregar-portal`,
        form
      )
      .pipe(retry(3), catchError(this.handleError))
      .map((res) => res);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
      // Notificarle al cliente que ocurrio un error en el servidor
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text:
          "Ocurrio un error al intentar contactar con el servidor, intente mas tarde",
      });
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
}
