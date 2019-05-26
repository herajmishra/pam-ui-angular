import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptorService {

    constructor(private injector: Injector) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authService = this.injector.get(AuthService);
        const tokenizeReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authService.getToken()}`
            }
        });
        return next.handle(tokenizeReq);
    }
}
