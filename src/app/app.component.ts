import {Compiler, Component} from '@angular/core';
import {AuthService} from './helper/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'ship';

    constructor(private _compiler: Compiler, public authService: AuthService) {
        this._compiler.clearCache();
    }
}
