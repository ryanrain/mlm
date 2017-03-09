import { LetraModel } from '../models/letra.model';

export class AlfabetoCastillano {

    alfabeto: LetraModel[] = [];
    // alfabetoCastillano = [];

    constructor() {
        let alfabetoCastillano:LetraModel[] = [
            {
                letra: 'A',
                palabra: 'Aguacate'
            },
            {
                letra: 'B',
                palabra: 'Banano'
            },
            {
                letra: 'C',
                palabra: 'Casa'
            },
            {
                letra: 'D',
                palabra: 'Djlklkj'
            },
            {
                letra: 'E',
                palabra: 'Elefante'
            },
            {
                letra: 'F',
                palabra: 'Fuego'
            },
            {
                letra: 'G',
                palabra: 'Guayaba'
            },
            {
                letra: 'H',
                palabra: 'Helado'
            },
            {
                letra: 'I',
                palabra: 'Iguana'
            },
            {
                letra: 'J',
                palabra: 'Jlkj'
            },
            {
                letra: 'K',
                palabra: 'Klklkj'
            },
            {
                letra: 'L',
                palabra: 'Llkjlkj'
            },
            {
                letra: 'M',
                palabra: 'Mango'
            },
            {
                letra: 'N',
                palabra: 'Nljklkj'
            }        
        ];
        for(let letra of alfabetoCastillano) {
            this.alfabeto.push( letra );
        }
    }
}
// alfabeto = ['a','b','c','ch','d','e','f','g','h','i','j','k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','x','y','z'];