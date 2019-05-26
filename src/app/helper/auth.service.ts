import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public token = '';
    public cid = '';
    constructor() {
        this.token = (localStorage.getItem('token')) ? localStorage.getItem('token') : '';
        this.cid = (localStorage.getItem('cid')) ? atob(localStorage.getItem('cid')) : '';
    }

    getToken() {
        return localStorage.getItem('token');
    }

    loggedIn() {
        return !!localStorage.getItem('token');
    }
}
