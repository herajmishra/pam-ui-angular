import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../helper/auth.service';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    // identity = 'http://ec2-13-233-242-44.ap-south-1.compute.amazonaws.com:9090/pam/';
    // master = 'http://ec2-13-233-242-44.ap-south-1.compute.amazonaws.com:9091/pam/';
    // pda = 'http://ec2-13-233-242-44.ap-south-1.compute.amazonaws.com:9092/pam/';
    // inflow = 'http://ec2-13-233-242-44.ap-south-1.compute.amazonaws.com:9093/pam/';
    identity = 'http://192.168.6.64:9090/pam/';
    master = 'http://192.168.6.74:9091/pam/';
    pda = 'http://192.168.6.74:9092/pam/';
    inflow = 'http://192.168.6.74:9093/pam/';

    constructor(private http: HttpClient, private authService: AuthService) {
    }

    getRequest(url) {
        const baseUrl = this.checkPort(url);
        return this.http.get(baseUrl);
    }

    getRequestWithHeaders(url, headers) {
        const baseUrl = this.checkPort(url);
        return this.http.get(baseUrl, {headers: headers});
    }

    postRequest(url, data) {
        const baseUrl = this.checkPort(url);
        return this.http.post(baseUrl, data);
    }

    deleteRequest(url) {
        const baseUrl = this.checkPort(url);
        return this.http.delete(baseUrl);
    }

    checkPort(url) {
        const splurl = url.split('/');
        if (url === 'login' || url === 'select-org' || url === 'continue' || url === 'logout') {
            return this.identity + url;
        } else if (splurl[0] === 'pda') {
            return this.pda + url;
        } else if (splurl[0] === 'finance') {
            return this.inflow + url;
        } else {
            return this.master + url;
        }
    }
}
