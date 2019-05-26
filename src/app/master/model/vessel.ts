export class Vessel {

    public constructor(init?: Partial<Vessel >) {
        Object.assign(this, init);
    }
    id:number;
    name:string;
    imo:number;
    type:string;
    flag:string;
    trade:string;
    grt:number;
    nrt:number;
    reducedGrt:number;
    lengthLbp:number;
    lengthLoa:number;
    beam:number;
    owner:string;
}
