export class SilabasCastillano {

    listaSilabas:string[] = [];

    constructor() {
        let silabasCastillano = [
            'ma',
            'ca',
            'sa',
            'po',
            'cu',
            'to'      
        ];
        for(let silaba of silabasCastillano) {
            this.listaSilabas.push( silaba );
        }
    }
}