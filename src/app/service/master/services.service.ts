import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

    public action = 0;
    public GservDetails: any;
    public taxDetails: any;
    public taxCountDetails: any;
    public servID: number;
    public servName = '';
    public servTaxID: number;
    public servTaxName = '';
    public disableText = false;

  constructor() { }
}
