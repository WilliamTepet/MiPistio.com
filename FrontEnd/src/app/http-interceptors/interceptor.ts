import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from 'app/auth/auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class Interceptor implements HttpInterceptor {

    constructor(private auth: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const authLogin = this.auth.getAuthorization();
        let authReq;
        console.log('Peticion ', req.url);
        console.log('Peticion ', req.url.split('/').find(e => e === 'api'));

        // Seteo en las cabeceras la autenticación cuando no se realice desde los servicios
        if (req.url.split('/').find(e => e === 'api') !== undefined) {
            authReq = req.clone({ setHeaders: { Authorization: authLogin }});
        } else {
            authReq = req;
        }
        


        return next.handle(authReq);
    }
}