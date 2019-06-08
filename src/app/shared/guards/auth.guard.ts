import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private navController: NavController, private storage: Storage) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.storage.get('jwt').then(jwt => {
      if (jwt) {
        return true;
      } else {
        this.navController.navigateRoot(['/login']);
        return false;
      }
    });
  }
}
