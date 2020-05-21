import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let url: string = state.url;
      return this.checkLogin(url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let url: string = state.url;
      return this.canActivate(route, state);
  }

  checkLogin(url: string): boolean {
    
    // valido que exista una sesion para no pedir que inicie sesion
    if (sessionStorage.getItem('username') !== null && sessionStorage.getItem('password') !== null) return true;

    // si no existe una sesion redirijo al login
    console.log('Estatus login ', this.authService.isLoggedIn);
    if (this.authService.isLoggedIn) return true;

    this.authService.redirectUrl = url;

    this.router.navigate(['/login']);
    return false;
  }
  
}
