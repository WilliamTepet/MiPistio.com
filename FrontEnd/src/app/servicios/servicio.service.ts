import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private http: HttpClient) { }

  BASE_URL = `${environment.BASE_URL}/api`;
  URL_CATALOGOS = `${this.BASE_URL}/catalogos`;
  URL_LOGIN = `${this.BASE_URL}/login`;
  URL_PUNTOS =`${this.URL_CATALOGOS}/puntos`;
 
  LOGIN = btoa(`${sessionStorage.getItem('username')}:${sessionStorage.getItem('password')}`);
  AUTH = `Basic ${this.LOGIN}`;
  
  
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': this.AUTH
    })
  };

  public getDatoCatalogo(pCodCatalogo): Observable<any> {
    return this.http.get<any>(`${this.URL_CATALOGOS}/dato/${pCodCatalogo}`, this.httpOptions)
      .map(res => res);
  }

  public postDatoCatalogo(pDato): Observable<any> {
    return this.http.post<any>(`${this.URL_CATALOGOS}/insertar-dato`, pDato,this.httpOptions)
      .map(res => res);
  }

  public getUsuario(userLogin: any): Observable<any> {
    return this.http.post<any>(this.URL_LOGIN, userLogin)
      .map(res => res);
  }

  public getPuntos(): Observable<any> {
    return this.http.get<any>(this.URL_PUNTOS, this.httpOptions)
      .map(res => res);
  }

  public getIp(): Observable<any> {
    return this.http.get<any>('https://api6.ipify.org/?format=json')
      .map(res => res);
  }


}
