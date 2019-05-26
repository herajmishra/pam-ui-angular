import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router: Router) { }

  checkLogin() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['dashboard']);
      return false;
    }
  }
}
