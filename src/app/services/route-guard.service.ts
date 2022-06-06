import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate{

  constructor(private router: Router,
              private auth: AuthService) { }

  // parametri necessari per verificare lìautorizzazione ad atilizzare la rotta (eseguito login)
  canActivate(route: ActivatedRouteSnapshot, stato: RouterStateSnapshot) {
    if(this.auth.isUserLoggedIn()) {
      return true;
    }  else {
      this.router.navigate(['login']);
    }
  }
}
